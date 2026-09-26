# Compiles assets/css/main.scss with Ruby Sass 3.7.4 — the compiler GitHub Pages
# (github-pages gem -> jekyll-sass-converter 1.5.2) actually uses. Dart Sass,
# used by the local Jekyll 4 build, accepts syntax Ruby Sass rejects (notably
# min()/max()/clamp() with mixed units), so a green local build proves nothing
# about the deployed site.
#
# Usage (one-time install of the github-pages gem set, kept out of the main
# Gemfile so the local Jekyll 4 build is unaffected):
#
#   BUNDLE_GEMFILE=scripts/pages-gemfile/Gemfile bundle config set --local path vendor/bundle
#   BUNDLE_GEMFILE=scripts/pages-gemfile/Gemfile bundle install
#   BUNDLE_GEMFILE=scripts/pages-gemfile/Gemfile bundle exec ruby scripts/pages-sass-check.rb .
Encoding.default_external = Encoding::UTF_8
require "sass"
root = ARGV[0] || Dir.pwd
src = File.read(File.join(root, "assets/css/main.scss"))
src = src.sub(/\A---.*?---\s*/m, "").gsub(/\{\{[^}]*minimal_mistakes_skin[^}]*\}\}/, "default")
begin
  css = Sass::Engine.new(src, syntax: :scss, style: :compressed,
    load_paths: [File.join(root, "_sass")], quiet: true).render
  out = ARGV[1] || "/dev/null"
  File.write(out, css) unless out == "/dev/null"
  puts "Ruby Sass 3.7.4 (GitHub Pages): OK (#{css.bytesize} bytes)"
rescue Sass::SyntaxError => e
  puts "Ruby Sass 3.7.4 (GitHub Pages): FAILED"
  puts e.sass_backtrace_str
  exit 1
end
