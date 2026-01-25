'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Music, Heart, Users, Home, BookOpen, Bell, Settings,
  Play, Pause, Trophy, Target, Calendar, Clock, Star, TrendingUp,
  Headphones, Mic2, Award, ChevronRight, Gift, DollarSign, BarChart3,
  Volume2, CheckCircle2, Circle, Flame, Zap, GraduationCap, LogOut, Loader2,
  Search, Filter, ExternalLink, User, MessageSquare, Megaphone, ArrowLeft,
  ChevronDown, Lock, Unlock, Video, FileText, Download, Share2
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('overview')
  const [activeTab, setActiveTab] = useState('overview')
  const [playingTrack, setPlayingTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVocalPart, setFilterVocalPart] = useState('all')

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    progress: {
      overallProgress: 0,
      totalLessons: 0,
      completedLessons: 0,
      practiceHours: 0,
      currentStreak: 0,
      nextMilestone: 'Complete 10 lessons'
    },
    courses: [],
    practiceTracks: [],
    achievements: [],
    notifications: [],
    schedule: [],
    stats: { currentStreak: 0, totalPracticeMinutes: 0, vocalPart: 'NONE' }
  })

  const [supporterData, setSupporterData] = useState({
    stats: { totalDonations: 0, donationCount: 0, studentsSupported: 0, badgesEarned: 0 },
    donations: [],
    leaderboard: [],
    impact: { learnersSupported: 0, lessonsEnabled: 0, songsRecorded: 0 }
  })

  // All available courses (for browsing)
  const [allCourses, setAllCourses] = useState([])
  const [allAchievements, setAllAchievements] = useState([])
  const [announcements, setAnnouncements] = useState([])

  // Fetch learner dashboard data
  const fetchLearnerData = async (userId) => {
    try {
      const response = await fetch(`/api/dashboard/learner?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      console.error('Error fetching learner data:', err)
    }
  }

  // Fetch supporter dashboard data
  const fetchSupporterData = async (userId) => {
    try {
      const response = await fetch(`/api/dashboard/supporter?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch supporter data')
      const data = await response.json()
      setSupporterData(data)
    } catch (err) {
      console.error('Error fetching supporter data:', err)
    }
  }

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const response = await fetch('/api/courses?published=true')
      if (response.ok) {
        const data = await response.json()
        setAllCourses(data)
      }
    } catch (err) {
      console.error('Error fetching courses:', err)
    }
  }

  // Fetch all achievements
  const fetchAllAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      if (response.ok) {
        const data = await response.json()
        setAllAchievements(data)
      }
    } catch (err) {
      console.error('Error fetching achievements:', err)
    }
  }

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    if (!session?.user?.id) return
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, courseId })
      })
      if (response.ok) {
        toast.success('Successfully enrolled in course!')
        fetchLearnerData(session.user.id)
        fetchAllCourses()
      }
    } catch (err) {
      toast.error('Failed to enroll in course')
    }
  }

  // Log practice session
  const logPractice = async (trackId, duration) => {
    if (!session?.user?.id) return
    try {
      await fetch('/api/practice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, trackId, duration })
      })
      fetchLearnerData(session.user.id)
    } catch (err) {
      console.error('Error logging practice:', err)
    }
  }

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' })
      fetchLearnerData(session.user.id)
    } catch (err) {
      console.error('Error marking notification:', err)
    }
  }

  // Mark all notifications as read
  const markAllNotificationsRead = async () => {
    if (!session?.user?.id) return
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      })
      fetchLearnerData(session.user.id)
    } catch (err) {
      console.error('Error marking all notifications:', err)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.id) {
      setLoading(true)
      Promise.all([
        fetchLearnerData(session.user.id),
        fetchSupporterData(session.user.id),
        fetchAllCourses(),
        fetchAllAchievements()
      ]).finally(() => setLoading(false))
    }
  }, [status, session, router])

  function DashboardSkeleton() {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!session) return null

  const userName = session.user?.name || 'Learner'
  const userEmail = session.user?.email || ''
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  // Destructure dashboard data
  const { progress, courses: enrolledCourses, practiceTracks, achievements: userAchievements, notifications, schedule, stats } = dashboardData

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'long' })
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const vocalPartLabels = {
    SOPRANO: 'Soprano',
    ALTO: 'Alto',
    TENOR: 'Tenor',
    BASS: 'Bass',
    NONE: 'Not Set'
  }

  // Filter practice tracks
  const filteredTracks = practiceTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterVocalPart === 'all' || track.vocalPart === filterVocalPart
    return matchesSearch && matchesFilter
  })

  // Get unenrolled courses
  const enrolledCourseIds = enrolledCourses.map(c => c.id)
  const availableCourses = allCourses.filter(c => !enrolledCourseIds.includes(c.id))

  // Navigation items for sidebar
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: GraduationCap },
    { id: 'browse', label: 'Browse Courses', icon: Search },
    { id: 'practice', label: 'Practice', icon: Headphones },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'support', label: 'Support & Donate', icon: Heart },
    { id: 'community', label: 'Community', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <img src="/logo.png" alt="G2 Melody" className="h-10 w-auto" />
          <span className="ml-3 text-xl font-bold text-gray-900">G2 Melody</span>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user?.image} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <Flame className="w-3 h-3" />
                <span>{progress.currentStreak} day streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === item.id
                ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full justify-start gap-2 text-gray-600">
              <ExternalLink className="w-4 h-4" /> Visit Website
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header (Mobile) */}
        <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="G2 Melody" className="h-8 w-auto" />
              <span className="font-bold text-gray-900 text-sm">G2 Melody</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center gap-1.5 bg-amber-50 rounded-full px-2 py-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-700">{progress.currentStreak}</span>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Mobile Navigation - Scrollable Tabs */}
          <div className="flex overflow-x-auto px-2 py-2 gap-1.5 border-t border-gray-100 scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeSection === item.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-40 bg-white border-b border-gray-200 h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">{progress.currentStreak} Day Streak</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  {/* Welcome */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                    <h2 className="text-2xl font-bold">Welcome back, {userName.split(' ')[0]}! 👋</h2>
                    <p className="text-white/80 mt-1">Continue your musical journey with G2 Melody</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="bg-white/20 rounded-lg px-4 py-2">
                        <p className="text-sm text-white/80">Overall Progress</p>
                        <p className="text-2xl font-bold">{progress.overallProgress}%</p>
                      </div>
                      <div className="bg-white/20 rounded-lg px-4 py-2">
                        <p className="text-sm text-white/80">Lessons Completed</p>
                        <p className="text-2xl font-bold">{progress.completedLessons}/{progress.totalLessons}</p>
                      </div>
                      <div className="bg-white/20 rounded-lg px-4 py-2">
                        <p className="text-sm text-white/80">Practice Hours</p>
                        <p className="text-2xl font-bold">{progress.practiceHours}h</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
                            <p className="text-xs text-gray-500">Active Courses</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{userAchievements.length}</p>
                            <p className="text-xs text-gray-500">Achievements</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                            <Headphones className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{practiceTracks.length}</p>
                            <p className="text-xs text-gray-500">Practice Tracks</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{schedule.length}</p>
                            <p className="text-xs text-gray-500">Upcoming Events</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Continue Learning & Schedule */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle>Continue Learning</CardTitle>
                            <CardDescription>Pick up where you left off</CardDescription>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setActiveSection('courses')}>
                            View All
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {enrolledCourses.length === 0 ? (
                            <div className="text-center py-8">
                              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-gray-500">No courses enrolled yet</p>
                              <Button className="mt-4 bg-amber-500 hover:bg-amber-600" onClick={() => setActiveSection('browse')}>
                                Browse Courses
                              </Button>
                            </div>
                          ) : (
                            enrolledCourses.slice(0, 3).map((course) => (
                              <div
                                key={course.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => {
                                  setSelectedCourse(course)
                                  setActiveSection('courses')
                                }}
                              >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl">
                                  {course.emoji || '🎵'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900">{course.title}</h4>
                                  <p className="text-sm text-gray-500">{course.completedLessons || 0} of {course.totalLessons} lessons</p>
                                  <Progress value={course.progress || 0} className="mt-2 h-2" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Card className="border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                            Upcoming
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {schedule.length === 0 ? (
                            <p className="text-gray-500 text-center py-4 text-sm">No upcoming events</p>
                          ) : (
                            schedule.slice(0, 4).map((item) => (
                              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'rehearsal' ? 'bg-blue-500' :
                                  item.type === 'lesson' ? 'bg-amber-500' : 'bg-rose-500'
                                  }`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                                  <p className="text-xs text-gray-500">{formatDate(item.date)} • {item.time}</p>
                                </div>
                              </div>
                            ))
                          )}
                          <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveSection('schedule')}>
                            View Full Schedule
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Notifications */}
                      <Card className="border-0 shadow-md mt-4">
                        <CardHeader className="flex flex-row items-center justify-between py-3">
                          <CardTitle className="text-base flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-amber-500" />
                            Notifications
                          </CardTitle>
                          {notifications.filter(n => !n.isRead).length > 0 && (
                            <Button variant="ghost" size="sm" className="text-xs" onClick={markAllNotificationsRead}>
                              Mark all read
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {notifications.length === 0 ? (
                            <p className="text-gray-500 text-center py-4 text-sm">No notifications</p>
                          ) : (
                            notifications.slice(0, 3).map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-3 rounded-lg cursor-pointer ${!notif.isRead ? 'bg-amber-50' : 'bg-gray-50'}`}
                                onClick={() => !notif.isRead && markNotificationRead(notif.id)}
                              >
                                <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{notif.message}</p>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* My Courses Section */}
              {activeSection === 'courses' && (
                <div className="space-y-6">
                  {selectedCourse ? (
                    // Course Detail View
                    <div>
                      <Button variant="ghost" className="mb-4" onClick={() => setSelectedCourse(null)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
                      </Button>
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-4xl">
                              {selectedCourse.emoji || '🎵'}
                            </div>
                            <div>
                              <CardTitle className="text-2xl text-white">{selectedCourse.title}</CardTitle>
                              <CardDescription className="text-white/80">
                                {selectedCourse.completedLessons || 0} of {selectedCourse.totalLessons} lessons completed
                              </CardDescription>
                              <Progress value={selectedCourse.progress || 0} className="mt-2 h-2 bg-white/30" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Course Lessons</h3>
                          <div className="space-y-3">
                            {/* Placeholder lessons - in a real app, these would come from the API */}
                            {Array.from({ length: selectedCourse.totalLessons || 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${i < (selectedCourse.completedLessons || 0)
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200 hover:border-amber-300'
                                  }`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i < (selectedCourse.completedLessons || 0)
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-500'
                                  }`}>
                                  {i < (selectedCourse.completedLessons || 0) ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                  ) : (
                                    <span className="font-semibold">{i + 1}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">Lesson {i + 1}</p>
                                  <p className="text-sm text-gray-500">
                                    {i < (selectedCourse.completedLessons || 0) ? 'Completed' : 'Not started'}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant={i < (selectedCourse.completedLessons || 0) ? 'outline' : 'default'}
                                  className={i < (selectedCourse.completedLessons || 0) ? '' : 'bg-amber-500 hover:bg-amber-600'}
                                >
                                  {i < (selectedCourse.completedLessons || 0) ? 'Review' : 'Start'}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    // Courses List View
                    <div>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                        <p className="text-gray-500">Your enrolled courses and progress</p>
                      </div>

                      {enrolledCourses.length === 0 ? (
                        <Card className="border-0 shadow-md">
                          <CardContent className="py-16 text-center">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
                            <p className="text-gray-500 mb-6">Start your musical journey by enrolling in a course</p>
                            <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => setActiveSection('browse')}>
                              Browse Available Courses
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                          {enrolledCourses.map((course) => (
                            <Card
                              key={course.id}
                              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                              onClick={() => setSelectedCourse(course)}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl flex-shrink-0">
                                    {course.emoji || '🎵'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                      {course.completedLessons || 0} of {course.totalLessons} lessons completed
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <Progress value={course.progress || 0} className="h-2 flex-1" />
                                      <span className="text-sm font-semibold text-amber-600">{course.progress || 0}%</span>
                                    </div>
                                  </div>
                                </div>
                                <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600">
                                  <Play className="w-4 h-4 mr-2" /> Continue Learning
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Browse Courses Section */}
              {activeSection === 'browse' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Browse Courses</h2>
                    <p className="text-gray-500">Explore and enroll in new courses</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.map((course) => {
                      const isEnrolled = enrolledCourseIds.includes(course.id)
                      return (
                        <Card key={course.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
                              <span className="text-5xl">{course.emoji || '🎵'}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">{course.level}</Badge>
                              <span className="text-xs text-gray-500">{course.totalLessons} lessons</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>
                            {isEnrolled ? (
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  const enrolled = enrolledCourses.find(c => c.id === course.id)
                                  if (enrolled) {
                                    setSelectedCourse(enrolled)
                                    setActiveSection('courses')
                                  }
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Enrolled - Continue
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => enrollInCourse(course.id)}
                              >
                                <GraduationCap className="w-4 h-4 mr-2" /> Enroll Now
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Practice Section */}
              {activeSection === 'practice' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Practice Tracks</h2>
                      <p className="text-gray-500">Audio tracks for your practice sessions</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search tracks..."
                          className="pl-9 w-48"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={filterVocalPart} onValueChange={setFilterVocalPart}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Parts</SelectItem>
                          <SelectItem value="SOPRANO">Soprano</SelectItem>
                          <SelectItem value="ALTO">Alto</SelectItem>
                          <SelectItem value="TENOR">Tenor</SelectItem>
                          <SelectItem value="BASS">Bass</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Practice Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-md bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                      <CardContent className="p-4">
                        <Volume2 className="w-6 h-6 mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{Math.round(stats.totalPracticeMinutes / 60 * 10) / 10}h</p>
                        <p className="text-sm text-white/80">Total Practice</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <Flame className="w-6 h-6 mb-2 text-amber-500" />
                        <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
                        <p className="text-sm text-gray-500">Day Streak</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <Mic2 className="w-6 h-6 mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-gray-900">{vocalPartLabels[stats.vocalPart]}</p>
                        <p className="text-sm text-gray-500">Your Part</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <Target className="w-6 h-6 mb-2 text-green-500" />
                        <p className="text-2xl font-bold text-gray-900">30 min</p>
                        <p className="text-sm text-gray-500">Daily Goal</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Practice Tracks List */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {filteredTracks.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Headphones className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No tracks found</p>
                          </div>
                        ) : (
                          filteredTracks.map((track) => (
                            <div
                              key={track.id}
                              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${playingTrack === track.id
                                ? 'bg-rose-50 border border-rose-200'
                                : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                              <button
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${playingTrack === track.id
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                                  }`}
                                onClick={() => {
                                  if (playingTrack === track.id) {
                                    setPlayingTrack(null)
                                  } else {
                                    setPlayingTrack(track.id)
                                    setTimeout(() => logPractice(track.id, 5), 5000)
                                  }
                                }}
                              >
                                {playingTrack === track.id ? (
                                  <Pause className="w-5 h-5" />
                                ) : (
                                  <Play className="w-5 h-5 ml-0.5" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900">{track.title}</h4>
                                <p className="text-sm text-gray-500">
                                  {track.duration} • {track.type}
                                  {track.description && ` • ${track.description}`}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {track.vocalPart !== 'NONE' && (
                                  <Badge variant="outline" className={`text-xs ${track.vocalPart === 'SOPRANO' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                                    track.vocalPart === 'ALTO' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                      track.vocalPart === 'TENOR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        track.vocalPart === 'BASS' ? 'bg-green-50 text-green-700 border-green-200' :
                                          ''
                                    }`}>
                                    {vocalPartLabels[track.vocalPart]}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">{track.difficulty}</Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Achievements Section */}
              {activeSection === 'achievements' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                    <p className="text-gray-500">Your badges and milestones</p>
                  </div>

                  {/* Earned Achievements */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                        Earned ({userAchievements.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userAchievements.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No achievements yet. Keep learning!</p>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {userAchievements.map((achievement) => (
                            <div key={achievement.id} className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center">
                              <span className="text-4xl mb-2 block">{achievement.icon}</span>
                              <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* All Achievements */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="w-5 h-5 mr-2 text-gray-400" />
                        All Achievements ({allAchievements.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {allAchievements.map((achievement) => {
                          const isEarned = userAchievements.some(ua => ua.id === achievement.id)
                          return (
                            <div
                              key={achievement.id}
                              className={`p-4 rounded-xl text-center ${isEarned
                                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
                                : 'bg-gray-50 border border-gray-200 opacity-60'
                                }`}
                            >
                              <span className={`text-4xl mb-2 block ${!isEarned ? 'grayscale' : ''}`}>{achievement.icon}</span>
                              <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                              {isEarned && (
                                <Badge className="mt-2 bg-amber-500 text-white text-xs">Earned!</Badge>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Schedule Section */}
              {activeSection === 'schedule' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
                    <p className="text-gray-500">Upcoming events and deadlines</p>
                  </div>

                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      {schedule.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                          <p>Check back later for rehearsals, lessons, and deadlines</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {schedule.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === 'rehearsal' ? 'bg-blue-100 text-blue-600' :
                                item.type === 'lesson' ? 'bg-amber-100 text-amber-600' :
                                  item.type === 'deadline' ? 'bg-rose-100 text-rose-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                {item.type === 'rehearsal' ? <Users className="w-6 h-6" /> :
                                  item.type === 'lesson' ? <BookOpen className="w-6 h-6" /> :
                                    item.type === 'deadline' ? <Clock className="w-6 h-6" /> :
                                      <Calendar className="w-6 h-6" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="text-gray-600">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    {formatDate(item.date)}
                                  </span>
                                  <span className="text-gray-600">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {item.time}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className="capitalize">{item.type}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Support & Donate Section */}
              {activeSection === 'support' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Support & Donate</h2>
                    <p className="text-gray-500">Support the G2 Melody ministry and see your impact</p>
                  </div>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                      <CardContent className="p-4">
                        <DollarSign className="w-6 h-6 mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{formatCurrency(supporterData.stats.totalDonations)}</p>
                        <p className="text-sm text-white/80">Your Contributions</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <Users className="w-6 h-6 mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-gray-900">{supporterData.stats.studentsSupported}</p>
                        <p className="text-sm text-gray-500">Learners Supported</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <BookOpen className="w-6 h-6 mb-2 text-rose-500" />
                        <p className="text-2xl font-bold text-gray-900">{supporterData.impact.lessonsEnabled}</p>
                        <p className="text-sm text-gray-500">Lessons Enabled</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <Award className="w-6 h-6 mb-2 text-amber-500" />
                        <p className="text-2xl font-bold text-gray-900">{supporterData.stats.badgesEarned}</p>
                        <p className="text-sm text-gray-500">Supporter Badges</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Donation CTA */}
                    <Card className="border-0 shadow-md lg:col-span-2">
                      <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                          <Heart className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Make a Difference</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          Your donation helps train musicians, produce recordings, and spread the gospel through music across Cameroon.
                        </p>
                        <Link href="/projects">
                          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                            <Gift className="w-5 h-5 mr-2" /> Donate Now
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-400 mt-4">Opens donation page on main website</p>
                      </CardContent>
                    </Card>

                    {/* Top Supporters */}
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                          Top Supporters
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {supporterData.leaderboard.length === 0 ? (
                          <p className="text-gray-500 text-center py-4 text-sm">Be the first to donate!</p>
                        ) : (
                          supporterData.leaderboard.slice(0, 5).map((supporter) => (
                            <div key={supporter.rank} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${supporter.rank === 1 ? 'bg-amber-500 text-white' :
                                supporter.rank === 2 ? 'bg-gray-400 text-white' :
                                  supporter.rank === 3 ? 'bg-amber-700 text-white' :
                                    'bg-gray-200 text-gray-600'
                                }`}>
                                {supporter.rank}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{supporter.name}</p>
                                <Badge className="text-xs bg-amber-100 text-amber-700">{supporter.badge}</Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Donation History */}
                  {supporterData.donations.length > 0 && (
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle>Your Donation History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {supporterData.donations.map((donation) => (
                            <div key={donation.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                                  <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{donation.project?.title || 'General Donation'}</p>
                                  <p className="text-sm text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <p className="font-bold text-emerald-600">{formatCurrency(donation.amount)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Community Section */}
              {activeSection === 'community' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Community</h2>
                    <p className="text-gray-500">Connect with fellow learners and the G2 Melody family</p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Announcements */}
                    <Card className="border-0 shadow-md lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Megaphone className="w-5 h-5 mr-2 text-amber-500" />
                          Announcements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0">
                                <Megaphone className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Welcome to G2 Melody Learning Platform!</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  We're excited to have you here. Start by enrolling in your first course and joining our practice sessions.
                                </p>
                                <p className="text-xs text-gray-400 mt-2">G2 Melody Team • Just now</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Weekly Online Rehearsal</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Join us every Saturday at 6:00 PM for our online rehearsal session via Zoom.
                                </p>
                                <p className="text-xs text-gray-400 mt-2">Recurring Event</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Community Stats */}
                    <div className="space-y-4">
                      <Card className="border-0 shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Community Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Active Learners</span>
                            <span className="font-bold text-gray-900">150+</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Courses Available</span>
                            <span className="font-bold text-gray-900">{allCourses.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Practice Tracks</span>
                            <span className="font-bold text-gray-900">{practiceTracks.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Achievements</span>
                            <span className="font-bold text-gray-900">{allAchievements.length}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-md bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                        <CardContent className="p-6 text-center">
                          <MessageSquare className="w-10 h-10 mx-auto mb-4 opacity-80" />
                          <h3 className="font-bold mb-2">Need Help?</h3>
                          <p className="text-sm text-gray-300 mb-4">Contact the G2 Melody team</p>
                          <Link href="/contact">
                            <Button variant="secondary" size="sm" className="w-full">
                              Contact Us <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* About G2 Melody */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <img
                          src="https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg"
                          alt="G2 Melody Choir"
                          className="w-full md:w-64 h-48 object-cover rounded-xl"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">About G2 Melody</h3>
                          <p className="text-gray-600 mb-4">
                            G2 Melody is an acapella choir founded in Cameroon, dedicated to spreading the gospel through
                            four-part harmony singing. Our mission is to train musicians and bring the joy of music to communities.
                          </p>
                          <Link href="/about">
                            <Button variant="outline">
                              Learn More About Us <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
