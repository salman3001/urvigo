function convertToFormData(
  obj: any,
  formData = new FormData(),
  parentKey = ""
) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Create the full key including parent keys for nested structures
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value !== undefined && value !== null) {
        if (typeof value === "object" && !(value instanceof File)) {
          // Recursively process nested objects
          convertToFormData(value, formData, fullKey);
        } else {
          if (value instanceof File) {
            // Handle File instances separately
            formData.append(fullKey, value, value.name);
          } else {
            // Append values to FormData
            formData.append(fullKey, value.toString());
          }
        }
      } else {
        // Append null values as empty strings to FormData
        formData.append(fullKey, "");
      }
    }
  }

  return formData;
}

export default convertToFormData;
