import { config, theme } from "@repo/theme"
import type {
  Queries,
  queries,
  RenderHookOptions as ReactRenderHookOptions,
  RenderOptions as ReactRenderOptions,
} from "@testing-library/react"
import { render as reactRender, renderHook as reactRenderHook } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import type { UIProviderProps } from "@yamada-ui/react"
import type { ReactElement, ReactNode } from "react"
import React from "react"
import type * as ReactDOMClient from "react-dom/client"
import "@testing-library/jest-dom/vitest"
import { UIProvider } from "@repo/ui/components/Provider"

export type RenderOptions = {
  withProvider?: boolean
} & ReactRenderOptions

export type RenderReturn = {
  user: ReturnType<typeof userEvent.setup>
} & ReturnType<typeof reactRender>

/**
 * Renders a React element for testing, wrapping it with UIProvider unless withProvider is false.
 *
 * @param ui React element to render
 * @param options Optional render options, including withProvider to disable UIProvider
 * @returns An object containing userEvent and the result of reactRender
 *
 * @example
 * // Basic usage
 * render(<Button>Click me</Button>)
 *
 * // Without UIProvider
 * render(<Button>Click me</Button>, { withProvider: false })
 */
export function render(
  ui: ReactElement,
  { withProvider = true, ...rest }: RenderOptions = {},
): RenderReturn {
  const user = userEvent.setup()

  if (withProvider) {
    const prevWrapper = rest.wrapper
    rest.wrapper = ({ children }: { children: ReactNode }) => {
      const element = prevWrapper ? React.createElement(prevWrapper, { children }) : children
      return (
        <UIProvider config={config} theme={theme}>
          {element}
        </UIProvider>
      )
    }
  }

  const result = reactRender(ui, rest)

  return { user, ...result }
}

type RendererableContainer = ReactDOMClient.Container
type HydrateableContainer = Parameters<(typeof ReactDOMClient)["hydrateRoot"]>[0]

export type RenderHookOptions<
  Y,
  M extends Queries = typeof queries,
  D extends HydrateableContainer | RendererableContainer = HTMLElement,
  H extends HydrateableContainer | RendererableContainer = D,
> = {
  withProvider?: boolean
  providerProps?: Omit<UIProviderProps, "children">
} & ReactRenderHookOptions<Y, M, D, H>

/**
 * Renders a React hook for testing, wrapping it with UIProvider unless withProvider is false.
 *
 * @param render Function that returns the hook value
 * @param options Optional renderHook options, including withProvider and providerProps
 * @returns The result of reactRenderHook
 *
 * @example
 * // Basic usage
 * renderHook(() => useMyHook())
 *
 * // Without UIProvider
 * renderHook(() => useMyHook(), { withProvider: false })
 */
export function renderHook<
  Y,
  M,
  D extends Queries = typeof queries,
  H extends HydrateableContainer | RendererableContainer = HTMLElement,
  R extends HydrateableContainer | RendererableContainer = H,
>(
  render: (props: M) => Y,
  { withProvider = true, providerProps, ...rest }: RenderHookOptions<M, D, H, R> = {},
) {
  if (withProvider) {
    const prevWrapper = rest.wrapper
    rest.wrapper = ({ children }: { children: ReactNode }) => {
      const element = prevWrapper ? React.createElement(prevWrapper, { children }) : children
      return (
        <UIProvider config={config} theme={theme} {...providerProps}>
          {element}
        </UIProvider>
      )
    }
  }

  return reactRenderHook<Y, M, D, H, R>(render, rest)
}
