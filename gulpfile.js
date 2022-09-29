const { src, dest, watch, parallel, series } = require("gulp");
const htmlmin = require("gulp-htmlmin");
var replace = require("gulp-replace");
const removeDublicatedLines = require("gulp-remove-duplicate-lines");
var path = require("path");

function htmlTask() {
  const regex = /(.\/css\/)+([a-z])\w+\/+([a-z])\w+.css/g;
  const regex2 = /(.\/css\/)+([a-z])\w+.css/g;
  return src("project/*.html")
    .pipe(replace(regex, "./assets/style.min.css"))
    .pipe(replace(regex2, "./assets/style.min.css"))
    .pipe(removeDublicatedLines({ include: /\<link/g }))
    .pipe(replace("./pics/", "./assets/"))
    .pipe(replace("./js/script.js", "./assets/script.min.js"))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

exports.html = htmlTask;
const concat = require("gulp-concat");
let cleanCss = require("gulp-clean-css");
function cssTask() {
  return src("project/css/**/*.css")
    .pipe(concat("style.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/assets"));
}

exports.css = cssTask;

const terser = require("gulp-terser");
function jstask() {
  return src("project/js/**/*.js")
    .pipe(concat("script.min.js"))
    .pipe(terser())
    .pipe(dest("dist/assets"));
}

exports.js = jstask;

const imgmin = require("gulp-imagemin");
function imgtask() {
  return src("project/pics/*").pipe(imgmin()).pipe(dest("dist/assets"));
}
exports.img = imgtask;

exports.default = parallel(imgtask, jstask, cssTask, htmlTask);
