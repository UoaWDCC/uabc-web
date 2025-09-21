export type KebabCaseString = string & { __kebabCaseBrand: true }

export type CapitalizedString = string & { __capitalizedBrand: true }

export const toKebabCase = (input: string): KebabCaseString => {
  const value = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
  return value as KebabCaseString
}

export const capitalize = (input: string): CapitalizedString => {
  if (input.length === 0) {
    return input as CapitalizedString
  }
  const [first, ...rest] = input
  const value = first.toUpperCase() + rest.join("")
  return value as CapitalizedString
}
