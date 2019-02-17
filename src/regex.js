const imageRegex    = /<img([^>]*[^/])>/g
const srcRegex      = /src\s*=\s*"(.+?)"/g
const fileSrcRegex  = /"(.+?)"/g

module.exports = {
    imageRegex,
    srcRegex,
    fileSrcRegex
}
