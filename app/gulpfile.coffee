gulp = require("gulp")

# Source Code Languages Dependency
nib = require("nib")
jade = require("gulp-jade")
gutil = require('gulp-util')
coffee = require("gulp-coffee")
stylus = require("gulp-stylus")
concat = require("gulp-concat")
templateCache = require("gulp-angular-templatecache")

imagemin = require("gulp-imagemin")
uglify = require("gulp-uglify")
ngAnnotate = require('gulp-ng-annotate')
minifyCSS = require("gulp-minify-css")

# =================== #
#   Configurations
# =================== #
app_file_name = "template"

base =
  src: 'src'
  dest: '../www'

src_paths =
  styles: ["#{base.src}/**/*.styl"]
  assets: ["assets/**/*"]
  images: ["#{base.src}/assets/img/**/*"]
  scripts: ["#{base.src}/**/*.coffee", "!#{base.src}/**/*.spec.coffee"]
  templates: ["#{base.src}/**/*.jade"]

dest_paths =
  js: "#{base.dest}/js"
  css: "#{base.dest}/css"

# =========================== #
#   Production Compilation
# =========================== #
gulp.task "images", ->
  gulp.src paths.images
  .pipe imagemin(optimizationLevel: 5)
  .pipe gulp.dest "bin/"

 
# ===================================================== #
#   Build Process. Tasks to compile source code files
# ===================================================== #
gulp.task "scripts", ->
  gulp.src(src_paths.scripts)
  .pipe coffee(bare: true).on('error', (error) -> console.log error; @emit 'end')
  .pipe(ngAnnotate())
  .pipe concat "#{app_file_name}.js"
  .pipe gulp.dest dest_paths.js

gulp.task "styles", ->
  gulp.src("src/**/style.styl")
  .pipe stylus(use: nib()).on('error', (error) -> console.log error; @emit 'end')
  .pipe concat "#{app_file_name}.css"
  .pipe gulp.dest dest_paths.css

gulp.task "templates", ->
  gulp.src(src_paths.templates)
  .pipe jade().on('error', (error) -> console.log error; @emit 'end')
  .pipe(templateCache("templates.js", {module: "appTemplates", standalone: true}))
  .pipe(ngAnnotate())
  .pipe uglify()
  .pipe gulp.dest dest_paths.js

gulp.task "assets", ->
  gulp.src("assets/**/*")
  .pipe gulp.dest "../www"


gulp.task "watch",  ->
  gulp.watch src_paths.assets, ["assets"]
  gulp.watch src_paths.styles, ["styles"]
  gulp.watch src_paths.scripts, ["scripts"]
  gulp.watch src_paths.templates, ["templates"]
  gulp.watch src_paths.images, ["images"]


gulp.task "default", ["styles", "scripts", "templates", "assets", "watch"]

gulp.task "release", ->
  gulp.src(src_paths.scripts)
  .pipe coffee(bare: true).on('error', (error) -> console.log error; @emit 'end')
  .pipe(ngAnnotate())
  .pipe uglify()
  .pipe concat "#{app_file_name}.js"
  .pipe gulp.dest dest_paths.js
  gulp.src("src/**/style.styl")
  .pipe stylus(use: nib()).on('error', (error) -> console.log error; @emit 'end')
  .pipe concat "#{app_file_name}.css"
  .pipe minifyCSS({keepBreaks:false})
  .pipe gulp.dest dest_paths.css
