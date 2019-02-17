const { imageRegex, srcRegex, fileSrcRegex }    = require('./regex')
const getFilePath       = require('./getFilePath')
const { Transform }     = require('stream')

module.exports = ({ webp = false, breakpoints = [] }) => {
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
            })

            // we replace all the current html content by the modified one 
            chunk.contents = Buffer.from(content)

            // we write the new file in the stream
            this.push(chunk)
            callback()
        }
    })
}