const assert = require('assert')
const File = require('vinyl')
const pictureTransform = require('../src/pictureTransform')
const { Readable } = require('stream')

describe('gulp-picture', () => {
    it ('happy path', done => {

        let contents = Buffer.from('<img src="dummy/fake.jpg">')

        const fakeFile = new File({
            contents
        })

        const pictureStream = pictureTransform({
            breakpoints: [
                {  }
            ]
        })

        pictureStream.write(fakeFile)

        pictureStream.once('data', file => {
            assert(file.isBuffer())            

            assert.equal(file.contents.toString('utf8'), '<picture><img src="dummy/fake.jpeg"></picture>')

            done()
        })
    })

    it ('happy path (with complexe path)', done => {
        
        let contents = Buffer.from('<img src="dummy/path/to/my/fake/images/fake.jpg">')
        const fakeFile = new File({
            contents
        })
        const pictureStream = pictureTransform({
            breakpoints: [
                {
                    width: 665,
                    rename: {
                        suffix: '-665px'
                    } 
                }, {
                    rename: { suffix: '-original' }
                }
            ]
        })
        pictureStream.write(fakeFile)
        
        pictureStream.once('data', file => {
            assert(file.isBuffer())            

            assert.equal(
                file.contents.toString('utf8'), 
                '<picture><source media="(min-width: 665px)" srcset="dummy/path/to/my/fake/images/fake-665px.jpeg"><img src="dummy/path/to/my/fake/images/fake-original.jpeg"></picture>')

            done()
        })
    })

    it ('happy path (with complexe path)', done => {

        let contents = Buffer.from('<img src="dummy/path/to/my/fake/images/fake.jpg">')

        const fakeFile = new File({
            contents
        })

        const pictureStream = pictureTransform({
            breakpoints: [
                {  }
            ]
        })

        pictureStream.write(fakeFile)

        pictureStream.once('data', file => {
            assert(file.isBuffer())            

            assert.equal(file.contents.toString('utf8'), '<picture><img src="dummy/path/to/my/fake/images/fake.jpeg"></picture>')

            done()
        })
    })

    it ('happy path (same directory)', done => {

        let contents = Buffer.from('<img src="fake.jpg">')

        const fakeFile = new File({
            contents
        })

        const pictureStream = pictureTransform({
            breakpoints: [
                {  }
            ]
        })

        pictureStream.write(fakeFile)

        pictureStream.once('data', file => {
            assert(file.isBuffer())            

            assert.equal(file.contents.toString('utf8'), '<picture><img src="fake.jpeg"></picture>')

            done()
        })
    })

    it ('should do nothing', done => {
        let contents = Buffer.from('')
        
        const fakeFile = new File({
            contents
        })

        const pictureStream = pictureTransform({
            breakpoints: [{}]
        })

        pictureStream.write(fakeFile)

        pictureStream.once('data', file => {
            assert(file.isBuffer())

            assert.equal(file.contents.toString('utf8'), '')

            done()
        })
    })

    it ('should not handle stream', () => {
        let isStream = () => false
        let contents = new Readable()
        contents.push('hello world')
        contents.push(null)

        const fakeFile = new File({
            isStream,
            contents
        })

        const pictureStream = pictureTransform({
            breakpoints: [{}]
        })

        pictureStream.write(fakeFile)

        pictureStream.once('data', file => {
            assert.equal(fakeFile, file)
        })
    })
})

const getFilePath = require('../src/getFilePath')

describe('#getFilePath', () => {
    it ('should construct the file path', () => {
        const fp = getFilePath([], 'my-image', '', 'jpg')

        assert.equal(fp, 'my-image.jpeg')
    })

    it ('should construct the file path with folders', () => {
        const folders = [ 'src', 'image', 'fruits' ]
        const fp = getFilePath(folders.reverse(), 'apple', '', 'jpg')

        assert.equal(fp, 'src/image/fruits/apple.jpeg')
    })
})