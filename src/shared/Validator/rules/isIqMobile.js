export default (values) => {
  /**
     * For validating Iraq mobile number
     * like: 0770-535-7355, 0770.535.7355, 07705357355
     * Reference https://regexr.com/3u4sl
     */
  if (values && values[0].match(/\b07\d{2}[-.]?\d{3}[-.]?\d{4}\b/)) {
    return true
  }
  return false
}
