/**
 * Returns the first found attribute name of the attrList
 * 
 * @param {String[]} attrList Attributes you are searching for
 * @param {HTMLElement} el 
 */
const getAttributeName = (attrList, el) => {
    if (attrList.length === 0) return

    const attrListCopy = [...attrList]

    const attr = attrListCopy.shift()
    const v = el.getAttribute(attr)

    return !!v ? attr : getAttributeName (attrListCopy, el) 
}

module.exports = getAttributeName