#!/usr/bin/env ruby
# frozen_string_literal: true
#
# Static sanity checks for the Jekyll site: the class of problem that never
# raises a build error but quietly breaks the published site.
#
#   bundle exec ruby scripts/doctor.rb
#
# Exits non-zero when anything at ERROR level is found.

require "yaml"
require "digest"
require "date"
require "set"

ROOT = File.expand_path("..", __dir__)
Dir.chdir(ROOT)

ERRORS = []
WARNINGS = []

def error(check, message, hint = nil)
  ERRORS << { check: check, message: message, hint: hint }
end

def warn_(check, message, hint = nil)
  WARNINGS << { check: check, message: message, hint: hint }
end

config = YAML.safe_load_file("_config.yml", permitted_classes: [Date, Time], aliases: true)

# --- timezone ------------------------------------------------------------
# A bad tz string does not fail the build; Jekyll falls back to UTC and every
# post date silently shifts.
tz = config["timezone"]
if tz.nil? || tz.to_s.strip.empty?
  warn_("timezone", "no `timezone` set; dates render in the build machine's zone")
else
  zone_file = File.join("/usr/share/zoneinfo", tz.to_s)
  known = File.exist?(zone_file)
  unless known
    begin
      require "tzinfo"
      TZInfo::Timezone.get(tz.to_s)
      known = true
    rescue LoadError, StandardError
      known = false
    end
  end
  unless known
    error("timezone", "`timezone: #{tz}` is not a valid IANA timezone",
          "post dates fall back to UTC. Did you mean Asia/Seoul?")
  end
end

# --- plugins vs Gemfile --------------------------------------------------
# A plugin listed in _config.yml but absent from the Gemfile breaks every
# local build, while GitHub Pages silently ignores it.
gemfile = File.read("Gemfile")
declared_gems = gemfile.scan(/^\s*gem\s+["']([^"']+)["']/).flatten.to_set

Array(config["plugins"]).each do |plugin|
  gem_name = plugin.to_s.tr("/", "-")
  next if declared_gems.include?(gem_name)
  next if declared_gems.include?(plugin.to_s)
  # Plugins bundled inside the theme gem are fine.
  error("plugins", "plugin `#{plugin}` is in _config.yml but not in the Gemfile",
        "local `jekyll build` will fail with a Dependency Error")
end

whitelist = Array(config["whitelist"]).map(&:to_s).to_set
plugins = Array(config["plugins"]).map(&:to_s).to_set
(plugins - whitelist).each do |plugin|
  warn_("plugins", "`#{plugin}` is in plugins but missing from whitelist",
        "it will be skipped when building in --safe mode")
end
(whitelist - plugins).each do |plugin|
  warn_("plugins", "`#{plugin}` is whitelisted but not in plugins")
end

# --- files leaking into the published site --------------------------------
# Anything not excluded gets copied to _site and served publicly.
LEAK_PATTERNS = %w[
  *.gemspec package.json package-lock.json banner.js Rakefile Gemfile
  commit_message.txt *.log .travis.yml
].freeze

excluded = Array(config["exclude"]).map(&:to_s).to_set
leaking = []
LEAK_PATTERNS.each do |pattern|
  Dir.glob(pattern).each do |path|
    next if excluded.include?(path)
    next if excluded.any? { |e| File.fnmatch(e, path) }
    next if path.start_with?(".") && !excluded.include?(path) && File.basename(path).start_with?(".")
    leaking << path
  end
end
leaking.uniq.each do |path|
  warn_("exclude", "`#{path}` is not excluded and will be published to the live site",
        "add it to the `exclude:` list in _config.yml")
end

# --- post front matter ----------------------------------------------------
today = Date.today
permalinks = Hash.new { |h, k| h[k] = [] }

Dir.glob("_posts/**/*.{md,markdown}").sort.each do |path|
  raw = File.read(path, encoding: "utf-8")
  unless raw.start_with?("---")
    error("frontmatter", "#{path} has no YAML front matter")
    next
  end

  _, fm_raw, = raw.split(/^---\s*$/, 3)
  begin
    fm = YAML.safe_load(fm_raw.to_s, permitted_classes: [Date, Time], aliases: true) || {}
  rescue Psych::SyntaxError => e
    error("frontmatter", "#{path}: unparseable front matter — #{e.message}")
    next
  end

  # Jekyll silently drops posts whose filename date is malformed.
  basename = File.basename(path)
  unless basename =~ /\A(\d{4}-\d{2}-\d{2})-/
    error("frontmatter", "#{path}: filename must start with YYYY-MM-DD or the post is not published")
    next
  end
  file_date = Regexp.last_match(1)

  if fm["date"]
    fm_date = fm["date"].to_s[0, 10]
    if fm_date != file_date
      warn_("frontmatter", "#{path}: front matter date #{fm_date} != filename date #{file_date}",
            "the front matter date wins; the URL keeps the filename date")
    end
    begin
      parsed = Date.parse(fm["date"].to_s)
      if parsed > today
        warn_("frontmatter", "#{path}: date #{parsed} is in the future — hidden unless built with --future")
      end
    rescue ArgumentError
      error("frontmatter", "#{path}: date `#{fm["date"]}` is not a parseable date")
    end
  end

  if fm["title"].nil? || fm["title"].to_s.strip.empty?
    warn_("frontmatter", "#{path}: no title")
  end

  permalinks[fm["permalink"]] << path if fm["permalink"]
