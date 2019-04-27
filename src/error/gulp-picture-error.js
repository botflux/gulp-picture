const ERROR_NAME = 'GulpPictureError'

/**
 * Represents an error
 */
class GulpPictureError extends Error {
    constructor (...params) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GulpPictureError)
        }

        this.name = ERROR_NAME
        this.date = new Date()
    }
}

module.exports = GulpPictureError