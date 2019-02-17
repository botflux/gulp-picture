const assert = require('assert')
const es = require('event-stream')
const File = require('vinyl')
const pictureTransform = require('../src/pictureTransform')

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
})