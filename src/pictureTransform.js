const { imageRegex, srcRegex, fileSrcRegex, makeLazyRegex }    = require('./regex')
const getFilePath       = require('./getFilePath')
const { Transform }     = require('stream')
const PluginError             = require('plugin-error')

const PLUGIN_NAME = 'gulp-picture'

const makeSrcSet = (lazy, content) => (lazy == '') ? `srcset="${content}"` : `${lazy}="${content}"`
module.exports = ({ webp = false, breakpoints = [], lazyLoad = '' }) => {

    if (typeof webp !== 'boolean') {
        throw new PluginError(PLUGIN_NAME, 'Webp parameter must be a boolean !')
    }

    if (!Array.isArray(breakpoints)) {
        throw new PluginError(PLUGIN_NAME, 'Breakpoints must be an array !')
    }

    if (breakpoints.length === 0) {
        throw new PluginError(PLUGIN_NAME, 'The original breakpoints must be given !')
    }

    return new Transform({
        objectMode: true,

        transform(file, encoding, callback) {

            if (file.isNull()) return callback(null, file)

            // get content from the current file
            let content = file.contents.toString(encoding)

            // clone string
            let contentClone = content.slice(0)
            
            // for each image tag inside this html document
            contentClone.match(imageRegex).forEach((img) => {

                // we parse the src attribute of this image
                let src = img
                    .match((lazyLoad === '' ? srcRegex : makeLazyRegex(lazyLoad)))[0]
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

                // we get all breakpoints from the configuration
                let bp = breakpoints.filter(b => b.width !== undefined)

                // we get the original image
                let original = breakpoints.find(b => b.width === undefined)

                /**
                 * we construct all source tag from the configuration
                 */
                let sources = bp.reverse().reduce((prev, cur) => {
                    let currentString = ''

                    if (webp) {
                        currentString += `<source media="(min-width: ${cur.width}px)" ${makeSrcSet(lazyLoad, getFilePath(folders, filenameWithoutExt, cur.rename.suffix, 'webp'))}>`
                    }
                    //srcset="${getFilePath(folders, filenameWithoutExt, cur.rename.suffix, ext)}"
                    currentString += `<source media="(min-width: ${cur.width}px)" ${makeSrcSet(lazyLoad, getFilePath(folders, filenameWithoutExt, cur.rename.suffix, ext))}>`


                    prev += currentString
                    return prev
                }, '')

                const suf = (original.rename === undefined ? '' : original.rename.suffix) || ''

                if (webp) {
                    sources += `<source srcset="${makeSrcSet(lazyLoad, getFilePath(folders, filenameWithoutExt, suf, 'webp'))}">`
                }
                // we add the fallback
                sources += img.replace((lazyLoad === '' ? srcRegex : makeLazyRegex(lazyLoad)), `${lazyLoad === '' ? 'src' : lazyLoad}="${getFilePath(folders, filenameWithoutExt, suf, ext)}"`)


                // we surround all picture child tag by a picture tag
                sources = `<picture>${sources}</picture>`

                // we replace the image tag by the picture tag
                content = content.replace(img, sources)
            })

            // we replace all the current html content by the modified one 
            file.contents = Buffer.from(content)

            // we write the new file in the stream
            this.push(file)
            callback()
        }
    })
}