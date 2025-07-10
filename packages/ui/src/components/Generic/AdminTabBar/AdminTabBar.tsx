"use client"

import { memo, Tab, TabList, TabPanel, TabPanels, Tabs, type TabsProps } from "@yamada-ui/react"

/**
 * Props for {@link AdminTabBar} component
 */
export interface AdminTabBarProps extends TabsProps {
  /**
   * Label for tab 1 (left side)
   */
  tabLabel1?: string

  /**
   * Label for tab 2 (middle)
   */
  tabLabel2?: string

  /**
   * Label for tab 3 (right side)
   */
  tabLabel3?: string
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
    tabLabel1 = "View Members",
    tabLabel2 = "Edit/View Sessions",
    tabLabel3 = "Create Semesters & Sessions",
    tabListProps,
    tabPanelsProps,
    ...props
  }: AdminTabBarProps) => {
    return (
      <Tabs {...props}>
        <TabList {...tabListProps}>
          <Tab>{tabLabel1}</Tab>
          <Tab>{tabLabel2}</Tab>
          <Tab>{tabLabel3}</Tab>
        </TabList>

        <TabPanels {...tabPanelsProps}>{children}</TabPanels>
      </Tabs>
    )
  },
)

AdminTabBar.displayName = "AdminTabBar"
