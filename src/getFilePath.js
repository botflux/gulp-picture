/**
 * Construct filename
 * 
 * @param {[]} folders Folders
 * @param {String} filenameWithoutExt Filename without extension
 * @param {String} suffix Suffix you need to add
 * @param {String} ext File extension
 */
module.exports = (folders, filenameWithoutExt, suffix, ext) => {
    folders = folders.reverse()

    let res = folders.reduce((prev, cur, i) => {
        if (i === 0) return cur

        return `${prev}/${cur}`
    }, '')

    return `${res}${res.length === 0 ? '': '/'}${filenameWithoutExt}${suffix}.${ext === 'jpg' ? 'jpeg': ext}`
}