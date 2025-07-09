import { config, theme } from "@repo/theme"
import type { DocsContainerProps } from "@storybook/addon-docs/blocks"
import { DocsContainer } from "@storybook/addon-docs/blocks"
import type { Preview } from "@storybook/react"
import { UIProvider, useColorMode, VStack } from "@yamada-ui/react"
import type { FC, PropsWithChildren } from "react"
import React from "react"
import { addons } from "storybook/preview-api"
import { themes } from "storybook/theming"
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode"
import { customThemes } from "./themes"
import "./styles.css"

const channel = addons.getChannel()

const useDarkMode = (callback?: (darkMode: boolean) => void) => {
  const [darkMode, setDarkMode] = React.useState(false)

  React.useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, callback ?? setDarkMode)

    return () => channel.off(DARK_MODE_EVENT_NAME, callback ?? setDarkMode)
  }, [callback])

  return darkMode
}

interface AppProps extends PropsWithChildren {
  isDocs?: boolean
}

const App: FC<AppProps> = ({ children, isDocs }) => {
  const { changeColorMode } = useColorMode()

  useDarkMode((darkMode) => {
    changeColorMode(darkMode ? "dark" : "light")
  })

  return (
    <VStack
      align="start"
      gap={{ base: "lg", md: "md" }}
      minH={
        isDocs
          ? undefined
          : {
              base: "calc(100dvh - $spaces.lg * 2)",
              md: "calc(100dvh - $spaces.md * 2)",
            }
      }
      overflowX="auto"
      p={{ base: "lg", md: "md" }}
    >
      {children}
    </VStack>
  )
}

// Cleanup utility to prevent focus property redefinition
const cleanupFocusProperties = () => {
  if (typeof window !== "undefined") {
    // Clear any existing focus-related properties that might cause conflicts
    try {
      // Remove any global focus event listeners
      const events = ["focus", "blur", "focusin", "focusout"]
      events.forEach((event) => {
        window.removeEventListener(event, () => {}, true)
        window.removeEventListener(event, () => {}, false)
      })

      // Clear any document-level focus handlers
      if (document) {
        events.forEach((event) => {
          document.removeEventListener(event, () => {}, true)
          document.removeEventListener(event, () => {}, false)
        })
      }
    } catch (error) {
      // Silently handle any cleanup errors
      console.warn("Focus cleanup warning:", error)
    }
  }
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
    codePanel: true,
  },

  decorators: [
    (Story, { viewMode }) => {
      React.useEffect(() => {
        cleanupFocusProperties()

        return () => {
          cleanupFocusProperties()
        }
      }, [])

      return (
        <UIProvider config={config} theme={theme}>
          <App isDocs={viewMode === "docs"}>
            <Story />
          </App>
        </UIProvider>
      )
    },
  ],
}

export default preview
