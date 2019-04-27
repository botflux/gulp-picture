const { task, series, src, dest } = require('gulp')
const responsiveImage   = require('gulp-responsive')
const clean             = require('gulp-clean')
const webp              = require('gulp-webp')
const pictureTransform  = require('./src/pictureTransform')

const responsiveConfig = {
    '**/*.jpg': [
        {
            width: 200,
            rename: {
                suffix: '-200px'
            }
        }, {
            width: 461,
            rename: {
                suffix: '-461px'
            }
        }, {
            width: 665,
            rename: {
                suffix: '-665px'
            } 
        }, {
            width: 823,
            rename: {
                suffix: '-968px'
            }
        }, {
            width: 1091,
            rename: {
                suffix: '-1091px'
            }
        }, {
            width: 1205,
            rename: {
                suffix: '-1205px'
            }
        }, {
            width: 1307,
            rename: {
                suffix: '-1307px'
            }
        }, {
            width: 1374,
            rename: {
                suffix: '-1374px'
            }
        }, {
            width: 1400,
            rename: {
                suffix: '-1400px'
            }
        }, {
            rename: { suffix: '-original' }
        }
    ],
}

/**
 * Process jpg images
 */
const images =  () => {
    return src('test/src/images/**/*.jpg')
        .pipe(responsiveImage(responsiveConfig, {
            quality: 70,
            progressive: true
        }))
        .pipe(dest('test/dist/images/'))
        .pipe(webp())
        .pipe(dest('test/dist/images/'))
}

/**
 * Process html files
 */
const html = () => {
    return src('test/src/*.html')
        .pipe(pictureTransform({ webp: true, breakpoints: responsiveConfig['**/*.jpg'], lazyLoad: 'data-lazy' }))
        .pipe(dest('test/dist/'))
}

/**
 * Clean the distribution folder
 */
const cleanDist = () => {
    return src('test/dist/', { read: false, allowEmpty: true })
        .pipe(clean())
}

task('default', series([ cleanDist, images, html ]))