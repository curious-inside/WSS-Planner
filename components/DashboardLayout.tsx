'use client'

'use client'

import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
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
  Dropdown,
  Option,
} from '@fluentui/react-components'
import {
  BoardRegular,
  TaskListAddRegular,
  PeopleRegular,
  SettingsRegular,
  SignOutRegular,
  PersonRegular,
  HomeRegular,
  SearchRegular,
  AddRegular,
  AppsRegular,
} from '@fluentui/react-icons'
import { useProject } from '@/contexts/ProjectContext'

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
    margin: `0 ${tokens.spacingVerticalS}`,
  },
})

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const styles = useStyles()
  const router = useRouter()
  const { data: session } = useSession()
  const { projects, selectedProject, setSelectedProject, loading: projectsLoading } = useProject()

  const navItems = [
    { id: 'dashboard', icon: <HomeRegular />, label: 'Dashboard', href: '/dashboard' },
    { id: 'board', icon: <BoardRegular />, label: 'Board', href: '/board' },
    { id: 'issues', icon: <TaskListAddRegular />, label: 'Issues', href: '/issues' },
    { id: 'team', icon: <PeopleRegular />, label: 'Team', href: '/team' },
    { id: 'projects', icon: <AppsRegular />, label: 'Projects', href: '/projects' },
  ]

  const handleProjectChange = (_: any, data: any) => {
    const project = projects.find(p => p._id === data.optionValue)
    if (project) {
      setSelectedProject(project)
    }
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>WSS Planner</div>
        </div>
        <div className={styles.nav}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              appearance="subtle"
              icon={item.icon}
              onClick={() => router.push(item.href)}
              style={{ width: '100%', justifyContent: 'flex-start', marginBottom: tokens.spacingVerticalXS }}
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
          <Dropdown
            style={{ minWidth: '150px' }}
            value={selectedProject?.name || 'Select a project'}
            onOptionSelect={handleProjectChange}
            disabled={projectsLoading || projects.length === 0}
          >
            {projects.map((project) => (
              <Option key={project._id} value={project._id}>
                {project.name}
              </Option>
            ))}
          </Dropdown>

          <Input
            placeholder="Search..."
            contentBefore={<SearchRegular />}
            style={{ width: '300px' }}
          />
          <div style={{ flex: 1 }} />
          <Button icon={<AddRegular />} appearance="primary">Create</Button>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button appearance="subtle" icon={<Avatar name={session?.user?.name || ''} size={28} />}>
                {session?.user?.name}
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem icon={<PersonRegular />}>Profile</MenuItem>
                <MenuItem icon={<SettingsRegular />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem icon={<SignOutRegular />} onClick={() => signOut()}>
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