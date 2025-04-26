import { isAfter } from "date-fns";

export function isExpired(exp: Date): boolean {
  return isAfter(exp, new Date());
}
