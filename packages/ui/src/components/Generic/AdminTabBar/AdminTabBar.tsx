"use client"

import { memo, Tab, Tabs, type TabsProps } from "@yamada-ui/react"

/**
 * Props for {@link AdminTabBar} component
 */
export interface AdminTabBarProps extends TabsProps {
  tab1Label?: string
  tab2Label?: string
  tab3Label?: string
  defaultIndex?: number
}

/**
 * Admin Tab Bar component for desktop only.
 *
 * @param props AdminTabBar component props
 * @returns The Admin Tab Bar component
 */
export const AdminTabBar = memo(
  ({
    children,
    tab1Label = "View Members",
    tab2Label = "Edit/View Sessions",
    tab3Label = "Create Semesters & Sessions",
    defaultIndex,
  }: AdminTabBarProps) => {
    return (
      <Tabs defaultIndex={defaultIndex}>
        <Tab>{tab1Label}</Tab>
        <Tab>{tab2Label}</Tab>
        <Tab>{tab3Label}</Tab>

        {children}
      </Tabs>
    )
  },
)

AdminTabBar.displayName = "AdminTabBar"
