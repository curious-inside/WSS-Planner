'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridCell,
  DataGridBody,
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  Spinner,
  MessageBar,
  MessageBarBody,
  Link,
} from '@fluentui/react-components'
import {
  TaskListRegular,
  PersonRegular,
  CheckmarkCircleRegular,
  ClockRegular,
} from '@fluentui/react-icons'
import DashboardLayout from '@/components/DashboardLayout'
import { IIssue } from '@/types'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalXL,
  },
  statsCard: {
    padding: tokens.spacingVerticalL,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
  },
  statValue: {
    fontSize: tokens.fontSizeBase700,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandBackground,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  section: {
    marginBottom: tokens.spacingVerticalXL,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalM,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
})

export default function DashboardPage() {
  const styles = useStyles()
  const { data: session } = useSession()
  const [issues, setIssues] = useState<IIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/issues')
        if (!response.ok) {
          throw new Error('Failed to fetch issues')
        }
        const data = await response.json()
        setIssues(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

  const stats = useMemo(() => {
    if (!session?.user) return { total: 0, assignedToMe: 0, completed: 0, inProgress: 0 }

    return {
      total: issues.length,
      assignedToMe: issues.filter(issue => issue.assigneeId?._id === session.user.id).length,
      completed: issues.filter(issue => issue.status === 'done').length,
      inProgress: issues.filter(issue => issue.status === 'in_progress').length,
    }
  }, [issues, session])

  const getPriorityBadge = (priority: string) => {
    const appearance =
      priority === 'critical' ? 'important' :
      priority === 'high' ? 'important' :
      priority === 'medium' ? 'warning' : 'subtle'
    return <Badge appearance={appearance}>{priority}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const appearance =
      status === 'done' ? 'success' :
      status === 'in_progress' ? 'warning' :
      status === 'in_review' ? 'brand' : 'subtle'
    return <Badge appearance={appearance}>{status.replace(/_/g, ' ')}</Badge>
  }

  const columns: TableColumnDefinition<IIssue>[] = [
    createTableColumn<IIssue>({
      columnId: 'key',
      compare: (a, b) => a.key.localeCompare(b.key),
      renderHeaderCell: () => 'Key',
      renderCell: (item) => (
        <TableCellLayout>
          <Link href={`/issues/${item.key}`}>
            <Text weight="semibold">{item.key}</Text>
          </Link>
        </TableCellLayout>
      ),
    }),
    createTableColumn<IIssue>({
      columnId: 'title',
      compare: (a, b) => a.title.localeCompare(b.title),
      renderHeaderCell: () => 'Title',
      renderCell: (item) => <TableCellLayout>{item.title}</TableCellLayout>,
    }),
    createTableColumn<IIssue>({
      columnId: 'status',
      compare: (a, b) => a.status.localeCompare(b.status),
      renderHeaderCell: () => 'Status',
      renderCell: (item) => <TableCellLayout>{getStatusBadge(item.status)}</TableCellLayout>,
    }),
    createTableColumn<IIssue>({
      columnId: 'priority',
      compare: (a, b) => a.priority.localeCompare(b.priority),
      renderHeaderCell: () => 'Priority',
      renderCell: (item) => <TableCellLayout>{getPriorityBadge(item.priority)}</TableCellLayout>,
    }),
    createTableColumn<IIssue>({
      columnId: 'assignee',
      compare: (a, b) => (a.assigneeId?.name || '').localeCompare(b.assigneeId?.name || ''),
      renderHeaderCell: () => 'Assignee',
      renderCell: (item) => (
        <TableCellLayout>
          {item.assigneeId?.name || 'Unassigned'}
        </TableCellLayout>
      ),
    }),
  ]

  const recentIssues = useMemo(() => issues.slice(0, 5), [issues])

  if (loading) {
    return (
      <DashboardLayout breadcrumbs={[{ title: 'Dashboard' }]}>
        <div className={styles.loading}>
          <Spinner label="Loading dashboard..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout breadcrumbs={[{ title: 'Dashboard' }]}>
      <div className={styles.container}>
        <div>
          <Text size={600} weight="semibold">
            Welcome back, {session?.user?.name}!
          </Text>
          <Text block size={300} style={{ color: tokens.colorNeutralForeground2, marginTop: tokens.spacingVerticalXS }}>
            Here's what's happening with your projects
          </Text>
        </div>

        {error && (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        )}

        {/* Stats Cards */}
        <div className={styles.grid}>
          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <TaskListRegular />
              <Text size={400} weight="semibold">Total Issues</Text>
            </div>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Across all projects</div>
          </Card>
          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <PersonRegular />
              <Text size={400} weight="semibold">Assigned to Me</Text>
            </div>
            <div className={styles.statValue}>{stats.assignedToMe}</div>
            <div className={styles.statLabel}>Active assignments</div>
          </Card>
          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <CheckmarkCircleRegular />
              <Text size={400} weight="semibold">Completed</Text>
            </div>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Total completed</div>
          </Card>
          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <ClockRegular />
              <Text size={400} weight="semibold">In Progress</Text>
            </div>
            <div className={styles.statValue}>{stats.inProgress}</div>
            <div className={styles.statLabel}>Currently active</div>
          </Card>
        </div>

        {/* Recent Issues */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacingVerticalM }}>
            <Text className={styles.sectionTitle}>Recent Issues</Text>
            <Button appearance="subtle" as="a" href="/issues">View All</Button>
          </div>
          <Card>
            <DataGrid
              items={recentIssues}
              columns={columns}
              sortable
              getRowId={(item) => item._id}
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<IIssue>>
                {({ item, rowId }) => (
                  <DataGridRow<IIssue> key={rowId}>
                    {({ renderCell }) => (
                      <DataGridCell>{renderCell(item)}</DataGridCell>
                    )}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}