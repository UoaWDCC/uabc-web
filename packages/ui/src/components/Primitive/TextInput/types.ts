/**
 * Supported HTML input types for the TextInput component
 * @enum {string}
 */
export enum InputType {
  Text = "text",
  Email = "email",
  Password = "password",
  Number = "number",
  Tel = "tel",
  Url = "url",
  Search = "search",
  Date = "date",
  Time = "time",
  Datetime = "datetime-local",
  Month = "month",
  Week = "week",
}

/**
 * Supported HTML autocomplete types for the TextInput component
 * @enum {string}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete}
 */
export enum AutoCompleteType {
  Off = "off",
  On = "on",
  Name = "name",
  HonorificPrefix = "honorific-prefix",
  GivenName = "given-name",
  AdditionalName = "additional-name",
  FamilyName = "family-name",
  HonorificSuffix = "honorific-suffix",
  Nickname = "nickname",
  Email = "email",
  Username = "username",
  NewPassword = "new-password",
  CurrentPassword = "current-password",
  OneTimeCode = "one-time-code",
  OrganizationTitle = "organization-title",
  Organization = "organization",
  StreetAddress = "street-address",
  AddressLine1 = "address-line1",
  AddressLine2 = "address-line2",
  AddressLine3 = "address-line3",
  AddressLevel4 = "address-level4",
  AddressLevel3 = "address-level3",
  AddressLevel2 = "address-level2",
  AddressLevel1 = "address-level1",
  Country = "country",
  CountryName = "country-name",
  PostalCode = "postal-code",
  CcName = "cc-name",
  CcGivenName = "cc-given-name",
  CcAdditionalName = "cc-additional-name",
  CcFamilyName = "cc-family-name",
  CcNumber = "cc-number",
  CcExp = "cc-exp",
  CcExpMonth = "cc-exp-month",
  CcExpYear = "cc-exp-year",
  CcCsc = "cc-csc",
  CcType = "cc-type",
  TransactionCurrency = "transaction-currency",
  TransactionAmount = "transaction-amount",
  Language = "language",
  Bday = "bday",
  BdayDay = "bday-day",
  BdayMonth = "bday-month",
  BdayYear = "bday-year",
  Sex = "sex",
  Tel = "tel",
  TelCountryCode = "tel-country-code",
  TelNational = "tel-national",
  TelAreaCode = "tel-area-code",
  TelLocal = "tel-local",
  TelExtension = "tel-extension",
  Impp = "impp",
  Url = "url",
  Photo = "photo",
}

/**
 * Array of supported input types for easy iteration and Storybook controls
 */
export const INPUT_TYPES = Object.values(InputType)
