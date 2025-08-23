'use client'

import { useSession } from 'next-auth/react'
import {
  Card,
  CardHeader,
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
} from '@fluentui/react-components'
import {
  TaskListRegular,
  PersonRegular,
  CalendarRegular,
  CheckmarkCircleRegular,
  ErrorCircleRegular,
  ClockRegular,
} from '@fluentui/react-icons'
import DashboardLayout from '@/components/DashboardLayout'

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
})

interface Issue {
  id: string
  key: string
  title: string
  status: string
  priority: string
  assignee: string
  created: string
}

const mockIssues: Issue[] = [
  {
    id: '1',
    key: 'PROJ-101',
    title: 'Fix login page validation',
    status: 'In Progress',
    priority: 'High',
    assignee: 'John Doe',
    created: '2025-01-20',
  },
  {
    id: '2',
    key: 'PROJ-102',
    title: 'Implement dark mode',
    status: 'Todo',
    priority: 'Medium',
    assignee: 'Jane Smith',
    created: '2025-01-19',
  },
  {
    id: '3',
    key: 'PROJ-103',
    title: 'Update API documentation',
    status: 'Done',
    priority: 'Low',
    assignee: 'Bob Wilson',
    created: '2025-01-18',
  },
]

export default function DashboardPage() {
  const styles = useStyles()
  const { data: session } = useSession()

  const getPriorityBadge = (priority: string) => {
    const appearance = priority === 'High' ? 'important' : priority === 'Medium' ? 'warning' : 'subtle'
    return <Badge appearance={appearance}>{priority}</Badge>
  }

  const getStatusBadge = (status: string) => {
    let appearance: 'success' | 'warning' | 'subtle' | 'important' = 'subtle'
    if (status === 'Done') appearance = 'success'
    else if (status === 'In Progress') appearance = 'warning'
    
    return <Badge appearance={appearance}>{status}</Badge>
  }

  const columns: TableColumnDefinition<Issue>[] = [
    createTableColumn<Issue>({
      columnId: 'key',
      compare: (a, b) => a.key.localeCompare(b.key),
      renderHeaderCell: () => 'Key',
      renderCell: (item) => (
        <TableCellLayout>
          <Text weight="semibold">{item.key}</Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<Issue>({
      columnId: 'title',
      compare: (a, b) => a.title.localeCompare(b.title),
      renderHeaderCell: () => 'Title',
      renderCell: (item) => (
        <TableCellLayout>
          {item.title}
        </TableCellLayout>
      ),
    }),
    createTableColumn<Issue>({
      columnId: 'status',
      compare: (a, b) => a.status.localeCompare(b.status),
      renderHeaderCell: () => 'Status',
      renderCell: (item) => (
        <TableCellLayout>
          {getStatusBadge(item.status)}
        </TableCellLayout>
      ),
    }),
    createTableColumn<Issue>({
      columnId: 'priority',
      compare: (a, b) => a.priority.localeCompare(b.priority),
      renderHeaderCell: () => 'Priority',
      renderCell: (item) => (
        <TableCellLayout>
          {getPriorityBadge(item.priority)}
        </TableCellLayout>
      ),
    }),
    createTableColumn<Issue>({
      columnId: 'assignee',
      compare: (a, b) => a.assignee.localeCompare(b.assignee),
      renderHeaderCell: () => 'Assignee',
      renderCell: (item) => (
        <TableCellLayout>
          {item.assignee}
        </TableCellLayout>
      ),
    }),
  ]

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

        {/* Stats Cards */}
        <div className={styles.grid}>
          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <TaskListRegular />
              <Text size={400} weight="semibold">Total Issues</Text>
            </div>
            <div className={styles.statValue}>24</div>
            <div className={styles.statLabel}>Across all projects</div>
          </Card>

          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <PersonRegular />
              <Text size={400} weight="semibold">Assigned to Me</Text>
            </div>
            <div className={styles.statValue}>8</div>
            <div className={styles.statLabel}>Active assignments</div>
          </Card>

          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <CheckmarkCircleRegular />
              <Text size={400} weight="semibold">Completed</Text>
            </div>
            <div className={styles.statValue}>12</div>
            <div className={styles.statLabel}>This month</div>
          </Card>

          <Card className={styles.statsCard}>
            <div className={styles.cardHeader}>
              <ClockRegular />
              <Text size={400} weight="semibold">In Progress</Text>
            </div>
            <div className={styles.statValue}>5</div>
            <div className={styles.statLabel}>Currently active</div>
          </Card>
        </div>

        {/* Recent Issues */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacingVerticalM }}>
            <Text className={styles.sectionTitle}>Recent Issues</Text>
            <Button appearance="subtle">View All</Button>
          </div>

          <Card>
            <DataGrid
              items={mockIssues}
              columns={columns}
              sortable
              getRowId={(item) => item.id}
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<Issue>>
                {({ item, rowId }) => (
                  <DataGridRow<Issue> key={rowId}>
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