export default function parseJSONInObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      try {
        obj[key] = JSON.parse(obj[key])
      } catch (error) {
        // Ignore the error if it's not valid JSON
      }
    } else if (typeof obj[key] === 'object') {
      parseJSONInObject(obj[key])
    }
  }
}
