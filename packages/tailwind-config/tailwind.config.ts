import type { Config } from "tailwindcss"

import tailwindcss_animate from "tailwindcss-animate"

const config: Omit<Config, "content"> = {
  darkMode: "class",
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "400px",
      },
      transitionproperty: {
        "max-height": "max-height",
      },
    },
  },
  plugins: [tailwindcss_animate],
}

export default config
