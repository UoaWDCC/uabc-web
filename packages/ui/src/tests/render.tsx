import { config, theme } from "@repo/theme"
import type {
  Queries,
  RenderHookOptions as ReactRenderHookOptions,
  RenderOptions as ReactRenderOptions,
  queries,
} from "@testing-library/react"
import { render as reactRender, renderHook as reactRenderHook } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import type { UIProviderProps } from "@yamada-ui/react"
import { UIProvider } from "@yamada-ui/react"
import type { ReactElement } from "react"
import type * as ReactDOMClient from "react-dom/client"
import "@testing-library/jest-dom/vitest"

export type RenderOptions = {
  withProvider?: boolean
} & ReactRenderOptions

export type RenderReturn = {
  user: ReturnType<typeof userEvent.setup>
} & ReturnType<typeof reactRender>

export function render(
  ui: ReactElement,
  { withProvider = true, ...rest }: RenderOptions = {},
): RenderReturn {
  const user = userEvent.setup()

  if (withProvider)
    rest.wrapper ??= (props: UIProviderProps) => (
      <UIProvider theme={theme} config={config} {...props} />
    )

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
  if (withProvider)
    rest.wrapper ??= (props: UIProviderProps) => (
      <UIProvider {...props} theme={theme} config={config} {...providerProps} />
    )

  return reactRenderHook<Y, M, D, H, R>(render, rest)
}
