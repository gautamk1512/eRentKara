/**
 * Deterministic Indian Currency & Number formatter.
 * Ensures identical output across Server-Side Rendering (Node.js)
 * and Client-Side Hydration (browser) to eliminate React Hydration errors.
 */
export function formatINR(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "") return "0";
  const num = Number(val);
  if (isNaN(num)) return "0";

  const isNegative = num < 0;
  const absNum = Math.abs(Math.round(num));
  const str = absNum.toString();

  if (str.length <= 3) {
    return isNegative ? `-${str}` : str;
  }

  const lastThree = str.slice(-3);
  const otherNumbers = str.slice(0, -3);
  const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const result = `${withCommas},${lastThree}`;

  return isNegative ? `-${result}` : result;
}
