export function flattenObject(obj, prefix = '') {
  const result = {}

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nested = flattenObject(obj[key], `${prefix}${key}.`)
      Object.assign(result, nested)
    } else {
      result[`${prefix}${key}`] = obj[key]
    }
  }

  return result
}
