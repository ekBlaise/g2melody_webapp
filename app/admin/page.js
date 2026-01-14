'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
  Music, Heart, LogOut, Home, Users, DollarSign, BarChart3, Plus, Moon, Sun,
  Edit, Trash2, Loader2, Target, TrendingUp, Calendar, CreditCard, Settings,
  Eye, CheckCircle2, Clock, AlertCircle, Activity, PieChart, Shield, Bell,
  FileText, Mic2, BookOpen, Video, Search, Filter, MoreVertical, Download,
  RefreshCw, Zap, Globe, Building, Radio, ChevronRight, ArrowUpRight, Crown
} from 'lucide-react'

// Animated Stats Card Component
function AnimatedStatCard({ icon: Icon, title, value, change, changeType, color, subtitle }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-900 group overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            {change && (
              <div className={`mt-2 flex items-center gap-1 text-sm ${changeType === 'positive' ? 'text-emerald-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-500'}`}>
                {changeType === 'positive' ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Project Card with Progress
function ProjectCard({ project, onEdit, onDelete }) {
  const progress = (project.currentAmount / project.goalAmount) * 100
  const formatCurrency = (amount) => new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  
  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-blue-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800">
      <div className="flex gap-4">
        <img
          src={project.image || 'https://images.pexels.com/photos/444658/pexels-photo-444658.jpeg'}
          alt={project.title}
          className="h-20 w-20 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate pr-2">{project.title}</h4>
            <Badge variant={project.status === 'CURRENT' ? 'default' : project.status === 'DRAFT' ? 'secondary' : 'outline'} className="text-xs">
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>{formatCurrency(project.currentAmount)}</span>
            <span>/</span>
            <span>{formatCurrency(project.goalAmount)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => onEdit?.(project)}>
          <Edit className="h-3 w-3 mr-1" /> Edit
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs text-red-600 hover:text-red-700" onClick={() => onDelete?.(project)}>
          <Trash2 className="h-3 w-3 mr-1" /> Delete
        </Button>
      </div>
    </div>
  )
}

// User Row Component
function UserRow({ user, onRoleChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar className="h-11 w-11 border-2 border-white shadow-md">
          <AvatarImage src={user.image} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
            {user.name?.charAt(0) || user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{user.name || 'No name'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Select defaultValue={user.role} onValueChange={(value) => onRoleChange?.(user.id, value)}>
          <SelectTrigger className="w-32 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Recent Donation Row
function DonationRow({ donation }) {
  const formatCurrency = (amount) => new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
          <Heart className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{donation.donorName || 'Anonymous'}</p>
          <p className="text-xs text-gray-500">{donation.project?.title}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-emerald-600">{formatCurrency(donation.amount)}</p>
        <p className="text-xs text-gray-400">{formatDate(donation.createdAt)}</p>
      </div>
    </div>
  )
}

// Settings Section Component
function SettingsSection({ settings, onUpdate }) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSettings)
      })
      if (res.ok) {
        toast.success('Settings saved successfully!')
        onUpdate?.(localSettings)
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-0 shadow-xl dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-500" />
          Site Settings
        </CardTitle>
        <CardDescription>Configure homepage statistics and display values</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="memberCount">Member Count</Label>
            <Input
              id="memberCount"
              type="number"
              value={localSettings.memberCount || 50}
              onChange={(e) => setLocalSettings({ ...localSettings, memberCount: parseInt(e.target.value) })}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Displayed on homepage hero section</p>
          </div>
          <div>
            <Label htmlFor="studentsCount">Students Trained</Label>
            <Input
              id="studentsCount"
              type="number"
              value={localSettings.studentsCount || 100}
              onChange={(e) => setLocalSettings({ ...localSettings, studentsCount: parseInt(e.target.value) })}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Learn Muzik section statistic</p>
          </div>
          <div>
            <Label htmlFor="programsCount">Programs Offered</Label>
            <Input
              id="programsCount"
              type="number"
              value={localSettings.programsCount || 6}
              onChange={(e) => setLocalSettings({ ...localSettings, programsCount: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="yearsActive">Years Active</Label>
            <Input
              id="yearsActive"
              type="number"
              value={localSettings.yearsActive || 8}
              onChange={(e) => setLocalSettings({ ...localSettings, yearsActive: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="albumDescription">Featured Album Description</Label>
          <Textarea
            id="albumDescription"
            value={localSettings.albumDescription || ''}
            onChange={(e) => setLocalSettings({ ...localSettings, albumDescription: e.target.value })}
            className="mt-1"
            rows={3}
            placeholder="Description for the featured album on the music page"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-500 to-indigo-500">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [music, setMusic] = useState([])
  const [users, setUsers] = useState([])
  const [siteSettings, setSiteSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createMusicDialogOpen, setCreateMusicDialogOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'ADMIN') {
      toast.error('Access denied. Admin only.')
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, musicRes, usersRes, settingsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/projects'),
          fetch('/api/music'),
          fetch('/api/admin/users'),
          fetch('/api/settings')
        ])

        const [statsData, projectsData, musicData, usersData, settingsData] = await Promise.all([
          statsRes.json(),
          projectsRes.json(),
          musicRes.json(),
          usersRes.json(),
          settingsRes.json()
        ])

        setStats(statsData)
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setMusic(Array.isArray(musicData) ? musicData : [])
        setUsers(Array.isArray(usersData) ? usersData : [])
        setSiteSettings(settingsData || {})
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchData()
    }
  }, [session])

  const formatCurrency = (amount) => new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      if (res.ok) {
        toast.success('User role updated!')
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      }
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const handleCreateProject = async (formData) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const project = await res.json()
        setProjects([project, ...projects])
        toast.success('Project created!')
        return true
      }
    } catch (error) {
      toast.error('Failed to create project')
    }
    return false
  }

  const handleCreateMusic = async (formData) => {
    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const track = await res.json()
        setMusic([track, ...music])
        toast.success('Music added!')
        return true
      }
    } catch (error) {
      toast.error('Failed to add music')
    }
    return false
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl shadow-orange-500/30">
            <Shield className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">Loading Admin Console...</h2>
          <p className="mt-2 text-gray-400">Preparing your control center</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') return null

  const totalRevenue = (stats?.donations?.total || 0) + (stats?.purchases?.total || 0)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'}`}>
      {/* Premium Admin Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">G2 Melody</span>
              <Badge className="ml-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <Crown className="h-3 w-3 mr-1" />Admin
              </Badge>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" /> View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {session.user.name}. Here's your platform overview.</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedStatCard
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change="+12% from last month"
            changeType="positive"
            color="from-emerald-500 to-teal-500"
          />
          <AnimatedStatCard
            icon={Heart}
            title="Donations"
            value={formatCurrency(stats?.donations?.total || 0)}
            subtitle={`${stats?.donations?.count || 0} donations`}
            color="from-pink-500 to-rose-500"
          />
          <AnimatedStatCard
            icon={Music}
            title="Music Sales"
            value={formatCurrency(stats?.purchases?.total || 0)}
            subtitle={`${stats?.purchases?.count || 0} purchases`}
            color="from-purple-500 to-indigo-500"
          />
          <AnimatedStatCard
            icon={Users}
            title="Total Users"
            value={(stats?.users || 0) + (stats?.members || 0)}
            subtitle={`${stats?.members || 0} members`}
            color="from-blue-500 to-cyan-500"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800">
            <TabsTrigger value="overview" className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <BarChart3 className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Target className="mr-2 h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="music" className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Music className="mr-2 h-4 w-4" /> Music
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Users className="mr-2 h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <FileText className="mr-2 h-4 w-4" /> About Page
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Donations */}
              <Card className="lg:col-span-2 border-0 shadow-xl dark:bg-gray-900">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Recent Donations
                    </CardTitle>
                    <CardDescription>Latest contributions to your projects</CardDescription>
                  </div>
                  <Link href="/projects">
                    <Button variant="outline" size="sm" className="gap-1">
                      View All <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats?.recentDonations?.length > 0 ? (
                    stats.recentDonations.map((donation) => (
                      <DonationRow key={donation.id} donation={donation} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">No recent donations</div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-xl dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" /> Create New Project
                  </Button>
                  <Button className="w-full justify-start gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600" onClick={() => setCreateMusicDialogOpen(true)}>
                    <Music className="h-4 w-4" /> Add New Music
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Bell className="h-4 w-4" /> Send Announcement
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Download className="h-4 w-4" /> Export Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Project Progress Overview */}
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Project Progress
                </CardTitle>
                <CardDescription>Current fundraising status across all active projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.filter(p => p.status === 'CURRENT').slice(0, 4).map((project) => (
                    <div key={project.id} className="flex items-center gap-4">
                      <div className="w-32 truncate text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                      <Progress value={(project.currentAmount / project.goalAmount) * 100} className="flex-1 h-3" />
                      <div className="w-20 text-right text-sm text-gray-500">{Math.round((project.currentAmount / project.goalAmount) * 100)}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Projects Management</CardTitle>
                  <CardDescription>Create and manage fundraising projects</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 gap-2" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> New Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Music Catalog</CardTitle>
                  <CardDescription>Manage your music collection and sales</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 gap-2" onClick={() => setCreateMusicDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Music
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {music.map((track) => (
                    <div key={track.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
                      <img
                        src={track.coverImage || 'https://images.unsplash.com/photo-1652626627227-acc5ce198876'}
                        alt={track.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{track.title}</p>
                        <p className="text-sm text-gray-500">{track.artist}</p>
                      </div>
                      <p className="font-bold text-purple-600">{formatCurrency(track.price)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <UserRow key={user.id} user={user} onRoleChange={handleRoleChange} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsSection settings={siteSettings} onUpdate={setSiteSettings} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Project Dialog */}
      <CreateProjectDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateProject}
      />

      {/* Create Music Dialog */}
      <CreateMusicDialog 
        open={createMusicDialogOpen} 
        onOpenChange={setCreateMusicDialogOpen}
        onSubmit={handleCreateMusic}
      />
    </div>
  )
}

// Create Project Dialog Component
function CreateProjectDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', goalAmount: '', image: '', status: 'CURRENT', deadline: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({ title: '', description: '', goalAmount: '', image: '', status: 'CURRENT', deadline: '' })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Add a new fundraising project</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalAmount">Goal (XAF)</Label>
              <Input id="goalAmount" type="number" value={formData.goalAmount} onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PAST">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-teal-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create Music Dialog Component
function CreateMusicDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '', artist: 'G2 Melody', album: '', genre: 'Gospel', price: '500', coverImage: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({ title: '', artist: 'G2 Melody', album: '', genre: 'Gospel', price: '500', coverImage: '' })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Music</DialogTitle>
          <DialogDescription>Add a track to the music store</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="musicTitle">Song Title</Label>
            <Input id="musicTitle" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="artist">Artist</Label>
              <Input id="artist" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="album">Album</Label>
              <Input id="album" value={formData.album} onChange={(e) => setFormData({ ...formData, album: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gospel">Gospel</SelectItem>
                  <SelectItem value="Hymn">Hymn</SelectItem>
                  <SelectItem value="African Gospel">African Gospel</SelectItem>
                  <SelectItem value="Contemporary">Contemporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price (XAF)</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input id="coverImage" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} placeholder="https://example.com/cover.jpg" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-500 to-indigo-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Music className="h-4 w-4 mr-2" />}
              Add Music
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
