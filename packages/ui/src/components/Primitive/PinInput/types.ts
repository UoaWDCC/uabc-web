/**
 * Supported input types for the PinInput component
 * @enum {string}
 */
export enum PinInputType {
  Number = "number",
  Alphanumeric = "alphanumeric",
}

/**
 * Array of supported input types for easy iteration and Storybook controls
 */
export const PIN_INPUT_TYPES = Object.values(PinInputType)
