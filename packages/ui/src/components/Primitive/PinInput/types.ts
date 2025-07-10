/**
 * Supported input types for the PinInput component
 * @enum {string}
 */
export enum PinInputType {
  Number = "number",
  Alphanumeric = "alphanumeric",
}

/**
 * Supported sizes for the PinInput component
 * @enum {string}
 */
export enum PinInputSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
}

/**
 * Supported variants for the PinInput component
 * @enum {string}
 */
export enum PinInputVariant {
  Outline = "outline",
  Filled = "filled",
  Flushed = "flushed",
  Unstyled = "unstyled",
}

/**
 * Array of supported input types for easy iteration and Storybook controls
 */
export const PIN_INPUT_TYPES = Object.values(PinInputType)

/**
 * Array of supported sizes for easy iteration and Storybook controls
 */
export const PIN_INPUT_SIZES = Object.values(PinInputSize)

/**
 * Array of supported variants for easy iteration and Storybook controls
 */
export const PIN_INPUT_VARIANTS = Object.values(PinInputVariant)
