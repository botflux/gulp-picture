const imageRegex    = /<img([^>]*[^/])>/g
const srcRegex      = /src\s*=\s*"(.+?)"/g
const fileSrcRegex  = /"(.+?)"/g
const makeLazyRegex = attribute => new RegExp(`${attribute}\s*(=)?\s*("(.+?)")?`, 'g')

module.exports = {
    imageRegex,
    srcRegex,
    fileSrcRegex,
    makeLazyRegex
}
