"use client"

import { memo, Tab, TabList, TabPanel, TabPanels, Tabs, type TabsProps } from "@yamada-ui/react"

/**
 * Props for {@link AdminTabBar} component
 */
export interface AdminTabBarProps extends TabsProps {
  /**
   * Label for tab 1 (left side)
   */
  tab1Label?: string

  /**
   * Label for tab 2 (middle)
   */
  tab2Label?: string

  /**
   * Label for tab 3 (right side)
   */
  tab3Label?: string
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
    tab1Label = "View Members",
    tab2Label = "Edit/View Sessions",
    tab3Label = "Create Semesters & Sessions",
    tabListProps,
    tabPanelsProps,
    ...props
  }: AdminTabBarProps) => {
    return (
      <Tabs {...props}>
        <TabList {...tabListProps}>
          <Tab>{tab1Label}</Tab>
          <Tab>{tab2Label}</Tab>
          <Tab>{tab3Label}</Tab>
        </TabList>

        <TabPanels {...tabPanelsProps}>{children}</TabPanels>
      </Tabs>
    )
  },
)

AdminTabBar.displayName = "AdminTabBar"
