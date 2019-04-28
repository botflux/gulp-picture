const REGEX = /^(?<filename>.*)(?<extension>\.(.*))$/

/**
 * Returns an object with properties filename and extension
 * 
 * @param {String} filename 
 */
const getFilename = filename => REGEX.exec(filename).groups

module.exports = getFilename