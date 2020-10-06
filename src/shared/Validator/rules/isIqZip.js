export default (values) => {
  return values && /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(values[0])
}
