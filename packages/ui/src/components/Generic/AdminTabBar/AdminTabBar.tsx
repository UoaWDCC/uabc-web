"use client"

import type { AdminTabBarSlug } from "@repo/shared"
import {
  Box,
  type BoxProps,
  Tab,
  TabList,
  type TabProps,
  Tabs,
  type TabsProps,
  Link as UILink,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"

/**
 * Tab configuration with matching slugs and labels
 */
export interface TabConfig {
  slug: string
  label: string
}

/**
 * Props for {@link AdminTabBar} component
 */
export interface AdminTabBarProps extends BoxProps {
  /**
   * Array of tab configurations with matching slugs and labels
   */
  tabs: TabConfig[]

  /**
   * Slug for the tab
   */
  slug?: AdminTabBarSlug

  /**
   * Props for the Tabs component
   */
  tabsProps?: TabsProps

  /**
   * Props for the Tab component
   */
  tabProps?: TabProps

  /**
   * Index of the active tab
   */
  activeIndex?: number
}

/**
 * Admin Navigation Bar component for desktop only.
 * Uses Link navigation instead of TabPanels.
 *
 * @param props AdminNavigationBar component props
 * @returns The Admin Navigation Bar component
 *
 * @example
 * <AdminTabBar
 *   tabs={[
 *     { slug: "/admin/members", label: "View Members" },
 *     { slug: "/admin/sessions", label: "View Sessions" },
 *     { slug: "/admin/semesters", label: "View Semesters" }
 *   ]}
 * />
 *
 * @remarks Uses Next.js Link for navigation.
 */
export const AdminTabBar = memo(
  ({ tabs, slug, tabsProps, tabProps, activeIndex, ...props }: AdminTabBarProps) => {
    return (
      <Box as="nav" w="full" {...props}>
        <Tabs as="ul" index={activeIndex} {...tabsProps}>
          <TabList
            display="grid"
            gridTemplateColumns={`repeat(${tabs.length}, 1fr)`}
            maxW={{
              base: "calc(100vw - $spaces.md)",
              sm: "calc(100vw - $spaces.lg)",
              lg: "calc(100vw - $spaces.2xl)",
            }}
          >
            {tabs.map((tabConfig) => (
              <Tab as="li" key={tabConfig.slug} p="0" {...tabProps}>
                <UILink
                  _hover={{
                    textDecoration: "inherit",
                  }}
                  as={Link}
                  color="inherit"
                  href={tabConfig.slug}
                  px="md"
                  py="sm"
                  textAlign="center"
                  w="full"
                  whiteSpace="nowrap"
                >
                  {tabConfig.label}
                </UILink>
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>
    )
  },
)

AdminTabBar.displayName = "AdminTabBar"
