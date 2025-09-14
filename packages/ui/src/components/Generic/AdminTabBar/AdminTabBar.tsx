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
 * Props for {@link AdminTabBar} component
 */
export interface AdminTabBarProps extends BoxProps {
  tabSlugs?: string[]
  /**
   * Labels for the tabs
   */
  tabLabels?: string[]

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
 *   tabUrl0="/admin/members"
 *   tabUrl1="/admin/sessions"
 *   tabUrl2="/admin/semesters"
 *   slug="members"
 * />
 *
 * @remarks Currently, only 3 tabs are currently permitted.
 * @remarks Uses Next.js Link for navigation.
 */
export const AdminTabBar = memo(
  ({
    tabLabels = ["View Members", "View Sessions", "View Semesters"],
    tabSlugs = ["/admin/members", "/admin/sessions", "/admin/semesters"],
    slug,
    tabsProps,
    tabProps,
    activeIndex,
    ...props
  }: AdminTabBarProps) => {
    return (
      <Box as="nav" w="full" {...props}>
        <Tabs as="ul" index={activeIndex} {...tabsProps}>
          <TabList
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            maxW={{
              base: "calc(100vw - $spaces.md)",
              sm: "calc(100vw - $spaces.lg)",
              lg: "calc(100vw - $spaces.2xl)",
            }}
          >
            {tabSlugs.map((slug, index) => (
              <Tab as="li" key={slug} p="0" {...tabProps}>
                <UILink
                  _hover={{
                    textDecoration: "inherit",
                  }}
                  as={Link}
                  color="inherit"
                  href={slug}
                  px="md"
                  py="sm"
                  whiteSpace="nowrap"
                >
                  {tabLabels[index]}
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
