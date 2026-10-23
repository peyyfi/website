import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export const defaultPhoneCountry: CountryCode = "GH";

export function normalizePhoneNumber(value: string, country: CountryCode = defaultPhoneCountry) {
  const input = value.trim();
  if (input.length > 64 || !/^\+?[0-9\s().-]+$/.test(input)) return null;
  const phone = parsePhoneNumberFromString(input, { defaultCountry: country, extract: false });
  return phone?.isValid() && !phone.ext ? phone.number : null;
}
