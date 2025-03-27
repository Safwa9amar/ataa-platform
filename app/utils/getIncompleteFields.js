/**
 * Checks if any keys in the given object are null, undefined, or an empty string.
 * @param {Object} obj - The object to be checked.
 * @param {Array} excludeKeys - An array of keys to exclude from the check.
 * @returns {Array} - An array of keys that are null, undefined, or empty.
 */
function getIncompleteFields(obj, excludeKeys = []) {
    const emptyKeys = [];
  
    for (const [key, value] of Object.entries(obj)) {
      if (!excludeKeys.includes(key)) {
        if (value === null || value === undefined || value === '') {
          emptyKeys.push(key);
        }
      }
    }
  
    return emptyKeys;
  }
  
 export default getIncompleteFields;