export const LOCATION_BUBBLE_TEST_CONSTANTS = {
  locationImage: {
    src: "https://placehold.co/300x200/png",
    alt: "Placeholder image for location",
  },
  locationTitle: "Uoa Recreation Centre",
}

export const LOCATION_BUBBLE_TEST_CONSTANTS_MOBILE = {
  ...LOCATION_BUBBLE_TEST_CONSTANTS,
  open: true,
  onClose: () => {},
}
