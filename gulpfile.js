const { task, series, src, dest }   = require('gulp')
const responsiveImage   = require('gulp-responsive')
const clean             = require('gulp-clean')
const webp              = require('gulp-webp')
const getFilePath       = require('./src/getFilePath')

const { Transform } = require('stream')

const pictureTransform = ({ webp = false, breakpoints = [] }) => {

    const imageRegex    = /<img([^>]*[^/])>/g
    const srcRegex      = /src\s*=\s*"(.+?)"/g
    const fileSrcRegex  = /"(.+?)"/g
    
    return new Transform({
        objectMode: true,

        transform(chunk, encoding, callback) {
            // console.log(chunk, encoding)

            let content = chunk.contents.toString(encoding)
            // clone string
            let contentClone = content.slice(0)
            console.log(breakpoints)
            // for each image tag inside this html document
            contentClone.match(imageRegex).forEach((img) => {
                console.log(img)

                // we parse the src attribute of this image
                let src = img
                    .match(srcRegex)[0]
                    .match(fileSrcRegex)[0]
                    .replace(/"/g, '')

                // we parse file name
                // filename will stores the filename WITH the file extension
                // folders will be an array with each folder as an item. The list of folder start from the image's folder to the root
                let [filename, ...folders] = src
                    .split('/')
                    .reverse()

                // we parse the filename
                // filenameWithoutExt stores the filename without it extension and ext is the extension
                let [filenameWithoutExt, ext] = filename.split('.')

                console.log(filenameWithoutExt, ext)

                // we get all breakpoints from the configuration
                let bp = breakpoints.filter(b => b.width !== undefined)

                // we get the original image
                let original = breakpoints.find(b => b.width === undefined)

                console.log(bp, original)

                /**
                 * we construct all source tag from the configuration
                 */
                let sources = bp.reverse().reduce((prev, cur) => {
                    let currentString = ''

                    if (webp) {
                        currentString += `<source media="(min-width: ${cur.width}px)" srcset="${getFilePath(folders, filenameWithoutExt, cur.rename.suffix, 'webp')}">`
                    }

                    currentString += `<source media="(min-width: ${cur.width}px)" srcset="${getFilePath(folders, filenameWithoutExt, cur.rename.suffix, ext)}">`


                    prev += currentString
                    return prev
                }, '')

                if (webp) {
                    sources += `<source srcset="${getFilePath(folders, filenameWithoutExt, original.rename.suffix, 'webp')}">`
                }
                // we add the fallback
                sources += img.replace(srcRegex, `src="${getFilePath(folders, filenameWithoutExt, original.rename.suffix, ext)}"`)


                // we surround all picture child tag by a picture tag
                sources = `<picture>${sources}</picture>`

                // we replace the image tag by the picture tag
                content = content.replace(img, sources)

                /**
                 * Get all breakpoints
                 * Get origin one
                 */
            })
            // console.log('a')
            //console.log(content.toString(encoding))

            // we replace all the current html content by the modified one 
            chunk.contents = Buffer.from(content)

            // we write the new file in the stream
            this.push(chunk)
            callback()
        }
    })
}

const responsiveConfig = {
    '*.jpg': [
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

const images =  () => {
    return src('test/src/images/*.jpg')
        .pipe(responsiveImage(responsiveConfig, {
            quality: 70,
            progressive: true
        }))
        .pipe(dest('test/dist/images'))
        .pipe(webp())
        .pipe(dest('test/dist/images/'))
}

const html = () => {
    return src('test/src/*.html')
        .pipe(pictureTransform({webp: true, breakpoints: responsiveConfig['*.jpg']}))
        .pipe(dest('test/dist/'))
}

const cleanDist = () => {
    return src('test/dist/', { read: false, allowEmpty: true })
        .pipe(clean())
}

task('default', series([ cleanDist, images, html ]))