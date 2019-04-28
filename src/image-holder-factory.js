const GulpPictureError = require ('./error/gulp-picture-error')

/**
 * Make the image holder
 * 
 * @param {RegExp} suffixRegex A regex that cut the suffix of image name
 */
const imageHolderFactory = _imageRegex => {

    if (_imageRegex && !(_imageRegex instanceof RegExp))
        throw new GulpPictureError ('suffixRegex must be an instance of RegExp')

    let imageRegex = new RegExp (_imageRegex)

    let knownFiles = {}

    /**
     * Returns an object with a filename and suffix properties
     * 
     * @param {String} filename 
     */
    const cutFilename = filename => imageRegex.exec (filename).groups

    /**
     * Adds a filename to the collection
     * 
     * @param {String} _filename 
     */
    const add = _filename => {
        const { filename, suffix } = cutFilename (_filename)
        if (!(filename in knownFiles)) {
            knownFiles[filename] = []
        }

        knownFiles[filename] = [...knownFiles[filename], suffix]
    }

    /**
     * Returns true if the given filename is in the collection otherwise false
     * 
     * @param {String} _filename 
     */
    const contain = _filename => (_filename in knownFiles) 

    /**
     * Returns an array containing all the suffixes of a name
     * 
     * @param {String} name 
     */
    const get = name => knownFiles[name]

    const setRegex = regex => {
        if (!(regex instanceof RegExp)) throw new GulpPictureError ('_regex_ must be an instance of RegExp')

        imageRegex = new RegExp (regex)
    }

    /**
     * /!\
     * Property is meant to be use in test
     * /!\
     */
    return {
        get,
        contain,
        add,
        cutFilename,
        data: _ => knownFiles,
        setRegex
    }
}

module.exports = imageHolderFactory