// Given a number x and a total number, calculate what percentage x is of the total.
// The total can be passed directly in as a number or a string containing a number, or can
// be derived by adding up 1) the values in an array of numbers, 2) the values in an array of strings containing numbers,
// or 3) the lengths of the elements in an array of arrays.
export function getPercentage(x: number, outOf: number | string | Array<string | number>, asString: boolean = false) {
  let total;
  if (Array.isArray(outOf)) {
    total = outOf.map((el) => { return parseInt(el as string); }).reduce((accum, next) => accum + next);
  } else {
    total = parseInt(outOf as string);
  }
  // Don't try to divide by 0; if the total is 0, just return 0.
  let percentage = total === 0 ? 0 : Math.round((x / total) * 100);
  if (asString) {
    return `${percentage}%`;
  }
  return percentage;
}
