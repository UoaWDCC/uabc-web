import { TicketsIcon } from "@yamada-ui/lucide"
import { Center, type IconProps, Text } from "@yamada-ui/react"
import { type FC, memo } from "react"

/**
 * Props for the {@link SessionCountIcon} component.
 */
export interface SessionCountIconProps extends IconProps {
  /**
   * The number of sessions to display. If not provided, the children will be used.
   */
  count?: number
}

/**
 * A component that displays a session count icon with a number inside it.
 *
 * @param color The color of the icon and text.
 * @param count The number of sessions to display. This is the content inside the icon if provided.
 * @param children The content to display within the icon, typically the count.
 * @param fontSize The font size of the tickets icon that surrounds the text.
 * @param props Additional properties to pass to the icon
 * @returns A component that displays a session count icon with a number inside it.
 * @example
 * <SessionCountIcon color="secondary" fontSize="3xl" >24</SessionCountIcon>
 * @example
 * <SessionCountIcon color="secondary" count={24} fontSize="3xl" />
 */
export const SessionCountIcon: FC<SessionCountIconProps> = memo(
  ({ color, count, children, fontSize = "2xl", ...props }) => {
    return (
      <Center color={color} position="relative">
        <TicketsIcon
          data-testid="session-count-tickets-icon"
          fontSize={fontSize}
          strokeWidth="2px"
          {...props}
        />
        <Text
          fontSize={`calc(${fontSize} / 3)`}
          paddingInlineEnd="20%"
          position="absolute"
          textAlign="right"
          top="60%"
          transform="translateY(-50%)"
          w="full"
        >
          {count ?? children}
        </Text>
      </Center>
    )
  },
)
