import { Text, VStack } from "@yamada-ui/react"
import { type FC, memo } from "react"

/**
 * Props for {@link InfoField} component
 */
export interface InfoFieldProps {
  /**
   * The label text for the information field
   *
   * @remarks
   * Displayed above the value in a muted color.
   * Should be descriptive and concise.
   */
  label: string
  /**
   * The value to display in the information field
   *
   * @remarks
   * Displayed below the label in the primary text color.
   * Can be any string content including formatted text.
   */
  value: string
}

/**
 * InfoField component for displaying labeled information in a bordered container
 *
 * @param props InfoField component properties
 * @returns A labeled information field component
 *
 * @example
 * // Basic info field
 * <InfoField label="Email" value="user@example.com" />
 *
 * @example
 * // Phone number field
 * <InfoField label="Phone" value="+1 234 567 8900" />
 *
 * @example
 * // Address field
 * <InfoField label="Address" value="123 Main St, City, State 12345" />
 */
export const InfoField: FC<InfoFieldProps> = memo(({ label, value }) => (
  <VStack
    alignSelf="center"
    border="2px solid"
    borderColor={["blackAlpha.200", "whiteAlpha.300"]}
    gap="xs"
    maxW="md"
    minW={0}
    px="md"
    py="sm"
    rounded="lg"
    w="full"
  >
    <Text color="muted" fontSize="sm">
      {label}
    </Text>
    <Text>{value}</Text>
  </VStack>
))

InfoField.displayName = "InfoField"
