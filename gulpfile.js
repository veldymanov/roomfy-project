////////////////////////////////////////////////////
// Required
////////////////////////////////////////////////////
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),

    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    webp = require('gulp-webp'),
    imagemin = require('gulp-imagemin'),

    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    del = require('del');


////////////////////////////////////////////////////
// HTML Task
////////////////////////////////////////////////////
//update browser-sync
gulp.task('html', function() {
    return gulp.src(['src/**/*.html'])
        .pipe(reload({stream: true}));
});

////////////////////////////////////////////////////
// CSS Tasks
////////////////////////////////////////////////////
//run sass
gulp.task('sass', () =>
    gulp.src('src/**/*.scss')
    	.pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/'))
);

//update browser-sync
gulp.task('css', () =>
    gulp.src(['src/**/*.css'])
        .pipe(reload({stream: true}))
);

////////////////////////////////////////////////////
// Script Tasks
////////////////////////////////////////////////////
//update browser-sync
gulp.task('scripts', function () {
    gulp.src(['src/**/*.js'])
        .pipe(reload({stream: true}));
});

////////////////////////////////////////////////////
// Picture tasks
////////////////////////////////////////////////////
//pctures minimize to '*.opt.{png,jpg,gif,svg}' and '*.z.{png,jpg,gif,svg}'
gulp.task('pic:min', () =>
    gulp.src(['src/**/img/**/*.{png,jpg,gif,svg}',
        '!src/**/img/**/*.opt.{png,jpg,gif,svg}',
        '!src/**/img/**/*.z.{png,jpg,gif,svg}'
    ])
        .pipe(rename({suffix: '.opt'}))
        .pipe(imagemin())
        .pipe(gulp.dest('src/'))
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/.opt/, '.z');
        }))
        .pipe(gulp.dest('src/'))
);

//create '*.z.webp' from '*.opt.{png,jpg}'
gulp.task('pic:webp', ['pic:min'], () =>
    gulp.src(['src/**/img/**/*.opt.{jpg,png}'])
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/.opt/, '.z');
        }))
        .pipe(webp())
        .pipe(gulp.dest('src/'))
);

//remove '*.opt.{png,jpg,gif,svg}'
gulp.task('pic:remove', ['pic:webp'], function () {
    del.sync(['src/**/img/**/*.opt.{png,jpg,gif,svg}']);
});

gulp.task('pic', ['pic:remove']);

////////////////////////////////////////////////////
// Build Task (Application for deployment)
////////////////////////////////////////////////////
//clear out all files and folders from build folder
gulp.task('build:cleanfolder', function () {
    del.sync('docs/**');
});

//task to create build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], function () {
    return gulp.src('src/**/*/')
        .pipe(gulp.dest('docs/'));
});

//task to remove unwanted build files
//list all files and directories here that you don't want to include
gulp.task('build:remove', ['build:copy'], function () {
    del.sync('docs/**/*.scss');
});

//minify html
gulp.task('html:minify', ['build:remove'], function() {
    return gulp.src(['docs/**/*.html'])
        .pipe(plumber())
        .pipe(htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            html5: true,
            minifyCSS: true,
            minifyJS: true,
            processConditionalComments: true,
            minifyURLs: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true
        }))
        .pipe(gulp.dest('docs/'));
});

//minify css
gulp.task('css:minify', ['html:minify'], () =>
gulp.src(['docs/**/*.css'])
    .pipe(plumber())
    .pipe(cleanCSS({rebase: false}))
    .pipe(gulp.dest('docs/'))
);

//minify scripts
gulp.task('scripts:minify', ['css:minify'], function () {
    gulp.src(['docs/**/*.js'])
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('docs/'));
});

gulp.task('build', ['scripts:minify']);

////////////////////////////////////////////////////
// Browser-Sync Tasks
////////////////////////////////////////////////////
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './src/'
        }
    });
});

//task to run build server
gulp.task('build:server', function () {
    browserSync({
        server: {
            baseDir: './docs/'
        }
    });
});

////////////////////////////////////////////////////
// Watch Tasks
////////////////////////////////////////////////////
gulp.task('watch', function () {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.css', ['css']);
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch([
        'src/**/img/**/*.{png,jpg,gif,svg}',
        '!src/**/img/**/*.opt.{png,jpg,gif,svg}',
        '!src/**/img/**/*.z.{png,jpg,gif,svg}'
    ], ['pic']);
});

////////////////////////////////////////////////////
// Default Task
////////////////////////////////////////////////////
gulp.task('default', [
    'html',
    'sass', 'css',
    'scripts',
    'pic',
    'browser-sync',
    'watch'
]);