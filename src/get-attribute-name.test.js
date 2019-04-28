const getAttributeName = require('./get-attribute-name')

describe ('#getAttributeName', () => {
    it ('returns the name of the first attribute found', () => {
        const attrList = [ 'src', 'lazy-src' ]

        const htmlElement = {
            getAttribute: jest.fn ()
        }

        htmlElement.getAttribute.mockReturnValueOnce (undefined)
        htmlElement.getAttribute.mockReturnValueOnce ('something')

        expect( getAttributeName(attrList, htmlElement) ).toBe ('lazy-src')
        expect(htmlElement.getAttribute).toBeCalledTimes(2)
        expect(htmlElement.getAttribute.mock.calls[0][0]).toBe('src')
        expect(htmlElement.getAttribute.mock.calls[1][0]).toBe('lazy-src')
    })

    it ('returns undefined when attributes were not found', () => {
        const attrList = [ 'text', 'type' ]

        const htmlElement = {
            getAttribute: jest.fn()
        }

        expect( getAttributeName(attrList, htmlElement) ).toBe(undefined)
        expect(htmlElement.getAttribute).toBeCalledTimes (2)
        expect(htmlElement.getAttribute.mock.calls[0][0]).toBe('text')
        expect(htmlElement.getAttribute.mock.calls[1][0]).toBe('type')
    })
})