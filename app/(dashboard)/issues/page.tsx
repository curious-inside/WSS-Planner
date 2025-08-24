'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
  Card,
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
  MessageBar,
  MessageBarBody,
  Spinner,
  Link,
} from '@fluentui/react-components'
import {
  AddRegular,
  SearchRegular,
  BugRegular,
  TaskListAddRegular,
  PersonRegular,
  CalendarRegular,
} from '@fluentui/react-icons'
import DashboardLayout from '@/components/DashboardLayout'
import { IIssue } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'

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
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minWidth: '500px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
})

export default function IssuesPage() {
  const styles = useStyles()
  const { selectedProject } = useProject()
  const [issues, setIssues] = useState<IIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'task' as const,
    priority: 'medium' as const,
    projectId: '',
  })

  useEffect(() => {
    if (selectedProject) {
      setFormData(prev => ({ ...prev, projectId: selectedProject._id }))
    }
  }, [selectedProject])

  const fetchIssues = useCallback(async () => {
    if (!selectedProject) {
      setIssues([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append('projectId', selectedProject._id)
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)

      const response = await fetch(`/api/issues?${params.toString()}`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch issues')
      }
      const data = await response.json()
      setIssues(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [selectedProject, debouncedSearchQuery, statusFilter, priorityFilter])

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  const handleCreateIssue = async () => {
    setFormError(null)
    setCreating(true)

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create issue')
      }

      setIssues(prev => [data, ...prev])
      setCreateDialogOpen(false)
      setFormData({
        title: '',
        description: '',
        type: 'task',
        priority: 'medium',
        projectId: selectedProject?._id || '',
      })
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const getTypeBadge = (type: string) => {
    const config = {
      bug: { color: 'danger', icon: <BugRegular /> },
      story: { color: 'success', icon: <PersonRegular /> },
      task: { color: 'brand', icon: <TaskListAddRegular /> },
      epic: { color: 'important', icon: <CalendarRegular /> },
      improvement: { color: 'warning', icon: <TaskListAddRegular /> },
      sub_task: { color: 'subtle', icon: <TaskListAddRegular /> },
    }[type] || { color: 'brand', icon: <TaskListAddRegular /> }

    return <Badge appearance={config.color as any} icon={config.icon}>{type.replace('_', ' ')}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const appearance = {
      critical: 'important',
      high: 'important',
      medium: 'warning',
      low: 'subtle',
    }[priority] || 'subtle'
    return <Badge appearance={appearance as any}>{priority}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const appearance = {
      done: 'success',
      in_progress: 'warning',
      in_review: 'brand',
      todo: 'subtle',
      cancelled: 'subtle',
    }[status] || 'subtle'
    return <Badge appearance={appearance as any}>{status.replace('_', ' ')}</Badge>
  }

  const columns: TableColumnDefinition<IIssue>[] = [
    createTableColumn<IIssue>({
      columnId: 'key',
      compare: (a, b) => a.key.localeCompare(b.key),
      renderHeaderCell: () => 'Key',
      renderCell: (item) => (
        <TableCellLayout>
          <Link href={`/issues/${item.key}`}><Text weight="semibold">{item.key}</Text></Link>
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
      columnId: 'type',
      compare: (a, b) => a.type.localeCompare(b.type),
      renderHeaderCell: () => 'Type',
      renderCell: (item) => <TableCellLayout>{getTypeBadge(item.type)}</TableCellLayout>,
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
      renderCell: (item) => <TableCellLayout>{(typeof item.assigneeId === 'object' && item.assigneeId?.name) || 'Unassigned'}</TableCellLayout>,
    }),
    createTableColumn<IIssue>({
      columnId: 'created',
      compare: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      renderHeaderCell: () => 'Created',
      renderCell: (item) => <TableCellLayout>{new Date(item.createdAt).toLocaleDateString()}</TableCellLayout>,
    }),
  ]

  const totalIssueCount = useMemo(() => issues.length, [issues]);

  return (
    <DashboardLayout breadcrumbs={[{ title: 'Issues' }]}>
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size={600} weight="semibold">Issues</Text>
          <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
            {totalIssueCount} issues
          </Text>
        </div>

        {error && (
          <MessageBar intent="error" onDismiss={() => setError(null)}>
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        )}

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <SearchBox
            placeholder="Search issues..."
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
              <Button appearance="primary" icon={<AddRegular />} className={styles.createButton} disabled={!selectedProject}>Create Issue</Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Create New Issue</DialogTitle>
                <DialogContent>
                  {formError && (
                    <MessageBar intent="error" onDismiss={() => setFormError(null)}>
                      <MessageBarBody>{formError}</MessageBarBody>
                    </MessageBar>
                  )}
                  <Field label="Title" required>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </Field>
                  <Field label="Description">
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <Button appearance="primary" onClick={handleCreateIssue} disabled={creating || !formData.title}>
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
            <div className={styles.loading}><Spinner label="Loading issues..." /></div>
          ) : (
            <DataGrid items={issues} columns={columns} sortable getRowId={(item) => item._id}>
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<IIssue>>
                {({ item, rowId }) => (
                  <DataGridRow<IIssue> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          )}
          {!loading && issues.length === 0 && (
            <div style={{ padding: tokens.spacingVerticalXXL, textAlign: 'center' }}>
              <Text size={400} style={{ color: tokens.colorNeutralForeground2 }}>
                No issues found matching your criteria.
              </Text>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}