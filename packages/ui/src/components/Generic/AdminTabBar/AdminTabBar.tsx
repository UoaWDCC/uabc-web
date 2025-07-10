"use client"

import { memo, Tab, TabList, TabPanel, TabPanels, Tabs, type TabsProps } from "@yamada-ui/react"

/**
 * Props for {@link AdminTabBar} component
 */
export interface AdminTabBarProps extends TabsProps {
  /**
   * Label for the first tab (left side)
   */
  tabLabel0?: string

  /**
   * Label for the second tab (middle)
   */
  tabLabel1?: string

  /**
   * Label for the third tab (right side)
   */
  tabLabel2?: string
}

/**
 * Admin Tab Bar component for desktop only.
 *
 * @param props AdminTabBar component props
 * @returns The Admin Tab Bar component
 *
 * @example
 * <AdminTabBar tabPanelsProps={{ bgColor: "secondary" }}>
 *    <TabPanel>Panel 1</TabPanel>
 *    <TabPanel>Panel 2</TabPanel>
 *    <TabPanel>Panel 3</TabPanel>
 * </AdminTabBar>
 *
 * @remarks Currently, only 3 tabs are currently permitted.
 * @remarks Only {@link TabPanel}s should be added as children.
 */
export const AdminTabBar = memo(
  ({
    children,
    tabLabel0 = "View Members",
    tabLabel1 = "Edit/View Sessions",
    tabLabel2 = "Create Semesters & Sessions",
    tabListProps,
    tabPanelsProps,
    ...props
  }: AdminTabBarProps) => {
    return (
      <Tabs {...props}>
        <TabList {...tabListProps}>
          <Tab>{tabLabel0}</Tab>
          <Tab>{tabLabel1}</Tab>
          <Tab>{tabLabel2}</Tab>
        </TabList>

        <TabPanels {...tabPanelsProps}>{children}</TabPanels>
      </Tabs>
    )
  },
)

AdminTabBar.displayName = "AdminTabBar"
