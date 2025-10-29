'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  ListTodo,
  Target,
  Zap,
  Users,
  TrendingUp,
  Crown,
  ArrowRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string | null
  assigned_user?: {
    id: string
    name: string
    avatar_url: string
  }
  due_date: string | null
  created_at: string
  updated_at: string
  created_by: string
  tags: string[]
  project_id?: string
  project_name?: string
  estimated_hours?: number
  actual_hours?: number
  subtasks?: Task[]
  comments_count: number
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on_hold'
  color: string
  created_at: string
  task_count: number
  completed_tasks: number
}

interface TaskStats {
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  overdue_tasks: number
  this_week_tasks: number
  completion_rate: number
}

export default function TaskManagerPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<TaskStats>({
    total_tasks: 0,
    completed_tasks: 0,
    in_progress_tasks: 0,
    overdue_tasks: 0,
    this_week_tasks: 0,
    completion_rate: 0
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assigned_to: '',
    due_date: '',
    project_id: '',
    estimated_hours: 0,
    tags: [] as string[]
  })
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })

  useEffect(() => {
    loadTasks()
    loadProjects()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [tasks])

  const loadTasks = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from Supabase
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Implement dark mode theme',
          description: 'Create a comprehensive dark mode theme for the dashboard with proper contrast ratios and accessibility compliance.',
          status: 'in_progress',
          priority: 'high',
          assigned_to: 'user1',
          assigned_user: {
            id: 'user1',
            name: 'John Designer',
            avatar_url: '/api/placeholder/40/40'
          },
          due_date: '2024-01-25T00:00:00Z',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:20:00Z',
          created_by: 'user1',
          tags: ['frontend', 'theme', 'accessibility'],
          project_id: 'proj1',
          project_name: 'Dashboard Redesign',
          estimated_hours: 8,
          actual_hours: 5,
          comments_count: 3
        },
        {
          id: '2',
          title: 'Fix mobile responsiveness issues',
          description: 'Address mobile layout problems on the theme studio page, particularly with the code editor.',
          status: 'todo',
          priority: 'medium',
          assigned_to: 'user2',
          assigned_user: {
            id: 'user2',
            name: 'Sarah Developer',
            avatar_url: '/api/placeholder/40/40'
          },
          due_date: '2024-01-28T00:00:00Z',
          created_at: '2024-01-18T09:15:00Z',
          updated_at: '2024-01-18T09:15:00Z',
          created_by: 'user1',
          tags: ['mobile', 'responsive', 'bug'],
          project_id: 'proj1',
          project_name: 'Dashboard Redesign',
          estimated_hours: 4,
          actual_hours: 0,
          comments_count: 1
        },
        {
          id: '3',
          title: 'Create user documentation',
          description: 'Write comprehensive documentation for the theme studio features and API integration.',
          status: 'completed',
          priority: 'low',
          assigned_to: 'user3',
          assigned_user: {
            id: 'user3',
            name: 'Mike Writer',
            avatar_url: '/api/placeholder/40/40'
          },
          due_date: '2024-01-20T00:00:00Z',
          created_at: '2024-01-10T14:20:00Z',
          updated_at: '2024-01-19T16:45:00Z',
          created_by: 'user1',
          tags: ['documentation', 'user-guide'],
          project_id: 'proj2',
          project_name: 'Documentation Project',
          estimated_hours: 6,
          actual_hours: 7,
          comments_count: 0
        },
        {
          id: '4',
          title: 'Optimize database queries',
          description: 'Review and optimize slow database queries in the marketplace and theme management sections.',
          status: 'todo',
          priority: 'urgent',
          assigned_to: null,
          due_date: '2024-01-22T00:00:00Z',
          created_at: '2024-01-19T11:30:00Z',
          updated_at: '2024-01-19T11:30:00Z',
          created_by: 'user1',
          tags: ['backend', 'performance', 'database'],
          project_id: 'proj3',
          project_name: 'Performance Optimization',
          estimated_hours: 12,
          actual_hours: 0,
          comments_count: 5
        }
      ]
      setTasks(mockTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      // Mock data - in real implementation, this would fetch from Supabase
      const mockProjects: Project[] = [
        {
          id: 'proj1',
          name: 'Dashboard Redesign',
          description: 'Complete redesign of the main dashboard interface',
          status: 'active',
          color: '#3B82F6',
          created_at: '2024-01-01T00:00:00Z',
          task_count: 8,
          completed_tasks: 3
        },
        {
          id: 'proj2',
          name: 'Documentation Project',
          description: 'Create comprehensive user and developer documentation',
          status: 'active',
          color: '#10B981',
          created_at: '2024-01-05T00:00:00Z',
          task_count: 5,
          completed_tasks: 2
        },
        {
          id: 'proj3',
          name: 'Performance Optimization',
          description: 'Optimize application performance and database queries',
          status: 'active',
          color: '#F59E0B',
          created_at: '2024-01-10T00:00:00Z',
          task_count: 3,
          completed_tasks: 0
        }
      ]
      setProjects(mockProjects)
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const calculateStats = () => {
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'completed').length
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length
    const overdueTasks = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < now && 
      task.status !== 'completed'
    ).length
    const thisWeekTasks = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) <= oneWeekFromNow && 
      task.status !== 'completed'
    ).length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    setStats({
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      in_progress_tasks: inProgressTasks,
      overdue_tasks: overdueTasks,
      this_week_tasks: thisWeekTasks,
      completion_rate: completionRate
    })
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: 'todo',
        priority: newTask.priority,
        assigned_to: newTask.assigned_to || null,
        assigned_user: newTask.assigned_to ? {
          id: newTask.assigned_to,
          name: 'Assigned User',
          avatar_url: '/api/placeholder/40/40'
        } : undefined,
        due_date: newTask.due_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current-user',
        tags: newTask.tags,
        project_id: newTask.project_id || undefined,
        project_name: projects.find(p => p.id === newTask.project_id)?.name,
        estimated_hours: newTask.estimated_hours,
        actual_hours: 0,
        comments_count: 0
      }

      setTasks(prev => [task, ...prev])
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        due_date: '',
        project_id: '',
        estimated_hours: 0,
        tags: []
      })
      setShowCreateDialog(false)
      
      toast({
        title: "Task Created",
        description: "New task has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      })
      return
    }

    try {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        status: 'active',
        color: newProject.color,
        created_at: new Date().toISOString(),
        task_count: 0,
        completed_tasks: 0
      }

      setProjects(prev => [project, ...prev])
      setNewProject({
        name: '',
        description: '',
        color: '#3B82F6'
      })
      setShowCreateProjectDialog(false)
      
      toast({
        title: "Project Created",
        description: "New project has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      ))
      
      toast({
        title: "Task Updated",
        description: `Task status updated to ${newStatus.replace('_', ' ')}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400'
      case 'high':
        return 'bg-orange-500/20 text-orange-400'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'low':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-400" />
      case 'todo':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesProject = projectFilter === 'all' || task.project_id === projectFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading gradient-text">Task Manager</h1>
              <p className="text-muted-foreground">Manage projects, tasks, and team collaboration</p>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={showCreateProjectDialog} onOpenChange={setShowCreateProjectDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="glass">
                    <Target className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Start a new project to organize your tasks
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={newProject.name}
                        onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter project name"
                        className="glass mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the project..."
                        className="glass mt-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-color">Color</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="color"
                          value={newProject.color}
                          onChange={(e) => setNewProject(prev => ({ ...prev, color: e.target.value }))}
                          className="w-12 h-10 rounded border-0 cursor-pointer"
                        />
                        <Input
                          value={newProject.color}
                          onChange={(e) => setNewProject(prev => ({ ...prev, color: e.target.value }))}
                          className="glass flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateProjectDialog(false)}
                        className="glass"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateProject} className="btn-primary">
                        Create Project
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to your project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="task-title">Task Title</Label>
                        <Input
                          id="task-title"
                          value={newTask.title}
                          onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter task title"
                          className="glass mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}
                        >
                          <SelectTrigger className="glass mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the task..."
                        className="glass mt-2"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="task-project">Project</Label>
                        <Select
                          value={newTask.project_id}
                          onValueChange={(value) => setNewTask(prev => ({ ...prev, project_id: value }))}
                        >
                          <SelectTrigger className="glass mt-2">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="task-due-date">Due Date</Label>
                        <Input
                          id="task-due-date"
                          type="datetime-local"
                          value={newTask.due_date}
                          onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                          className="glass mt-2"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateDialog(false)}
                        className="glass"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask} disabled={loading} className="btn-primary">
                        {loading ? 'Creating...' : 'Create Task'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.total_tasks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completion_rate.toFixed(1)}% completed
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.in_progress_tasks}</div>
              <p className="text-xs text-muted-foreground">
                Active tasks
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.overdue_tasks}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stats.this_week_tasks}</div>
              <p className="text-xs text-muted-foreground">
                Due soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Banner */}
        <Card className="glass-card mb-6 border-gradient bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Unlock Advanced Project Management
                  </h3>
                  <p className="text-white/70 text-sm">
                    Upgrade to Agency Pro for team collaboration, advanced analytics, and automation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/subscribe'}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="pl-10 glass"
                    />
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Project</Label>
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="glass mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Projects Overview */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.completed_tasks}/{project.task_count} tasks
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 glass">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(task.status)}
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            {task.project_name && (
                              <Badge variant="secondary" className="text-xs">
                                {task.project_name}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{task.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                            {task.assigned_user && (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">
                                    {task.assigned_user.name.charAt(0)}
                                  </span>
                                </div>
                                <span>{task.assigned_user.name}</span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {task.estimated_hours && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{task.estimated_hours}h estimated</span>
                              </div>
                            )}
                            {task.comments_count > 0 && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{task.comments_count}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Select
                            value={task.status}
                            onValueChange={(value) => handleUpdateTaskStatus(task.id, value as Task['status'])}
                          >
                            <SelectTrigger className="w-32 glass">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todo">To Do</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button size="sm" variant="ghost" className="glass">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="todo" className="space-y-4">
                {filteredTasks.filter(task => task.status === 'todo').map((task) => (
                  <Card key={task.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(task.status)}
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{task.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            {task.assigned_user && (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">
                                    {task.assigned_user.name.charAt(0)}
                                  </span>
                                </div>
                                <span>{task.assigned_user.name}</span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                          className="btn-primary"
                        >
                          Start Task
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="in_progress" className="space-y-4">
                {filteredTasks.filter(task => task.status === 'in_progress').map((task) => (
                  <Card key={task.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(task.status)}
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{task.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            {task.assigned_user && (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">
                                    {task.assigned_user.name.charAt(0)}
                                  </span>
                                </div>
                                <span>{task.assigned_user.name}</span>
                              </div>
                            )}
                            {task.actual_hours && task.estimated_hours && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{task.actual_hours}/{task.estimated_hours}h</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          className="btn-primary"
                        >
                          Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {filteredTasks.filter(task => task.status === 'completed').map((task) => (
                  <Card key={task.id} className="glass-card hover:glass-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(task.status)}
                            <h3 className="font-semibold text-lg line-through opacity-75">{task.title}</h3>
                            <Badge className="bg-green-500/20 text-green-400">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4 opacity-75">{task.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            {task.assigned_user && (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">
                                    {task.assigned_user.name.charAt(0)}
                                  </span>
                                </div>
                                <span>{task.assigned_user.name}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Completed {new Date(task.updated_at).toLocaleDateString()}</span>
                            </div>
                            {task.actual_hours && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{task.actual_hours}h total</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTaskStatus(task.id, 'todo')}
                          className="glass"
                        >
                          Reopen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}