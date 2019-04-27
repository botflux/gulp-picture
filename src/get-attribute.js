/**
 * Returns the first found attribute of the attrList
 * 
 * @param {String[]} attrList Attributes you are searching for
 * @param {HTMLElement} el 
 */
const getAttribute = (attrList, el) => {
    if (attrList.length === 0) return

    const attrListCopy = [...attrList]

    const attr = attrListCopy.shift()
    const v = el.getAttribute(attr)

    return !!v ? v : getAttribute (attrListCopy, el) 
}

module.exports = getAttribute