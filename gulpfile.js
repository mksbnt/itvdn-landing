var gulp = require('gulp-v4'); // https://www.npmjs.com/package/gulp-v4
var pug = require('gulp-pug'); // https://www.npmjs.com/package/gulp-pug
var browserSync = require('browser-sync').create(); // https://browsersync.io/docs/gulp
var sass = require('gulp-sass'); // https://www.npmjs.com/package/gulp-sass
var spritesmith = require('gulp.spritesmith'); // https://www.npmjs.com/package/gulp.spritesmith
var rimraf = require('rimraf'); // https://www.npmjs.com/package/gulp-rimraf
var rename = require("gulp-rename"); // https://www.npmjs.com/package/gulp-rename
const autoprefixer = require('gulp-autoprefixer'); // https://www.npmjs.com/package/gulp-autoprefixer
var sourcemaps = require('gulp-sourcemaps'); // https://www.npmjs.com/package/gulp-sourcemaps

// Static server

gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// Pug compile

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

// gulp.task('templates:compile', function buildHTML() {
//   return gulp.src('source/templates/about.pug')
//       .pipe(pug({
//           pretty: true
//       }))
//       .pipe(gulp.dest('build'))
// });

// styles compile

sass.compiler = require('node-sass');

gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths, // https://www.npmjs.com/package/node-normalize-scss
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/css'));
});

// Sprite

gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('sourse/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

// Delete

gulp.task('clean', function del(cb) {
    rimraf('build', cb);
});

// Copy fonts

gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

// Copy images 

gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

// Copy JavaScript

gulp.task('copy:js', function () {
    return gulp.src('./source/js/**/*.*')
        .pipe(gulp.dest('build/js'));
});

// Copy

gulp.task('copy', gulp.parallel('copy:js', 'copy:fonts', 'copy:images'));

// Watchers

gulp.task('watch', function () {
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));

