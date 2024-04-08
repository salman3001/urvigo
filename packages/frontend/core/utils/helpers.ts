export function findObjectAndMoveToIndex0(
  array: Record<string, any>[],
  object: Record<string, any>,
  arrayObjectKeyToMatch: string,
  objectKeyToMatch: string
) {
  let newArray = array.slice();
  // Check if the object exists in the array
  let index = newArray.findIndex(
    (item) => item[arrayObjectKeyToMatch] === object[objectKeyToMatch]
  );

  // If object found, move it to index 0
  if (index !== -1) {
    // Remove the object from its current position
    let removedItem = newArray.splice(index, 1)[0];
    // Add the removed item at index 0
    newArray.unshift(removedItem);
  }

  return newArray;
}
