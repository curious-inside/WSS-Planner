'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardHeader,
  Text,
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
  Badge,
  SearchBox,
  Dropdown,
  Option,
  makeStyles,
  tokens,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Field,
  Input,
  Textarea,
  Combobox,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components'
import {
  AddRegular,
  SearchRegular,
  FilterRegular,
  BugRegular,
  TaskListAddRegular,
  PersonRegular,
  CalendarRegular,
} from '@fluentui/react-icons'
import DashboardLayout from '@/components/DashboardLayout'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  toolbar: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  searchBox: {
    width: '300px',
  },
  filterDropdown: {
    minWidth: '120px',
  },
  createButton: {
    marginLeft: 'auto',
  },
  formField: {
    marginBottom: tokens.spacingVerticalM,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minWidth: '500px',
  },
})

interface Issue {
  _id: string
  key: string
  title: string
  type: string
  status: string
  priority: string
  reporterId: any
  assigneeId?: any
  projectId: any
  createdAt: string
  updatedAt: string
}

export default function IssuesPage() {
  const styles = useStyles()
  const { data: session } = useSession()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  // Form state for creating issues
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'task' as const,
    priority: 'medium' as const,
    projectId: 'temp-project-id', // In real app, this would come from context
  })

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues')
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      } else {
        console.error('Failed to fetch issues')
      }
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateIssue = async () => {
    setError('')
    setCreating(true)

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create issue')
      } else {
        setIssues([data, ...issues])
        setCreateDialogOpen(false)
        setFormData({
          title: '',
          description: '',
          type: 'task',
          priority: 'medium',
          projectId: 'temp-project-id',
        })
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      bug: { color: 'danger', icon: <BugRegular /> },
      story: { color: 'success', icon: <PersonRegular /> },
      task: { color: 'brand', icon: <TaskListAddRegular /> },
      epic: { color: 'important', icon: <CalendarRegular /> },
      improvement: { color: 'warning', icon: <TaskListAddRegular /> },
      sub_task: { color: 'subtle', icon: <TaskListAddRegular /> },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.task
    return (
      <Badge appearance={config.color as any} icon={config.icon}>
        {type.replace('_', ' ')}
      </Badge>
    )
  }

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

    return <Badge appearance={appearance}>{status.replace('_', ' ')}</Badge>
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
          <Text>{item.title}</Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<Issue>({
      columnId: 'type',
      compare: (a, b) => a.type.localeCompare(b.type),
      renderHeaderCell: () => 'Type',
      renderCell: (item) => (
        <TableCellLayout>
          {getTypeBadge(item.type)}
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
      renderHeaderCell: () => 'Assignee',
      renderCell: (item) => (
        <TableCellLayout>
          {item.assigneeId?.name || 'Unassigned'}
        </TableCellLayout>
      ),
    }),
    createTableColumn<Issue>({
      columnId: 'created',
      compare: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      renderHeaderCell: () => 'Created',
      renderCell: (item) => (
        <TableCellLayout>
          {new Date(item.createdAt).toLocaleDateString()}
        </TableCellLayout>
      ),
    }),
  ]

  // Filter issues based on search and filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery === '' ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <DashboardLayout breadcrumbs={[{ title: 'Issues' }]}>
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size={600} weight="semibold">Issues</Text>
          <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
            {filteredIssues.length} of {issues.length} issues
          </Text>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <SearchBox
            placeholder="Search issues..."
            contentBefore={<SearchRegular />}
            value={searchQuery}
            onChange={(_, data) => setSearchQuery(data.value)}
            className={styles.searchBox}
          />

          <Dropdown
            placeholder="Status"
            value={statusFilter}
            onOptionSelect={(_, data) => setStatusFilter(data.optionValue || 'all')}
            className={styles.filterDropdown}
          >
            <Option value="all">All Status</Option>
            <Option value="todo">Todo</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="in_review">In Review</Option>
            <Option value="done">Done</Option>
          </Dropdown>

          <Dropdown
            placeholder="Priority"
            value={priorityFilter}
            onOptionSelect={(_, data) => setPriorityFilter(data.optionValue || 'all')}
            className={styles.filterDropdown}
          >
            <Option value="all">All Priority</Option>
            <Option value="critical">Critical</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Dropdown>

          <Dialog open={createDialogOpen} onOpenChange={(_, data) => setCreateDialogOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="primary"
                icon={<AddRegular />}
                className={styles.createButton}
              >
                Create Issue
              </Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Create New Issue</DialogTitle>
                <DialogContent className={styles.dialogContent}>
                  {error && (
                    <MessageBar intent="error">
                      <MessageBarBody>{error}</MessageBarBody>
                    </MessageBar>
                  )}

                  <Field label="Title" required>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter issue title"
                    />
                  </Field>

                  <Field label="Description">
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the issue..."
                      rows={4}
                    />
                  </Field>

                  <div style={{ display: 'flex', gap: tokens.spacingHorizontalM }}>
                    <Field label="Type" style={{ flex: 1 }}>
                      <Dropdown
                        value={formData.type}
                        onOptionSelect={(_, data) => setFormData({ ...formData, type: data.optionValue as any })}
                      >
                        <Option value="bug">Bug</Option>
                        <Option value="story">Story</Option>
                        <Option value="task">Task</Option>
                        <Option value="epic">Epic</Option>
                        <Option value="improvement">Improvement</Option>
                      </Dropdown>
                    </Field>

                    <Field label="Priority" style={{ flex: 1 }}>
                      <Dropdown
                        value={formData.priority}
                        onOptionSelect={(_, data) => setFormData({ ...formData, priority: data.optionValue as any })}
                      >
                        <Option value="critical">Critical</Option>
                        <Option value="high">High</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="low">Low</Option>
                      </Dropdown>
                    </Field>
                  </div>
                </DialogContent>
                <DialogActions>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary">Cancel</Button>
                  </DialogTrigger>
                  <Button
                    appearance="primary"
                    onClick={handleCreateIssue}
                    disabled={creating || !formData.title}
                  >
                    {creating ? 'Creating...' : 'Create Issue'}
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>

        {/* Issues Table */}
        <Card>
          {loading ? (
            <div style={{ padding: tokens.spacingVerticalXL, textAlign: 'center' }}>
              Loading issues...
            </div>
          ) : (
            <DataGrid
              items={filteredIssues}
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
          )}

          {!loading && filteredIssues.length === 0 && (
            <div style={{ padding: tokens.spacingVerticalXXL, textAlign: 'center' }}>
              <Text size={400} style={{ color: tokens.colorNeutralForeground2 }}>
                No issues found. Create your first issue to get started.
              </Text>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}