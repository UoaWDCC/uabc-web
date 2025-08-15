"use client"

import { memo, Tab, TabList, TabPanel, TabPanels, Tabs, type TabsProps } from "@yamada-ui/react"

/**
 * Props for {@link AdminTabBarExtended} component
 */
export interface AdminTabBarExtendedProps extends TabsProps {
  /**
   * Label for the first tab
   */
  tabLabel0?: string

  /**
   * Label for the second tab
   */
  tabLabel1?: string

  /**
   * Label for the third tab
   */
  tabLabel2?: string

  /**
   * Label for the fourth tab
   */
  tabLabel3?: string
}

/**
 * Extended Admin Tab Bar component that supports 4 tabs.
 *
 * @param props AdminTabBarExtended component props
 * @returns The Extended Admin Tab Bar component
 *
 * @example
 * <AdminTabBarExtended tabPanelsProps={{ bgColor: "secondary" }}>
 *    <TabPanel>Panel 0</TabPanel>
 *    <TabPanel>Panel 1</TabPanel>
 *    <TabPanel>Panel 2</TabPanel>
 *    <TabPanel>Panel 3</TabPanel>
 * </AdminTabBarExtended>
 *
 * @remarks Supports 4 tabs for extended admin functionality.
 * @remarks Only {@link TabPanel}s should be added as children.
 */
export const AdminTabBarExtended = memo(
  ({
    children,
    tabLabel0 = "View Members",
    tabLabel1 = "View Sessions",
    tabLabel2 = "View Semesters",
    tabLabel3 = "Upload CSV",
    tabListProps,
    tabPanelsProps,
    ...props
  }: AdminTabBarExtendedProps) => {
    return (
      <Tabs {...props}>
        <TabList {...tabListProps}>
          <Tab>{tabLabel0}</Tab>
          <Tab>{tabLabel1}</Tab>
          <Tab>{tabLabel2}</Tab>
          <Tab>{tabLabel3}</Tab>
        </TabList>

        <TabPanels {...tabPanelsProps}>{children}</TabPanels>
      </Tabs>
    )
  },
)

AdminTabBarExtended.displayName = "AdminTabBarExtended"
