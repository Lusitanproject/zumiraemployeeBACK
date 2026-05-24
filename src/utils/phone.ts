import { parsePhoneNumberWithError } from "libphonenumber-js";

export function tryParsePhone(input: string) {
  try {
    const phone = parsePhoneNumberWithError(input, "BR");
    return phone.isValid() ? phone : null;
  } catch {
    return null;
  }
}
