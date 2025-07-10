"use client"

import { memo, Tab, TabList, TabPanel, TabPanels, Tabs, type TabsProps } from "@yamada-ui/react"

/**
 * Props for {@link AdminTabBar} component
 */
export interface AdminTabBarProps extends TabsProps {
  tab1Label?: string
  tab2Label?: string
  tab3Label?: string
}

/**
 * Admin Tab Bar component for desktop only.
 *
 * @param props AdminTabBar component props
 * @returns The Admin Tab Bar component
 *
 * @remarks Only {@link TabPanel}s should be put as child components
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
