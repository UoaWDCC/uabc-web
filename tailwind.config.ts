import type { Config } from "tailwindcss"

import tailwindcss_animate from "tailwindcss-animate"

const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
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
} satisfies Config

export default config
