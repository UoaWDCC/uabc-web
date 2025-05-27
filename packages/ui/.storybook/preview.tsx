import { config, theme } from "@repo/theme"
import type { DocsContainerProps } from "@storybook/blocks"
import { DocsContainer } from "@storybook/blocks"
import { addons } from "@storybook/preview-api"
import type { Preview } from "@storybook/react"
import { themes } from "@storybook/theming"
import { UIProvider, VStack, useColorMode } from "@yamada-ui/react"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useState } from "react"
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode"
import { customThemes } from "./themes"

import "./styles.css"

const channel = addons.getChannel()

const useDarkMode = (callback?: (darkMode: boolean) => void) => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, callback ?? setDarkMode)

    return () => channel.off(DARK_MODE_EVENT_NAME, callback ?? setDarkMode)
  }, [callback])

  return darkMode
}

const App: FC<PropsWithChildren> = ({ children }) => {
  const { changeColorMode } = useColorMode()

  useDarkMode((darkMode) => {
    changeColorMode(darkMode ? "dark" : "light")
  })

  return (
    <VStack
      align="start"
      gap={{ base: "lg", md: "md" }}
      minH={{
        base: "calc(100dvh - {spaces.lg} * 2)",
        md: "calc(100dvh - {spaces.md} * 2)",
      }}
      overflowX="auto"
      p={{ base: "lg", md: "md" }}
    >
      {children}
    </VStack>
  )
}

const preview: Preview = {
  globalTypes: {},
  initialGlobals: {
    locale: "en-US",
    locales: {
      "en-US": { icon: "🇺🇸", right: "en-US", title: "English" },
    },
  },
  parameters: {
    backgrounds: { disable: true },
    controls: { expanded: true },
    darkMode: { ...customThemes },
    docs: {
      container: ({ children, theme, ...rest }: PropsWithChildren<DocsContainerProps>) => {
        const darkMode = useDarkMode()
        const colorMode = darkMode ? "dark" : "light"

        theme = themes[colorMode]

        return (
          <DocsContainer theme={theme} {...rest}>
            <UIProvider colorMode={colorMode}>{children}</UIProvider>
          </DocsContainer>
        )
      },
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Theme", "Components"],
      },
    },
  },

  decorators: [
    (Story) => {
      return (
        <UIProvider config={config} theme={theme}>
          <App>
            <Story />
          </App>
        </UIProvider>
      )
    },
  ],
}

export default preview
