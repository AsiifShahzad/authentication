import { getNames } from "country-list";

const COUNTRIES = getNames();

export const isValidCountry = (country) => {
  if (!country || typeof country !== "string") return false;
  return COUNTRIES.includes(country.trim());
};

export const getCountries = () => {
  return [...COUNTRIES];
};

export { COUNTRIES };