const getFilename = require('./get-filename')

describe ('#getFilename', () => {
    it ('returns an object with a filename and extension', () => {
        const result = getFilename ('index.html')

        expect(result.filename).toBe ('index')
        expect(result.extension).toBe ('.html')
    })

    it ('returns the last extension if the filename contain more than one extension', () => {
        const result = getFilename ('index.html.twig')

        expect (result.filename).toBe ('index.html')
        expect (result.extension).toBe ('.twig')
    })
})