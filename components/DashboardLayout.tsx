'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  makeStyles,
  tokens,
  Hamburger,
  Button,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  SearchBox,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  Nav,
  NavItem,
  Badge,
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
  NotificationRegular,
  AppsRegular,
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
  sidebarCollapsed: {
    width: '56px',
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
  breadcrumb: {
    flex: 1,
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const navItems = [
    { id: 'dashboard', icon: <HomeRegular />, label: 'Dashboard', href: '/dashboard' },
    { id: 'projects', icon: <AppsRegular />, label: 'Projects', href: '/projects' },
    { id: 'board', icon: <BoardRegular />, label: 'Board', href: '/board' },
    { id: 'issues', icon: <TaskListRegular />, label: 'Issues', href: '/issues' },
    { id: 'reports', icon: <TaskListRegular />, label: 'Reports', href: '/reports' },
    { id: 'team', icon: <PeopleRegular />, label: 'Team', href: '/team' },
  ]

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <Hamburger onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          {!sidebarCollapsed && <div className={styles.logo}>WSS BugTracker</div>}
        </div>

        {!sidebarCollapsed && (
          <Button
            appearance="primary"
            icon={<AddRegular />}
            className={styles.createButton}
          >
            Create Issue
          </Button>
        )}

        <Nav className={styles.nav} size="small">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              value={item.id}
              onClick={() => router.push(item.href)}
            >
              {!sidebarCollapsed && item.label}
            </NavItem>
          ))}
        </Nav>

        {!sidebarCollapsed && (
          <div style={{ padding: tokens.spacingVerticalS, borderTop: `1px solid ${tokens.colorNeutralStroke2}` }}>
            <NavItem
              icon={<SettingsRegular />}
              value="settings"
              onClick={() => router.push('/settings')}
            >
              Settings
            </NavItem>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Top Bar */}
        <div className={styles.topbar}>
          <SearchBox
            placeholder="Search issues, projects..."
            contentBefore={<SearchRegular />}
            style={{ width: '300px' }}
          />

          <div className={styles.breadcrumb}>
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index}>
                    <BreadcrumbItem
                      onClick={crumb.href ? () => router.push(crumb.href!) : undefined}
                    >
                      {crumb.title}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbDivider />}
                  </div>
                ))}
              </Breadcrumb>
            )}
          </div>

          <Button
            appearance="subtle"
            icon={<NotificationRegular />}
          >
            <Badge appearance="filled" color="important" size="small">
              3
            </Badge>
          </Button>

          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                icon={
                  <Avatar
                    name={session.user?.name || ''}
                    image={{ src: session.user?.image || undefined }}
                    size={24}
                  />
                }
              >
                {session.user?.name}
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem icon={<PersonRegular />}>Profile</MenuItem>
                <MenuItem icon={<SettingsRegular />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<SignOutRegular />}
                  onClick={() => signOut({ callbackUrl: '/' })}
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