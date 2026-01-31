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
  RefreshCw, Zap, Globe, Building, Radio, ChevronRight, ArrowUpRight, Crown, Star, User,
  Megaphone, MapPin, Image, ExternalLink, Award, Camera
} from 'lucide-react'

// Animated Stats Card Component
function AnimatedStatCard({ icon: Icon, title, value, change, changeType, color, subtitle }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-900 group overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <CardContent className="p-3 sm:p-6 relative">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
            <p className="mt-1 sm:mt-2 text-lg sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
            {subtitle && <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 truncate">{subtitle}</p>}
            {change && (
              <div className={`mt-1 sm:mt-2 hidden sm:flex items-center gap-1 text-xs sm:text-sm ${changeType === 'positive' ? 'text-emerald-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-500'}`}>
                {changeType === 'positive' ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />}
                <span className="truncate">{change}</span>
              </div>
            )}
          </div>
          <div className={`flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg flex-shrink-0 ml-2`}>
            <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
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
  const [founders, setFounders] = useState([])
  const [choirMembers, setChoirMembers] = useState([])
  const [historyEvents, setHistoryEvents] = useState([])
  const [newsEvents, setNewsEvents] = useState([])
  const [awards, setAwards] = useState([])
  const [galleryItems, setGalleryItems] = useState([])
  const [siteSettings, setSiteSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createMusicDialogOpen, setCreateMusicDialogOpen] = useState(false)
  const [createFounderDialogOpen, setCreateFounderDialogOpen] = useState(false)
  const [createMemberDialogOpen, setCreateMemberDialogOpen] = useState(false)
  const [createHistoryDialogOpen, setCreateHistoryDialogOpen] = useState(false)
  const [createNewsDialogOpen, setCreateNewsDialogOpen] = useState(false)
  const [createAwardDialogOpen, setCreateAwardDialogOpen] = useState(false)
  const [createGalleryDialogOpen, setCreateGalleryDialogOpen] = useState(false)
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false)
  const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    if (status === 'loading') return // Wait for session to load
    
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }
    
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      toast.error('Access denied. Admin only.')
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, musicRes, usersRes, settingsRes, foundersRes, membersRes, historyRes, newsRes, awardsRes, galleryRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/projects'),
          fetch('/api/music'),
          fetch('/api/admin/users'),
          fetch('/api/settings'),
          fetch('/api/founders'),
          fetch('/api/choir-members'),
          fetch('/api/history'),
          fetch('/api/news'),
          fetch('/api/awards'),
          fetch('/api/gallery')
        ])

        const [statsData, projectsData, musicData, usersData, settingsData, foundersData, membersData, historyData, newsData, awardsData, galleryData] = await Promise.all([
          statsRes.json(),
          projectsRes.json(),
          musicRes.json(),
          usersRes.json(),
          settingsRes.json(),
          foundersRes.json(),
          membersRes.json(),
          historyRes.json(),
          newsRes.json(),
          awardsRes.json(),
          galleryRes.json()
        ])

        setStats(statsData)
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setMusic(Array.isArray(musicData) ? musicData : [])
        setUsers(Array.isArray(usersData) ? usersData : [])
        setSiteSettings(settingsData || {})
        setFounders(Array.isArray(foundersData) ? foundersData : [])
        setChoirMembers(Array.isArray(membersData) ? membersData : [])
        setHistoryEvents(Array.isArray(historyData) ? historyData : [])
        setNewsEvents(Array.isArray(newsData) ? newsData : [])
        setAwards(Array.isArray(awardsData) ? awardsData : [])
        setGalleryItems(Array.isArray(galleryData) ? galleryData : [])
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

  const handleUpdateProject = async (projectId, formData) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updated = await res.json()
        setProjects(projects.map(p => p.id === projectId ? updated : p))
        toast.success('Project updated!')
        return true
      }
    } catch (error) {
      toast.error('Failed to update project')
    }
    return false
  }

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
        toast.success('Project deleted!')
        setDeleteProjectDialogOpen(false)
        setSelectedProject(null)
        return true
      }
    } catch (error) {
      toast.error('Failed to delete project')
    }
    return false
  }

  const openEditProject = (project) => {
    setSelectedProject(project)
    setEditProjectDialogOpen(true)
  }

  const openDeleteProject = (project) => {
    setSelectedProject(project)
    setDeleteProjectDialogOpen(true)
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

  const handleCreateFounder = async (formData) => {
    try {
      const res = await fetch('/api/admin/founders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const founder = await res.json()
        setFounders([...founders, founder])
        toast.success('Founder added!')
        return true
      }
    } catch (error) {
      toast.error('Failed to add founder')
    }
    return false
  }

  const handleDeleteFounder = async (founderId) => {
    if (!confirm('Are you sure you want to delete this founder?')) return
    try {
      const res = await fetch(`/api/admin/founders/${founderId}`, { method: 'DELETE' })
      if (res.ok) {
        setFounders(founders.filter(f => f.id !== founderId))
        toast.success('Founder deleted!')
      }
    } catch (error) {
      toast.error('Failed to delete founder')
    }
  }

  const handleCreateChoirMember = async (formData) => {
    try {
      const res = await fetch('/api/admin/choir-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const member = await res.json()
        setChoirMembers([...choirMembers, member])
        toast.success('Member added!')
        return true
      }
    } catch (error) {
      toast.error('Failed to add member')
    }
    return false
  }

  const handleDeleteChoirMember = async (memberId) => {
    if (!confirm('Are you sure you want to delete this member?')) return
    try {
      const res = await fetch(`/api/admin/choir-members/${memberId}`, { method: 'DELETE' })
      if (res.ok) {
        setChoirMembers(choirMembers.filter(m => m.id !== memberId))
        toast.success('Member deleted!')
      }
    } catch (error) {
      toast.error('Failed to delete member')
    }
  }

  const handleCreateHistory = async (formData) => {
    try {
      const res = await fetch('/api/admin/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const event = await res.json()
        setHistoryEvents([...historyEvents, event].sort((a, b) => a.order - b.order))
        toast.success('History event added!')
        return true
      }
    } catch (error) {
      toast.error('Failed to add history event')
    }
    return false
  }

  const handleUpdateHistory = async (eventId, formData) => {
    try {
      const res = await fetch(`/api/admin/history/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updated = await res.json()
        setHistoryEvents(historyEvents.map(e => e.id === eventId ? updated : e).sort((a, b) => a.order - b.order))
        toast.success('History event updated!')
        return true
      }
    } catch (error) {
      toast.error('Failed to update history event')
    }
    return false
  }

  const handleDeleteHistory = async (eventId) => {
    if (!confirm('Are you sure you want to delete this history event?')) return
    try {
      const res = await fetch(`/api/admin/history/${eventId}`, { method: 'DELETE' })
      if (res.ok) {
        setHistoryEvents(historyEvents.filter(e => e.id !== eventId))
        toast.success('History event deleted!')
      }
    } catch (error) {
      toast.error('Failed to delete history event')
    }
  }

  const handleCreateNews = async (formData) => {
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const news = await res.json()
        setNewsEvents([news, ...newsEvents])
        toast.success('News item created!')
        return true
      }
    } catch (error) {
      toast.error('Failed to create news')
    }
    return false
  }

  const handleDeleteNews = async (newsId) => {
    if (!confirm('Are you sure you want to delete this news item?')) return
    try {
      const res = await fetch(`/api/admin/news/${newsId}`, { method: 'DELETE' })
      if (res.ok) {
        setNewsEvents(newsEvents.filter(n => n.id !== newsId))
        toast.success('News item deleted!')
      }
    } catch (error) {
      toast.error('Failed to delete news')
    }
  }

  const handleToggleNewsPublish = async (newsItem) => {
    try {
      const res = await fetch(`/api/admin/news/${newsItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newsItem, isPublished: !newsItem.isPublished })
      })
      if (res.ok) {
        const updated = await res.json()
        setNewsEvents(newsEvents.map(n => n.id === newsItem.id ? updated : n))
        toast.success(updated.isPublished ? 'Published!' : 'Unpublished!')
      }
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  // ==================== AWARDS HANDLERS ====================
  const handleCreateAward = async (formData) => {
    try {
      const res = await fetch('/api/admin/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const award = await res.json()
        setAwards([...awards, award].sort((a, b) => b.year - a.year))
        toast.success('Award added!')
        return true
      }
    } catch (error) {
      toast.error('Failed to add award')
    }
    return false
  }

  const handleDeleteAward = async (awardId) => {
    if (!confirm('Are you sure you want to delete this award?')) return
    try {
      const res = await fetch(`/api/admin/awards/${awardId}`, { method: 'DELETE' })
      if (res.ok) {
        setAwards(awards.filter(a => a.id !== awardId))
        toast.success('Award deleted!')
      }
    } catch (error) {
      toast.error('Failed to delete award')
    }
  }

  // ==================== GALLERY HANDLERS ====================
  const handleCreateGalleryItem = async (formData) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const item = await res.json()
        setGalleryItems([...galleryItems, item].sort((a, b) => b.year - a.year))
        toast.success('Gallery item added!')
        return true
      }
    } catch (error) {
      toast.error('Failed to add gallery item')
    }
    return false
  }

  const handleDeleteGalleryItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return
    try {
      const res = await fetch(`/api/admin/gallery/${itemId}`, { method: 'DELETE' })
      if (res.ok) {
        setGalleryItems(galleryItems.filter(i => i.id !== itemId))
        toast.success('Gallery item deleted!')
      }
    } catch (error) {
      toast.error('Failed to delete gallery item')
    }
  }

  const handleToggleGalleryFeatured = async (item) => {
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isFeatured: !item.isFeatured })
      })
      if (res.ok) {
        const updated = await res.json()
        setGalleryItems(galleryItems.map(i => i.id === item.id ? updated : i))
        toast.success(updated.isFeatured ? 'Marked as featured!' : 'Removed from featured!')
      }
    } catch (error) {
      toast.error('Failed to update')
    }
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

  if (status === 'unauthenticated') {
    router.push('/admin/login')
    return null
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/admin/login')
    return null
  }

  const totalRevenue = (stats?.donations?.total || 0) + (stats?.purchases?.total || 0)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'}`}>
      {/* Premium Admin Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900 dark:text-white">G2 Melody</span>
              <Badge className="ml-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs">
                <Crown className="h-3 w-3 mr-1" />Admin
              </Badge>
            </div>
            <Badge className="sm:hidden bg-orange-100 text-orange-700 text-xs">
              Admin
            </Badge>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                <ExternalLink className="h-4 w-4" /> Visit Website
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" 
              onClick={async () => {
                await signOut({ redirect: false })
                window.location.href = '/admin/login'
              }}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="sm:hidden h-8 w-8 text-red-600" 
              onClick={async () => {
                await signOut({ redirect: false })
                window.location.href = '/admin/login'
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Admin Welcome */}
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Welcome back, {session.user.name?.split(' ')[0]}.</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
            <TabsList className="inline-flex h-10 sm:h-12 items-center justify-start sm:justify-center rounded-xl bg-gray-100 p-1 sm:p-1.5 dark:bg-gray-800 min-w-max">
              <TabsTrigger value="overview" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <BarChart3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Overview</span><span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <Target className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Projects
              </TabsTrigger>
              <TabsTrigger value="music" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <Music className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Music
              </TabsTrigger>
              <TabsTrigger value="news" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <Megaphone className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> News
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <Users className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Settings</span><span className="sm:hidden">Set</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> About
              </TabsTrigger>
              <TabsTrigger value="awards" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <Award className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Awards
              </TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-lg px-3 sm:px-5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
                <Camera className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Gallery
              </TabsTrigger>
            </TabsList>
          </div>

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
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onEdit={openEditProject}
                      onDelete={openDeleteProject}
                    />
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

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-amber-500" />
                    News & Events
                  </CardTitle>
                  <CardDescription>Manage news articles, announcements, and events ({newsEvents.length} total)</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 gap-2" onClick={() => setCreateNewsDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Create New
                </Button>
              </CardHeader>
              <CardContent>
                {newsEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No news or events yet</p>
                    <p className="text-sm mt-1">Create your first news article or event announcement</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {newsEvents.map((news) => (
                      <div key={news.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        {news.image ? (
                          <img src={news.image} alt={news.title} className="w-24 h-16 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-24 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            {news.type === 'event' ? <Calendar className="h-6 w-6 text-gray-400" /> : 
                             news.type === 'announcement' ? <Megaphone className="h-6 w-6 text-gray-400" /> :
                             <FileText className="h-6 w-6 text-gray-400" />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${
                              news.type === 'event' ? 'bg-blue-100 text-blue-700' :
                              news.type === 'announcement' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {news.type}
                            </Badge>
                            {news.isFeatured && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">Featured</Badge>
                            )}
                            <Badge className={`text-xs ${news.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {news.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{news.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{news.summary}</p>
                          {news.eventDate && (
                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(news.eventDate).toLocaleDateString()} {news.eventTime && `at ${news.eventTime}`}
                              {news.eventLocation && (
                                <span className="flex items-center gap-1 ml-2">
                                  <MapPin className="h-3 w-3" /> {news.eventLocation}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className={news.isPublished ? 'text-amber-600' : 'text-green-600'}
                            onClick={() => handleToggleNewsPublish(news)}
                          >
                            {news.isPublished ? <Eye className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteNews(news.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

          {/* About Page Management Tab */}
          <TabsContent value="about" className="space-y-6">
            {/* Founders Management */}
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Founders Management
                  </CardTitle>
                  <CardDescription>Manage the visionaries displayed on the About page</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 gap-2" onClick={() => setCreateFounderDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Founder
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {founders.map((founder) => (
                    <div key={founder.id} className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        {founder.image ? (
                          <img src={founder.image} alt={founder.name} className="h-16 w-16 rounded-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{founder.name}</h4>
                        <p className="text-sm text-amber-600">{founder.role}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{founder.bio}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteFounder(founder.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {founders.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-gray-500">No founders added yet</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Choir Members Management */}
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Choir Members
                  </CardTitle>
                  <CardDescription>Manage members displayed on the About page ({choirMembers.length} total)</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 gap-2" onClick={() => setCreateMemberDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Vocal Part</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Year Joined</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Founding</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {choirMembers.map((member) => (
                        <tr key={member.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{member.name}</p>
                                {member.role && <p className="text-xs text-amber-600">{member.role}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={`text-xs ${
                              member.vocalPart === 'SOPRANO' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                              member.vocalPart === 'ALTO' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              member.vocalPart === 'TENOR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              member.vocalPart === 'BASS' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              {member.vocalPart === 'NONE' ? 'N/A' : member.vocalPart}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge className={`text-xs ${
                              member.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                              member.status === 'ALUMNI' ? 'bg-blue-100 text-blue-700' :
                              member.status === 'THEOSORTIAN' ? 'bg-amber-100 text-amber-700' :
                              member.status === 'SPONSOR' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-600">{member.yearJoined || '-'}</td>
                          <td className="py-3 px-2">
                            {member.isFounding && <Badge className="bg-amber-500 text-white text-xs">Founding</Badge>}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => handleDeleteChoirMember(member.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {choirMembers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No choir members added yet</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* History Timeline Management */}
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    History Timeline
                  </CardTitle>
                  <CardDescription>Manage the "Our History" timeline on the About page ({historyEvents.length} events)</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 gap-2" onClick={() => setCreateHistoryDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Event
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historyEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No history events added yet</p>
                      <p className="text-sm mt-1">Add timeline events to tell the G2 Melody story</p>
                    </div>
                  ) : (
                    historyEvents.map((event, index) => (
                      <div 
                        key={event.id} 
                        className={`flex gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${
                          event.colorVariant === 'amber' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800' :
                          event.colorVariant === 'orange' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800' :
                          event.colorVariant === 'rose' ? 'border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800' :
                          'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            event.colorVariant === 'amber' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                            event.colorVariant === 'orange' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                            event.colorVariant === 'rose' ? 'bg-gradient-to-br from-rose-500 to-pink-500' :
                            'bg-gradient-to-br from-gray-500 to-gray-600'
                          }`}>
                            #{index + 1}
                          </div>
                          <span className="mt-2 text-sm font-semibold text-gray-600">{event.year}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant="outline" className={`text-xs ${
                                event.colorVariant === 'amber' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                                event.colorVariant === 'orange' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                event.colorVariant === 'rose' ? 'bg-rose-100 text-rose-700 border-rose-300' :
                                'bg-gray-100 text-gray-700 border-gray-300'
                              }`}>
                                {event.colorVariant}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 hover:text-red-700 h-8 w-8 p-0" 
                                onClick={() => handleDeleteHistory(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Awards Tab */}
          <TabsContent value="awards" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Awards & Recognition
                  </CardTitle>
                  <CardDescription>Manage awards and achievements ({awards.length} total)</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 gap-2" onClick={() => setCreateAwardDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Award
                </Button>
              </CardHeader>
              <CardContent>
                {awards.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No awards yet</p>
                    <p className="text-sm mt-1">Add your choir's achievements and recognitions</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {awards.map((award) => (
                      <div key={award.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                          {award.image ? (
                            <img src={award.image} alt={award.title} className="w-full h-full object-cover" />
                          ) : (
                            <Award className="h-12 w-12 text-amber-500" />
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className="bg-amber-100 text-amber-700">{award.year}</Badge>
                            {award.category && <Badge variant="outline" className="text-xs">{award.category}</Badge>}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{award.title}</h4>
                          {award.awardingOrganization && (
                            <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                              <Building className="h-3 w-3" /> {award.awardingOrganization}
                            </p>
                          )}
                          {award.description && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{award.description}</p>
                          )}
                          <div className="mt-3 flex justify-end">
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => handleDeleteAward(award.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-500" />
                    Photo Gallery
                  </CardTitle>
                  <CardDescription>Manage gallery photos ({galleryItems.length} total)</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 gap-2" onClick={() => setCreateGalleryDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Photo
                </Button>
              </CardHeader>
              <CardContent>
                {galleryItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No gallery items yet</p>
                    <p className="text-sm mt-1">Add photos from concerts, rehearsals, and events</p>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                          <div className="flex items-center gap-1 text-white/70 text-[10px]">
                            <span>{item.year}</span>
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className={`h-7 w-7 p-0 ${item.isFeatured ? 'text-amber-400' : 'text-white/80'} hover:text-amber-400 bg-black/50 hover:bg-black/70`}
                            onClick={() => handleToggleGalleryFeatured(item)}
                          >
                            <Star className={`h-4 w-4 ${item.isFeatured ? 'fill-current' : ''}`} />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/80 hover:text-red-400 bg-black/50 hover:bg-black/70" onClick={() => handleDeleteGalleryItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {item.isFeatured && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5">Featured</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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

      {/* Create Founder Dialog */}
      <CreateFounderDialog
        open={createFounderDialogOpen}
        onOpenChange={setCreateFounderDialogOpen}
        onSubmit={handleCreateFounder}
      />

      {/* Create Choir Member Dialog */}
      <CreateChoirMemberDialog
        open={createMemberDialogOpen}
        onOpenChange={setCreateMemberDialogOpen}
        onSubmit={handleCreateChoirMember}
      />

      {/* Create History Dialog */}
      <CreateHistoryDialog
        open={createHistoryDialogOpen}
        onOpenChange={setCreateHistoryDialogOpen}
        onSubmit={handleCreateHistory}
      />

      {/* Create News Dialog */}
      <CreateNewsDialog
        open={createNewsDialogOpen}
        onOpenChange={setCreateNewsDialogOpen}
        onSubmit={handleCreateNews}
      />

      {/* Create Award Dialog */}
      <CreateAwardDialog
        open={createAwardDialogOpen}
        onOpenChange={setCreateAwardDialogOpen}
        onSubmit={handleCreateAward}
      />

      {/* Create Gallery Dialog */}
      <CreateGalleryDialog
        open={createGalleryDialogOpen}
        onOpenChange={setCreateGalleryDialogOpen}
        onSubmit={handleCreateGalleryItem}
      />

      {/* Edit Project Dialog */}
      <EditProjectDialog
        open={editProjectDialogOpen}
        onOpenChange={setEditProjectDialogOpen}
        project={selectedProject}
        onSubmit={handleUpdateProject}
      />

      {/* Delete Project Confirmation Dialog */}
      <Dialog open={deleteProjectDialogOpen} onOpenChange={setDeleteProjectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteProject(selectedProject?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

// Create Founder Dialog Component
function CreateFounderDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', role: '', bio: '', image: '', order: 0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({ name: '', role: '', bio: '', image: '', order: 0 })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Founder</DialogTitle>
          <DialogDescription>Add a new founder to the About page</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="founderName">Full Name</Label>
            <Input id="founderName" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="founderRole">Role/Title</Label>
            <Input id="founderRole" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g., Co-Founder & Visionary" />
          </div>
          <div>
            <Label htmlFor="founderBio">Biography</Label>
            <Textarea id="founderBio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} placeholder="Brief description about this founder..." />
          </div>
          <div>
            <Label htmlFor="founderImage">Photo URL (optional)</Label>
            <Input id="founderImage" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/photo.jpg" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Founder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create Choir Member Dialog Component
function CreateChoirMemberDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', vocalPart: 'NONE', yearJoined: '', status: 'ACTIVE', role: '', isFounding: false, image: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({ name: '', vocalPart: 'NONE', yearJoined: '', status: 'ACTIVE', role: '', isFounding: false, image: '' })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Choir Member</DialogTitle>
          <DialogDescription>Add a new member to the choir roster</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="memberName">Full Name</Label>
            <Input id="memberName" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vocalPart">Vocal Part</Label>
              <Select value={formData.vocalPart} onValueChange={(value) => setFormData({ ...formData, vocalPart: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOPRANO">Soprano</SelectItem>
                  <SelectItem value="ALTO">Alto</SelectItem>
                  <SelectItem value="TENOR">Tenor</SelectItem>
                  <SelectItem value="BASS">Bass</SelectItem>
                  <SelectItem value="NONE">None/Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="memberStatus">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ALUMNI">Alumni</SelectItem>
                  <SelectItem value="THEOSORTIAN">Theosortian</SelectItem>
                  <SelectItem value="SPONSOR">Sponsor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearJoined">Year Joined</Label>
              <Input id="yearJoined" type="number" value={formData.yearJoined} onChange={(e) => setFormData({ ...formData, yearJoined: e.target.value })} placeholder="2016" />
            </div>
            <div>
              <Label htmlFor="memberRole">Role (optional)</Label>
              <Input id="memberRole" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g., Director, Secretary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="isFounding" checked={formData.isFounding} onCheckedChange={(checked) => setFormData({ ...formData, isFounding: checked })} />
            <Label htmlFor="isFounding">Founding Member</Label>
          </div>
          <div>
            <Label htmlFor="memberImage">Photo URL (optional)</Label>
            <Input id="memberImage" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/photo.jpg" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
// Create History Dialog Component
function CreateHistoryDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    year: '', title: '', description: '', colorVariant: 'amber', order: 0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({ year: '', title: '', description: '', colorVariant: 'amber', order: 0 })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add History Event</DialogTitle>
          <DialogDescription>Add a new event to the G2 Melody timeline on the About page</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="historyYear">Year/Period</Label>
              <Input 
                id="historyYear" 
                value={formData.year} 
                onChange={(e) => setFormData({ ...formData, year: e.target.value })} 
                placeholder="e.g., Late 2016, October 2017"
                required 
              />
            </div>
            <div>
              <Label htmlFor="historyOrder">Display Order</Label>
              <Input 
                id="historyOrder" 
                type="number"
                value={formData.order} 
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} 
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="historyTitle">Event Title</Label>
            <Input 
              id="historyTitle" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              placeholder="e.g., The Birth of G2 Melody"
              required 
            />
          </div>
          <div>
            <Label htmlFor="historyDesc">Description</Label>
            <Textarea 
              id="historyDesc" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              rows={4} 
              placeholder="Describe what happened during this period..."
              required 
            />
          </div>
          <div>
            <Label htmlFor="colorVariant">Color Theme</Label>
            <Select value={formData.colorVariant} onValueChange={(value) => setFormData({ ...formData, colorVariant: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amber">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500"></div>
                    Amber/Orange (Primary)
                  </div>
                </SelectItem>
                <SelectItem value="orange">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500"></div>
                    Orange/Red (Growth)
                  </div>
                </SelectItem>
                <SelectItem value="rose">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-pink-500"></div>
                    Rose/Pink (Milestone)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Choose a color theme for this timeline event</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create News Dialog Component
function CreateNewsDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '', summary: '', content: '', image: '', type: 'news',
    eventDate: '', eventTime: '', eventLocation: '', isFeatured: false, isPublished: true, author: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({
        title: '', summary: '', content: '', image: '', type: 'news',
        eventDate: '', eventTime: '', eventLocation: '', isFeatured: false, isPublished: true, author: ''
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create News/Event</DialogTitle>
          <DialogDescription>Add a new article, announcement, or event</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newsType">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">News Article</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newsAuthor">Author</Label>
              <Input 
                id="newsAuthor" 
                value={formData.author} 
                onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
                placeholder="G2 Melody Team"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="newsTitle">Title</Label>
            <Input 
              id="newsTitle" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              placeholder="Enter title..."
              required 
            />
          </div>

          <div>
            <Label htmlFor="newsSummary">Summary</Label>
            <Input 
              id="newsSummary" 
              value={formData.summary} 
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })} 
              placeholder="Brief summary (shown in previews)..."
            />
          </div>

          <div>
            <Label htmlFor="newsContent">Content</Label>
            <Textarea 
              id="newsContent" 
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              rows={4} 
              placeholder="Full article content..."
            />
          </div>

          <div>
            <Label htmlFor="newsImage">Cover Image URL</Label>
            <Input 
              id="newsImage" 
              value={formData.image} 
              onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.type === 'event' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Event Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input 
                    id="eventDate" 
                    type="date"
                    value={formData.eventDate} 
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} 
                  />
                </div>
                <div>
                  <Label htmlFor="eventTime">Event Time</Label>
                  <Input 
                    id="eventTime" 
                    value={formData.eventTime} 
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} 
                    placeholder="e.g., 6:00 PM"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="eventLocation">Location</Label>
                <Input 
                  id="eventLocation" 
                  value={formData.eventLocation} 
                  onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })} 
                  placeholder="e.g., Church of Christ, Buea"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch 
                id="isFeatured" 
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="isPublished" 
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
              />
              <Label htmlFor="isPublished">Publish Immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


// Create Award Dialog
function CreateAwardDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', year: new Date().getFullYear(), image: '',
    awardingOrganization: '', category: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({
        title: '', description: '', year: new Date().getFullYear(), image: '',
        awardingOrganization: '', category: ''
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Award</DialogTitle>
          <DialogDescription>Add a new award or recognition</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="awardTitle">Award Title *</Label>
            <Input 
              id="awardTitle" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              placeholder="e.g., Best Gospel Choir 2024"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="awardYear">Year *</Label>
              <Input 
                id="awardYear" 
                type="number" 
                value={formData.year} 
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} 
                min="2000"
                max="2030"
                required 
              />
            </div>
            <div>
              <Label htmlFor="awardCategory">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Music Excellence">Music Excellence</SelectItem>
                  <SelectItem value="Community Service">Community Service</SelectItem>
                  <SelectItem value="Achievement">Achievement</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Ministry">Ministry</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="awardOrg">Awarding Organization</Label>
            <Input 
              id="awardOrg" 
              value={formData.awardingOrganization} 
              onChange={(e) => setFormData({ ...formData, awardingOrganization: e.target.value })} 
              placeholder="e.g., Cameroon Gospel Music Association"
            />
          </div>

          <div>
            <Label htmlFor="awardDesc">Description</Label>
            <Textarea 
              id="awardDesc" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              rows={3} 
              placeholder="Details about the award..."
            />
          </div>

          <div>
            <Label htmlFor="awardImage">Image URL</Label>
            <Input 
              id="awardImage" 
              value={formData.image} 
              onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
              placeholder="https://example.com/award.jpg"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Award
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create Gallery Item Dialog
function CreateGalleryDialog({ open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', imageUrl: '', year: new Date().getFullYear(),
    category: '', eventName: '', isFeatured: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    if (success) {
      onOpenChange(false)
      setFormData({
        title: '', description: '', imageUrl: '', year: new Date().getFullYear(),
        category: '', eventName: '', isFeatured: false
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Gallery Photo</DialogTitle>
          <DialogDescription>Add a new photo to the gallery</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="galleryTitle">Photo Title *</Label>
            <Input 
              id="galleryTitle" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              placeholder="e.g., Concert at Buea Town Hall"
              required 
            />
          </div>

          <div>
            <Label htmlFor="galleryImage">Image URL *</Label>
            <Input 
              id="galleryImage" 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
              placeholder="https://example.com/photo.jpg"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="galleryYear">Year *</Label>
              <Input 
                id="galleryYear" 
                type="number" 
                value={formData.year} 
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} 
                min="2016"
                max="2030"
                required 
              />
            </div>
            <div>
              <Label htmlFor="galleryCategory">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concerts">Concerts</SelectItem>
                  <SelectItem value="Rehearsals">Rehearsals</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Fellowship">Fellowship</SelectItem>
                  <SelectItem value="Behind the Scenes">Behind the Scenes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="galleryEvent">Event Name (optional)</Label>
            <Input 
              id="galleryEvent" 
              value={formData.eventName} 
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} 
              placeholder="e.g., Christmas Concert 2023"
            />
          </div>

          <div>
            <Label htmlFor="galleryDesc">Description (optional)</Label>
            <Textarea 
              id="galleryDesc" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              rows={2} 
              placeholder="Brief description of the photo..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch 
              id="galleryFeatured" 
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
            />
            <Label htmlFor="galleryFeatured">Mark as Featured</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-500">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Photo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
