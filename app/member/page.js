'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Music, Heart, LogOut, User, Download, History, Home, Settings, Moon, Sun,
  Calendar, Loader2, Clock, Bell, Users, Mic2, BookOpen, FileText,
  Play, ChevronRight, Star, Shield, CheckCircle2, Video, MapPin,
  MessageCircle, Sparkles, Award, Target, Volume2, ListMusic, GraduationCap
} from 'lucide-react'

// Upcoming Event Card
function EventCard({ event, isPast = false }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${isPast ? 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50' : 'border-amber-200 bg-gradient-to-br from-[#1e40af]-50 to-[#0891b2]-50 dark:from-[#1e40af]-900/20 dark:to-[#0891b2]-900/20 dark:border-amber-800/50'} p-5 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start gap-4">
        <div className={`flex flex-col items-center justify-center rounded-xl ${isPast ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gradient-to-br from-[#1e40af]-500 to-[#0891b2]-500'} p-3 text-center min-w-[60px]`}>
          <span className={`text-xs font-medium ${isPast ? 'text-gray-500' : 'text-white/80'}`}>{event.month}</span>
          <span className={`text-2xl font-bold ${isPast ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}>{event.day}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
            {!isPast && <Badge className="bg-[#1e40af]-100 text-[#1e40af]-700 dark:bg-[#1e40af]-900/50 dark:text-[#1e40af]-300 text-xs">Upcoming</Badge>}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
        </div>
      </div>
    </div>
  )
}

// Practice Resource Card
function ResourceCard({ resource }) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
        resource.type === 'audio' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' : 
        resource.type === 'video' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
        'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
      }`}>
        {resource.type === 'audio' ? <Volume2 className="h-6 w-6" /> : 
         resource.type === 'video' ? <Video className="h-6 w-6" /> : 
         <FileText className="h-6 w-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">{resource.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{resource.subtitle}</p>
      </div>
      <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/30">
        {resource.type === 'audio' ? <Play className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      </Button>
    </div>
  )
}

// Vocal Part Badge Component
function VocalPartBadge({ part }) {
  const colors = {
    'Soprano': 'from-pink-500 to-rose-500',
    'Alto': 'from-purple-500 to-violet-500',
    'Tenor': 'from-blue-500 to-cyan-500',
    'Bass': 'from-emerald-500 to-teal-500'
  }
  
  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${colors[part] || 'from-gray-500 to-gray-600'} px-4 py-2 text-white shadow-lg`}>
      <Mic2 className="h-4 w-4" />
      <span className="font-medium">{part || 'Not Assigned'}</span>
    </div>
  )
}

// Announcement Card
function AnnouncementCard({ announcement }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
          announcement.priority === 'high' ? 'bg-red-100 text-red-600' : 
          announcement.priority === 'medium' ? 'bg-[#1e40af]-100 text-[#1e40af]-600' : 
          'bg-blue-100 text-blue-600'
        }`}>
          <Bell className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{announcement.message}</p>
          <p className="mt-2 text-xs text-gray-400">{announcement.date}</p>
        </div>
      </div>
    </div>
  )
}

export default function MemberDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [memberStats, setMemberStats] = useState({
    rehearsalsAttended: 12,
    totalRehearsals: 15,
    songsLearned: 8,
    performancesParticipated: 3
  })

  // Mock data for member dashboard
  const upcomingEvents = [
    { title: 'Weekly Rehearsal', month: 'JAN', day: '15', time: '5:00 PM', location: 'Church of Christ Bomaka', description: 'Regular practice session - focus on new Easter pieces' },
    { title: 'Community Outreach', month: 'JAN', day: '20', time: '10:00 AM', location: 'Buea Town', description: 'Evangelism through music at the community center' },
    { title: 'Recording Session', month: 'JAN', day: '25', time: '2:00 PM', location: 'G2 Studio', description: 'Recording new tracks for upcoming album' },
  ]

  const practiceResources = [
    { title: 'Amazing Grace - Soprano Part', subtitle: 'Practice audio', type: 'audio' },
    { title: 'Four-Part Harmony Tutorial', subtitle: 'Video lesson', type: 'video' },
    { title: 'Easter Program Sheet Music', subtitle: 'PDF download', type: 'sheet' },
    { title: 'Vocal Warm-up Exercises', subtitle: 'Practice audio', type: 'audio' },
  ]

  const announcements = [
    { title: 'Uniform Fitting', message: 'New choir robes will be fitted next Sunday after service. Please be present.', date: 'Posted 2 days ago', priority: 'high' },
    { title: 'Easter Program', message: 'Preparation for Easter program begins next month. All members expected.', date: 'Posted 5 days ago', priority: 'medium' },
    { title: 'Happy Birthday!', message: 'Wishing a blessed birthday to all January celebrants!', date: 'Posted 1 week ago', priority: 'low' },
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30">
            <Users className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loading Member Dashboard...</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Preparing your choir experience</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  // Check if user has member or admin role
  if (session.user.role === 'ADMIN') {
    router.push('/admin')
    return null
  }

  if (session.user.role !== 'MEMBER') {
    router.push('/dashboard')
    return null
  }

  const attendanceRate = Math.round((memberStats.rehearsalsAttended / memberStats.totalRehearsals) * 100)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">G2 Melody</span>
              <Badge className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Member</Badge>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" /> Home
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl shadow-blue-500/30 relative">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                <AvatarImage src={session.user.image} />
                <AvatarFallback className="bg-white/20 text-2xl font-bold text-white">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/80 text-sm font-medium">Welcome back, Choir Member</p>
                <h1 className="text-3xl font-bold">{session.user.name || 'G2 Member'}</h1>
                <div className="mt-2">
                  <VocalPartBadge part="Soprano" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
                <p className="text-3xl font-bold">{attendanceRate}%</p>
                <p className="text-xs text-white/70">Attendance</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
                <p className="text-3xl font-bold">{memberStats.songsLearned}</p>
                <p className="text-xs text-white/70">Songs Learned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rehearsals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{memberStats.rehearsalsAttended}/{memberStats.totalRehearsals}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                <Music className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Songs Learned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{memberStats.songsLearned}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af]-500 to-[#0891b2]-500 text-white shadow-lg shadow-amber-500/30">
                <Star className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Performances</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{memberStats.performancesParticipated}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2023</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800">
            <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Target className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Calendar className="mr-2 h-4 w-4" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="resources" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <BookOpen className="mr-2 h-4 w-4" /> Resources
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Upcoming Events */}
              <Card className="lg:col-span-2 border-0 shadow-xl dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Your next choir activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={index} event={event} />
                  ))}
                </CardContent>
              </Card>

              {/* Announcements */}
              <Card className="border-0 shadow-xl dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-[#1e40af]-500" />
                    Announcements
                  </CardTitle>
                  <CardDescription>Latest updates from leadership</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <AnnouncementCard key={index} announcement={announcement} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Attendance Progress */}
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Attendance Progress
                </CardTitle>
                <CardDescription>Keep up your commitment to rehearsals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Monthly attendance</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{attendanceRate}%</span>
                  </div>
                  <Progress value={attendanceRate} className="h-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You've attended {memberStats.rehearsalsAttended} out of {memberStats.totalRehearsals} rehearsals this month. 
                    {attendanceRate >= 80 ? ' Excellent commitment!' : ' Keep it up!'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Full Schedule</CardTitle>
                <CardDescription>All upcoming choir events and activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
                <div className="border-t pt-4 mt-4 dark:border-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Past Events</h4>
                  <EventCard event={{ title: 'Christmas Concert', month: 'DEC', day: '25', time: '6:00 PM', location: 'Church of Christ Bomaka', description: 'Annual Christmas celebration concert' }} isPast />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Practice Resources
                </CardTitle>
                <CardDescription>Sheet music, audio tracks, and tutorials for your practice</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {practiceResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                  Learning Progress
                </CardTitle>
                <CardDescription>Track your musical development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Mic2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Vocal Training</p>
                        <p className="text-xs text-gray-500">In Progress</p>
                      </div>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-gray-500 mt-2">65% complete</p>
                  </div>
                  
                  <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Music className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sight Reading</p>
                        <p className="text-xs text-gray-500">In Progress</p>
                      </div>
                    </div>
                    <Progress value={40} className="h-2" />
                    <p className="text-xs text-gray-500 mt-2">40% complete</p>
                  </div>
                  
                  <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <ListMusic className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">4-Part Harmony</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-2">100% complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

