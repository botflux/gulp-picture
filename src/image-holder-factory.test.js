const imageHolderFactory = require('./image-holder-factory')
const GulpPictureError = require ('./error/gulp-picture-error')

describe ('#imageHolderFactory', () => {
    describe ('parameter errors', () => {
        it ('throws an error when the _imageRegex_ is not a regex', () => {
            const f = () => imageHolderFactory ({})
            expect (f).toThrow (GulpPictureError)
            expect (f).toThrow ('suffixRegex must be an instance of RegExp')
        })
    })

    describe ('functions', () => {
        let imageHolder

        beforeEach (() => {
            imageHolder = imageHolderFactory (/^(?<filename>.*)-(?<suffix>.*)$/)
        })

        describe ('#add', () => {
            it ('adds the image to the collection', () => {
                imageHolder.add ('my-image-original.jpg')
                expect(imageHolder.data() ['my-image']).toContain('original.jpg')
                expect(imageHolder.data() ['my-image'].length).toBe(1)
                expect(Object.keys(imageHolder.data()).length).toBe(1)
            })
    
            it ('adds multiple images to the collection', () => {
                imageHolder.add ('my-image-original.jpg')
                imageHolder.add ('my-image-500px.jpg')
                imageHolder.add ('my-image-800px.jpg')
                imageHolder.add ('my-image-1000px.jpg')
    
                expect (imageHolder.data()['my-image']).toContain ('original.jpg')
                expect (imageHolder.data()['my-image']).toContain ('500px.jpg')
                expect (imageHolder.data()['my-image']).toContain ('800px.jpg')
                expect (imageHolder.data()['my-image']).toContain ('1000px.jpg')
                expect (imageHolder.data()['my-image'].length).toBe(4)
            })
        })

        describe ('#contain', () => {
            it ('returns true when file is known', () => {
                imageHolder.add ('an-image-598px.jpg')
                expect (imageHolder.contain('an-image')).toBe(true)
            })
    
            it('returns false when file is unknown', () => {
                expect (imageHolder.contain('an-image')).toBe (false)
            })
        })

        describe ('#get', () => {    
            it ('returns the suffixes when the file is known', () => {
                imageHolder.add ('lake-500px.jpg')
                imageHolder.add ('lake-original.jpg')
                imageHolder.add ('lake-1200px.jpg')

                const r = imageHolder.get('lake')

                expect (r).toContain('original.jpg')
                expect (r).toContain('1200px.jpg')
                expect (r).toContain('500px.jpg')
                expect (r.length).toBe(3)
            })
        })

        describe ('#cutFilename', () => {
            it ('returns an object with properties filename and suffix', () => {
                const r = imageHolder.cutFilename ('file-original.webp')
                expect('filename' in r).toBe(true)
                expect('suffix' in r).toBe(true)
                expect(typeof r.filename).toBe('string')
                expect(typeof r.suffix).toBe('string')
            })
        })
    })
})