end

Dir.glob("_pages/**/*.{md,markdown,html}").sort.each do |path|
  raw = File.read(path, encoding: "utf-8")
  next unless raw.start_with?("---")

  _, fm_raw, = raw.split(/^---\s*$/, 3)
  begin
    fm = YAML.safe_load(fm_raw.to_s, permitted_classes: [Date, Time], aliases: true) || {}
  rescue Psych::SyntaxError => e
    error("frontmatter", "#{path}: unparseable front matter — #{e.message}")
    next
  end
  permalinks[fm["permalink"]] << path if fm["permalink"]
end

permalinks.each do |permalink, paths|
  next if paths.length < 2
  error("permalink", "duplicate permalink `#{permalink}` in: #{paths.join(", ")}",
        "one of these pages will silently overwrite the other")
end

# --- inline scripts vs HTML compression ------------------------------------
# compress_html collapses every inline <script> onto a single line, at which
# point a `//` comment comments out the rest of the script and the page dies
# with "Unexpected end of input". This bit twice: once on the theme toggle,
# once on the investment test, whose whole quiz app is one inline script.
#
# Checked at source level, on lines that clearly open a comment. Trying to find
# them in the built output means parsing minified JavaScript with a regex, and
# the strings on this site contain enough quotes and URLs to defeat that; the
# browser catching the syntax error in scripts/diagnose.mjs is the backstop.
Dir.glob("{_includes,_layouts,_pages}/**/*.{html,md}").each do |path|
  in_script = false
  File.readlines(path, encoding: "utf-8").each_with_index do |line, index|
    in_script = true if line =~ /<script\b/ && line !~ /\bsrc=/
    if in_script
      # A trailing comment is just as fatal as one on its own line, and the
      # first version of this check only looked at line starts — it passed the
      # investment test as clean while its quiz app was still dead. Strings and
      # block comments come out first so a URL is not mistaken for a comment.
      bare = line.dup
      bare.gsub!(%r{/\*.*?\*/}, " ")
      bare.gsub!(/"(?:[^"\\]|\\.)*"/, '""')
      bare.gsub!(/'(?:[^'\\]|\\.)*'/, "''")
      bare.gsub!(/`(?:[^`\\]|\\.)*`/, "``")
      if bare =~ %r{(?<!:)//(?!/)}
        error("inline-script", "#{path}:#{index + 1} uses a `//` comment inside an inline <script>",
              "compress_html joins the script onto one line, so it swallows everything after it — use /* */")
      end
    end
    in_script = false if line =~ %r{</script>}
  end
end

# --- critical CSS freshness -----------------------------------------------
# The inlined above-the-fold CSS is generated from the stylesheets. If they
# change and it is not regenerated, nothing in the finished page looks wrong —
# only the moment before main.css arrives — so no visual check can catch it.
# The generator records a hash of its sources; compare it to the sources now.
critical_path = "_includes/head/critical-css.html"
if File.exist?(critical_path)
  recorded = File.read(critical_path, encoding: "utf-8")[/sources-sha256:\s*([0-9a-f]+)/, 1]
  sources = (Dir.glob("_sass/**/*.scss") + ["assets/css/main.scss"]).sort
  digest = Digest::SHA256.new
  sources.each { |f| digest.update(File.binread(f)) }
  actual = digest.hexdigest[0, 16]

  if recorded.nil?
    warn_("critical-css", "#{critical_path} has no sources-sha256 fingerprint",
          "regenerate with `npm run critical`")
  elsif recorded != actual
    error("critical-css", "inlined critical CSS is stale — stylesheets changed since it was generated",
          "run `npm run critical` (needs the site served locally; scripts/debug.sh does that)")
  end
end

# --- report ---------------------------------------------------------------
def render(list, label, colour)
  return if list.empty?
  puts "\n\e[#{colour}m#{label} (#{list.length})\e[0m"
  list.each do |item|
    puts "  \e[#{colour}m•\e[0m [#{item[:check]}] #{item[:message]}"
    puts "      ↳ #{item[:hint]}" if item[:hint]
  end
end

puts "site doctor — static checks"
render(ERRORS, "ERRORS", "31")
render(WARNINGS, "WARNINGS", "33")

if ERRORS.empty? && WARNINGS.empty?
  puts "\n\e[32mAll static checks passed.\e[0m"
else
  puts "\n#{ERRORS.length} error(s), #{WARNINGS.length} warning(s)"
end

exit(ERRORS.empty? ? 0 : 1)
