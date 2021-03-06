import { LibraryData } from "../interfaces";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// Given a number x and a total number, calculate what percentage x is of the total.
// The total can be passed directly in as a number or a string containing a number, or can
// be derived by adding up 1) the values in an array of numbers, 2) the values in an array of strings containing numbers,
// or 3) the lengths of the elements in an array of arrays.
export function getPercentage(x: number, outOf: number | string | Array<string | number>, asString: boolean = false) {
  let total;
  if (Array.isArray(outOf)) {
    total = outOf.map(el => parseInt(el as string)).reduce((accum, next) => accum + next);
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

export function getMonth(timestamp: string): string {
  return `${months[new Date(timestamp).getMonth()]}`;
}

export function toggleState(attr: string, state) {
  return {...state, ...{[attr]: !state[attr]}};
}

export function findYear(date: string, resultText?: string, backupText?: string): string[] {
  if (date === "Not validated") {
    return ["Unknown", "(Unknown)"];
  }
  let year = date?.match(/20\d+/) && date.match(/20\d+/)[0];
  let formattedYear = ` (${year ? (resultText || "") + year : backupText})`;
  return [year, formattedYear];
}

export function hasLibraries(data: {[key: string]: LibraryData[]}): boolean {
  return Object.values(data).some(x => x?.length > 0);
}
