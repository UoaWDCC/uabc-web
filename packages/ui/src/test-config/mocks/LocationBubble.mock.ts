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

export const LOCATION_BUBBLE_TEST_CONSTANTS_WITH_TIMES = {
  ...LOCATION_BUBBLE_TEST_CONSTANTS,
  locationTimes: {
    Monday: [new Date(1970, 1, 1, 12, 0).toISOString(), new Date(1970, 1, 1, 14, 0).toISOString()],
  },
}

export const LOCATION_BUBBLE_TEST_CONSTANTS_WITH_BUTTON_LABEL = {
  ...LOCATION_BUBBLE_TEST_CONSTANTS,
  button: {
    label: "label",
  },
}

export const LOCATION_BUBBLE_TEST_CONSTANTS_WITH_BUTTON_LINK = {
  ...LOCATION_BUBBLE_TEST_CONSTANTS,
  button: {
    url: "link",
  },
}
