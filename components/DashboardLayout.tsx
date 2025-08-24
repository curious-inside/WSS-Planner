'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  makeStyles,
  tokens,
  Button,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Input,
  Text,
} from '@fluentui/react-components'
import {
  BoardRegular,
  TaskListRegular,
  PeopleRegular,
  SettingsRegular,
  SignOutRegular,
  PersonRegular,
  HomeRegular,
  SearchRegular,
  AddRegular,
  AppsRegular,
  Navigation20Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  sidebar: {
    width: '240px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  logo: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandBackground,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topbar: {
    height: '56px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalL}`,
    gap: tokens.spacingHorizontalL,
  },
  content: {
    flex: 1,
    padding: tokens.spacingVerticalL,
    overflow: 'auto',
  },
  nav: {
    padding: tokens.spacingVerticalS,
    flex: 1,
  },
  createButton: {
    margin: tokens.spacingVerticalS,
  },
})

interface DashboardLayoutProps {
  children: React.ReactNode
  breadcrumbs?: { title: string; href?: string }[]
}

export default function DashboardLayout({ children, breadcrumbs = [] }: DashboardLayoutProps) {
  const styles = useStyles()
  const router = useRouter()

  const navItems = [
    { id: 'dashboard', icon: <HomeRegular />, label: 'Dashboard', href: '/dashboard' },
    { id: 'projects', icon: <AppsRegular />, label: 'Projects', href: '/projects' },
    { id: 'board', icon: <BoardRegular />, label: 'Board', href: '/board' },
    { id: 'issues', icon: <TaskListRegular />, label: 'Issues', href: '/issues' },
    { id: 'team', icon: <PeopleRegular />, label: 'Team', href: '/team' },
  ]

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>WSS Planner</div>
        </div>

        <Button
          appearance="primary"
          icon={<AddRegular />}
          className={styles.createButton}
        >
          Create Issue
        </Button>

        <div className={styles.nav}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              appearance="subtle"
              icon={item.icon}
              onClick={() => router.push(item.href)}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                marginBottom: tokens.spacingVerticalXS,
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Top Bar */}
        <div className={styles.topbar}>
          <Input
            placeholder="Search issues, projects..."
            contentBefore={<SearchRegular />}
            style={{ width: '300px' }}
          />

          <div style={{ flex: 1 }} />

          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                icon={
                  <Avatar
                    name="Demo User"
                    size={24}
                  />
                }
              >
                Demo User
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem icon={<PersonRegular />}>Profile</MenuItem>
                <MenuItem icon={<SettingsRegular />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<SignOutRegular />}
                  onClick={() => router.push('/login')}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>

        {/* Page Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}