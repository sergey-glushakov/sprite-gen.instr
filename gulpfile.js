const gulp = require('gulp');
const replace = require('gulp-replace');
const svgstore = require('gulp-svgstore');
const cheerio = require('gulp-cheerio');
const svgmin = require('gulp-svgmin');
//const imagemin = require('gulp-imagemin');
const del = require('del');
const rename = require('gulp-rename');

const paths = {
    src: './src/',              // paths.src
    build: './build/',           // paths.build
};

function svg() {
    return gulp.src(paths.src + 'svg/**/*.svg')
        .pipe(svgmin(function (file) {
            return {
                plugins: [{
                    cleanupIDs: {
                        minify: true
                    }
                }]
            }
        }))
        // удалить все атрибуты fill, style and stroke в фигурах
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgstore({inlineSvg: true}))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest(paths.build + 'img/'));
}


function clean() {
    return del('build/');
}

exports.svg = svg;
exports.clean = clean;

gulp.task('del', gulp.series( clean ));
gulp.task('svg', gulp.series( svg ));



