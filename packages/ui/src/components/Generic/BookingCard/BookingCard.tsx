import {
  Heading,
  IconButton,
  type IconButtonProps,
  Image,
  type ImageProps,
} from "@repo/ui/components/Primitive"
import { EllipsisVerticalIcon } from "@yamada-ui/lucide"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  type CardProps,
  Menu,
  MenuButton,
  MenuItem,
  type MenuItemProps,
  MenuList,
  type MenuListProps,
  type MenuProps,
  Portal,
  type PortalProps,
  Text,
  VStack,
} from "@yamada-ui/react"
import { memo } from "react"

type MenuItemType = MenuItemProps & {
  label: string
}

/**
 * Props for {@link BookingCard} component
 */
export interface BookingCardProps extends Omit<CardProps, "children"> {
  /**
   * The image to display for the booking (venue, event, etc.)
   */
  imageProps?: ImageProps
  /**
   * The day of the booking
   */
  day: string
  /**
   * The location of the booking
   */
  location: string
  /**
   * The address of the booking
   */
  address: string
  /**
   * The start time of the booking
   */
  startTime: string
  /**
   * The end time of the booking
   */
  endTime: string
  /**
   * The menu items to display for the three-dot menu
   */
  menuItems: MenuItemType[]
  /**
   * The props for the menu
   */
  menuProps?: MenuProps
  /**
   * The props for the menu button
   */
  menuButtonProps?: IconButtonProps
  /**
   * The props for the portal
   */
  portalProps?: PortalProps
  /**
   * The props for the menu list
   */
  menuListProps?: MenuListProps
  /**
   * The props for the menu item
   */
  menuItemProps?: MenuItemProps
}

/**
 * BookingCard component displays a booking session with image, day, location, address, time, and menu.
 *
 * @param props BookingCard component properties
 * @returns A styled card with image, details, and menu
 *
 * @example
 * <BookingCard
 *   image={{ src: "https://example.com/image.jpg", alt: "Venue" }}
 *   day="Saturday"
 *   location="Auckland Badminton Stadium"
 *   address="99 Gillies Ave"
 *   startTime="7:30 PM"
 *   endTime="10:00 PM"
 *   menuItems={[{ label: "Edit", onClick: () => {} }, { label: "Delete", onClick: () => {} }]}
 * />
 */
export const BookingCard = memo(
  ({
    imageProps,
    day,
    location,
    address,
    startTime,
    endTime,
    menuItems,
    menuProps,
    menuButtonProps,
    portalProps,
    menuListProps,
    menuItemProps,
    ...cardProps
  }: BookingCardProps) => {
    return (
      <Card
        alignItems="center"
        bg={["secondary.50", "secondary.800"]}
        color={["black", "white"]}
        flexDirection="row"
        h="fit-content"
        layerStyle="gradientBorder"
        overflow="hidden"
        p="3"
        rounded="calc($radii.2xl + $spaces.3)"
        variant="solid"
        w="xl"
        {...cardProps}
      >
        <Image
          aspectRatio={1}
          h="auto"
          height={100}
          maxW="20"
          objectFit="cover"
          overflow="hidden"
          rounded="2xl"
          src="https://placehold.co/100x100"
          width={100}
          {...imageProps}
        />

        <VStack alignSelf="stretch" gap="sm">
          <CardHeader pt="0">
            <Heading.h3 fontSize="xl" fontWeight="semibold">
              {day}
            </Heading.h3>
          </CardHeader>
          <CardBody color="muted" fontSize="sm" gap="0" py="0">
            <Text lineClamp={2}>
              {location} - {address}
            </Text>
            <Text lineClamp={1}>
              {startTime} - {endTime}
            </Text>
          </CardBody>
        </VStack>
        <CardFooter pb="0" px="0">
          <Menu {...menuProps}>
            <MenuButton
              aria-label="Edit"
              as={IconButton}
              color={["black", "white"]}
              h="12"
              icon={<EllipsisVerticalIcon />}
              minW="0"
              rounded="xl"
              variant="ghost"
              w="6"
              {...menuButtonProps}
            />
            <Portal {...portalProps}>
              <MenuList {...menuListProps}>
                {menuItems.map((item) => (
                  <MenuItem key={item.label} {...menuItemProps} {...item}>
                    {item.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Portal>
          </Menu>
        </CardFooter>
      </Card>
    )
  },
)

BookingCard.displayName = "BookingCard"
