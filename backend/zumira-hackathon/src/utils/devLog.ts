export function devLog<T extends unknown[]>(...args: T): void {
  if (process.env.PRODUCTION !== "true") {
    console.log(...args);
  }
}
