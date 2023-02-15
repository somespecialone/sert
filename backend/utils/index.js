/**
 * Round to 2 fractionDigits.
 * @param {number} value
 * @returns {number}
 */
const myRound = (value) => {
  return Math.round(value * 100) / 100;
};

/**
 * Make new array with chunks.
 * @see https://stackoverflow.com/a/37826698/19419998
 * @param {Array} inputArray
 * @param {number} chunkSize
 * @returns {Array[]}
 */
const chunkArray = (inputArray, chunkSize) => {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
};

module.exports = { myRound, chunkArray };
