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
import {
  Music, Heart, Users, Home, BookOpen, MessageCircle, Bell, Settings,
  Play, Pause, Trophy, Target, Calendar, Clock, Star, TrendingUp,
  Headphones, Mic2, Award, ChevronRight, Gift, DollarSign, BarChart3,
  Volume2, CheckCircle2, Circle, Flame, Zap, GraduationCap, LogOut, Loader2
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [playingTrack, setPlayingTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
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

  // Fetch learner dashboard data
  const fetchLearnerData = async (userId) => {
    try {
      const response = await fetch(`/api/dashboard/learner?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      console.error('Error fetching learner data:', err)
      // Keep default state on error
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
        fetchLearnerData(session.user.id)
      }
    } catch (err) {
      console.error('Error enrolling:', err)
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
        fetchSupporterData(session.user.id)
      ]).finally(() => setLoading(false))
    }
  }, [status, session, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const userName = session.user?.name || 'Learner'
  const userEmail = session.user?.email || ''
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  // Destructure dashboard data
  const { progress, courses, practiceTracks, achievements, notifications, schedule, stats } = dashboardData

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="G2 Melody" className="h-10 w-auto" />
              <span className="text-xl font-bold text-gray-900">G2 Melody</span>
            </Link>

            {/* Main Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium text-sm flex items-center">
                <Home className="w-4 h-4 mr-2" /> Home
              </Link>
              <Link href="/learn" className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium text-sm flex items-center">
                <BookOpen className="w-4 h-4 mr-2" /> Lessons
              </Link>
              <Link href="/music" className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium text-sm flex items-center">
                <Music className="w-4 h-4 mr-2" /> Resources
              </Link>
              <Link href="/news" className="px-4 py-4 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" /> Community
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session.user?.image} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Learner</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName.split(' ')[0]}! 👋</h1>
              <p className="text-gray-600 mt-1">Continue your musical journey with G2 Melody</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-amber-50 rounded-full px-4 py-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">{progress.currentStreak} Day Streak!</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1 h-auto">
            <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="learning" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <GraduationCap className="w-4 h-4 mr-2" /> Learning
            </TabsTrigger>
            <TabsTrigger value="practice" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Headphones className="w-4 h-4 mr-2" /> Practice
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" /> Support
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold">{progress.overallProgress}%</span>
                  </div>
                  <p className="text-white/90 font-medium">Overall Progress</p>
                  <Progress value={progress.overallProgress} className="mt-2 h-2 bg-white/30" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{progress.completedLessons}/{progress.totalLessons}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Lessons Completed</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-rose-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{progress.practiceHours}h</span>
                  </div>
                  <p className="text-gray-600 font-medium">Practice Hours</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{achievements.length}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Achievements</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active Courses */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Active Courses</CardTitle>
                      <CardDescription>Continue where you left off</CardDescription>
                    </div>
                    <Link href="/learn">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No courses enrolled yet</p>
                        <Button className="mt-4 bg-amber-500 hover:bg-amber-600" onClick={() => setActiveTab('learning')}>
                          Browse Courses
                        </Button>
                      </div>
                    ) : (
                      courses.map((course) => (
                        <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl">
                            {course.emoji || '🎵'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{course.title}</h4>
                            <p className="text-sm text-gray-500">{course.completedLessons || 0} of {course.totalLessons} lessons</p>
                            <Progress value={course.progress || 0} className="mt-2 h-2" />
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-amber-600">{course.progress || 0}%</span>
                            <ChevronRight className="w-5 h-5 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Schedule */}
              <div>
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                      Upcoming Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {schedule.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No upcoming events</p>
                    ) : (
                      schedule.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            item.type === 'rehearsal' ? 'bg-blue-500' :
                            item.type === 'lesson' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">{formatDate(item.date)} • {item.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full mt-2">
                      <Calendar className="w-4 h-4 mr-2" /> View Full Schedule
                    </Button>
                  </CardContent>
                </Card>

                {/* Next Milestone */}
                <Card className="border-0 shadow-md mt-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Next Milestone</p>
                        <p className="font-semibold">{progress.nextMilestone}</p>
                      </div>
                    </div>
                    <Progress value={Math.min((progress.completedLessons / 10) * 100, 100)} className="h-2 bg-gray-700" />
                    <p className="text-xs text-gray-400 mt-2">
                      {10 - progress.completedLessons > 0 
                        ? `${10 - progress.completedLessons} more lessons to go!` 
                        : 'Milestone complete!'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Notifications */}
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-amber-500" />
                  Notifications
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>Mark all as read</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer ${!notif.isRead ? 'bg-amber-50' : 'bg-gray-50'}`}
                        onClick={() => !notif.isRead && markNotificationRead(notif.id)}
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notif.isRead ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{notif.title}</p>
                          <p className="text-sm text-gray-500">{notif.message}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Continue Learning */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start your first course to begin learning!</p>
                      </div>
                    ) : (
                      courses.map((course) => (
                        <div key={course.id} className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl">
                              {course.emoji || '🎵'}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{course.title}</h4>
                              <p className="text-sm text-gray-500 mb-2">{course.completedLessons || 0} of {course.totalLessons} lessons completed</p>
                              <Progress value={course.progress || 0} className="h-2" />
                            </div>
                            <Button className="bg-amber-500 hover:bg-amber-600">
                              <Play className="w-4 h-4 mr-2" /> Continue
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Available Courses to Enroll */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-amber-500" />
                      Available Courses
                    </CardTitle>
                    <CardDescription>Enroll in new courses to expand your skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailableCourses 
                      enrolledCourseIds={courses.map(c => c.id)} 
                      onEnroll={enrollInCourse} 
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Learning Stats Sidebar */}
              <div className="space-y-6">
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-6">
                    <Mic2 className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-lg font-bold mb-2">Your Vocal Part</h3>
                    <p className="text-3xl font-bold mb-1">{vocalPartLabels[stats.vocalPart] || 'Not Set'}</p>
                    <p className="text-sm text-white/80">
                      {stats.vocalPart !== 'NONE' 
                        ? `Focus on ${stats.vocalPart.toLowerCase()} exercises` 
                        : 'Set your vocal part in settings'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Complete lessons to earn achievements!</p>
                    ) : (
                      achievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{achievement.name}</p>
                            <p className="text-xs text-gray-500">{achievement.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Headphones className="w-5 h-5 mr-2 text-rose-500" />
                      Practice Tracks
                    </CardTitle>
                    <CardDescription>Audio tracks for your practice sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {practiceTracks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No practice tracks available</p>
                      ) : (
                        practiceTracks.map((track) => (
                          <div key={track.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                            playingTrack === track.id ? 'bg-rose-50 border border-rose-200' : 'bg-gray-50 hover:bg-gray-100'
                          }`}>
                            <button
                              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                playingTrack === track.id 
                                  ? 'bg-rose-500 text-white' 
                                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                              }`}
                              onClick={() => {
                                if (playingTrack === track.id) {
                                  setPlayingTrack(null)
                                } else {
                                  setPlayingTrack(track.id)
                                  // Log 5 minutes of practice when playing a track
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
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{track.title}</h4>
                              <p className="text-sm text-gray-500">
                                {track.duration} • {track.type}
                                {track.vocalPart !== 'NONE' && ` • ${vocalPartLabels[track.vocalPart]}`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {track.vocalPart !== 'NONE' && (
                                <Badge variant="outline" className="text-xs">{vocalPartLabels[track.vocalPart]}</Badge>
                              )}
                              <Badge variant="outline">{track.difficulty}</Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-md bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                  <CardContent className="p-6">
                    <Volume2 className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-lg font-bold mb-2">Daily Practice Goal</h3>
                    <p className="text-4xl font-bold mb-1">30 min</p>
                    <p className="text-sm text-white/80">
                      {Math.round(stats.totalPracticeMinutes % 30)} min completed today
                    </p>
                    <Progress 
                      value={Math.min((stats.totalPracticeMinutes % 30) / 30 * 100, 100)} 
                      className="mt-4 h-2 bg-white/30" 
                    />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Practice Checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: 'Warm-up exercises', done: stats.totalPracticeMinutes > 0 },
                      { title: 'Scale practice', done: stats.totalPracticeMinutes >= 10 },
                      { title: 'Song rehearsal', done: stats.totalPracticeMinutes >= 20 },
                      { title: 'Cool-down', done: stats.totalPracticeMinutes >= 30 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.done ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                        <span className={item.done ? 'text-gray-500 line-through' : 'text-gray-900'}>{item.title}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            {/* Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <CardContent className="p-6">
                  <DollarSign className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-3xl font-bold">{formatCurrency(supporterData.stats.totalDonations)}</p>
                  <p className="text-white/80 text-sm">Total Contributions</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mb-2 text-blue-500" />
                  <p className="text-3xl font-bold text-gray-900">{supporterData.stats.studentsSupported}</p>
                  <p className="text-gray-500 text-sm">Learners Supported</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <BookOpen className="w-8 h-8 mb-2 text-rose-500" />
                  <p className="text-3xl font-bold text-gray-900">{supporterData.impact.lessonsEnabled}</p>
                  <p className="text-gray-500 text-sm">Lessons Enabled</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Award className="w-8 h-8 mb-2 text-amber-500" />
                  <p className="text-3xl font-bold text-gray-900">{supporterData.stats.badgesEarned}</p>
                  <p className="text-gray-500 text-sm">Badges Earned</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Impact Highlights */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-amber-500" />
                      Your Impact
                    </CardTitle>
                    <CardDescription>See how your support is making a difference</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-center">
                        <p className="text-2xl font-bold text-amber-600">{supporterData.impact.learnersSupported} Learners</p>
                        <p className="text-sm text-gray-600">directly supported</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-center">
                        <p className="text-2xl font-bold text-blue-600">{supporterData.impact.lessonsEnabled} Lessons</p>
                        <p className="text-sm text-gray-600">enabled</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 text-center">
                        <p className="text-2xl font-bold text-rose-600">{supporterData.impact.songsRecorded} Songs</p>
                        <p className="text-sm text-gray-600">recorded</p>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="p-6 rounded-xl bg-gray-900 text-white">
                      <p className="italic text-lg mb-4">
                        "Thanks to our supporters, I was able to complete my vocal training and now lead the soprano section. Your generosity changes lives!"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold">NC</div>
                        <div>
                          <p className="font-semibold">Ngeh Canisia</p>
                          <p className="text-sm text-gray-400">Soprano Section Lead</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Supporter Leaderboard */}
              <div>
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                      Top Supporters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supporterData.leaderboard.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Be the first to donate!</p>
                    ) : (
                      supporterData.leaderboard.slice(0, 5).map((supporter) => (
                        <div key={supporter.rank} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            supporter.rank === 1 ? 'bg-amber-500 text-white' :
                            supporter.rank === 2 ? 'bg-gray-400 text-white' :
                            'bg-amber-700 text-white'
                          }`}>
                            {supporter.rank}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{supporter.name}</p>
                            <Badge className="text-xs bg-amber-100 text-amber-700">{supporter.badge}</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md mt-6">
                  <CardContent className="p-6 text-center">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                    <h3 className="font-bold text-gray-900 mb-2">Make a Donation</h3>
                    <p className="text-sm text-gray-500 mb-4">Support our learners and ministry</p>
                    <Link href="/projects">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                        <Heart className="w-4 h-4 mr-2" /> Donate Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">Help</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">Contact Us</Link>
              <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">About G2 Melody</Link>
            </div>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} G2 Melody. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component to show available courses for enrollment
function AvailableCourses({ enrolledCourseIds, onEnroll }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses?published=true')
      .then(res => res.json())
      .then(data => {
        setCourses(data.filter(c => !enrolledCourseIds.includes(c.id)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [enrolledCourseIds])

  if (loading) {
    return <div className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
  }

  if (courses.length === 0) {
    return <p className="text-gray-500 text-center py-4">You're enrolled in all available courses!</p>
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <div key={course.id} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-2xl">
              {course.emoji || '🎵'}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{course.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{course.level}</Badge>
                <span className="text-xs text-gray-500">{course.totalLessons} lessons</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
          <Button 
            size="sm" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => onEnroll(course.id)}
          >
            <GraduationCap className="w-4 h-4 mr-2" /> Enroll Now
          </Button>
        </div>
      ))}
    </div>
  )
}
