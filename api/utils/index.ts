export { myRound, rateIsExpired, getUTCDate } from '../../utils'

/**
 * Make new array with chunks.
 * @see https://stackoverflow.com/a/37826698/19419998
 */
export function chunkArray<T>(inputArray: T[], chunkSize: number): T[][] {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize)

    if (!resultArray[chunkIndex]) {
      // @ts-ignore
      resultArray[chunkIndex] = []
    }
    // @ts-ignore
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [])
}
