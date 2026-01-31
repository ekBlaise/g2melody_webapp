'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Music, LogOut, Calendar, Bell, Users, Mic2, Play, Clock, CheckCircle2,
  AlertCircle, Megaphone, BookOpen, Award, Home, Moon, Sun, RefreshCw,
  FileAudio, FileText, Video, ChevronRight, TrendingUp
} from 'lucide-react'

// Vocal part colors
const vocalPartColors = {
  SOPRANO: 'bg-pink-500',
  ALTO: 'bg-purple-500',
  TENOR: 'bg-blue-500',
  BASS: 'bg-green-500',
  NONE: 'bg-gray-500'
}

const vocalPartLabels = {
  SOPRANO: 'Soprano',
  ALTO: 'Alto',
  TENOR: 'Tenor',
  BASS: 'Bass',
  NONE: 'Not Set'
}

export default function MemberDashboard() {
  const router = useRouter()
  const [member, setMember] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check for member session
    const sessionData = sessionStorage.getItem('memberSession')
    if (!sessionData) {
      router.push('/members/login')
      return
    }

    const memberData = JSON.parse(sessionData)
    setMember(memberData)
    fetchDashboardData(memberData.id)
  }, [router])

  const fetchDashboardData = async (memberId) => {
    try {
      const res = await fetch(`/api/members/dashboard?memberId=${memberId}`)
      if (!res.ok) throw new Error('Failed to fetch dashboard data')
      const data = await res.json()
      setDashboardData(data)
    } catch (error) {
      toast.error('Failed to load dashboard')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    sessionStorage.removeItem('memberSession')
    toast.success('Signed out successfully')
    router.push('/members/login')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-900 to-orange-800">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 animate-pulse">
            <Music className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Loading Member Portal...</h2>
          <p className="mt-2 text-amber-200">Preparing your dashboard</p>
        </div>
      </div>
    )
  }

  if (!member || !dashboardData) {
    return null
  }

  const { practiceTracks, scheduleItems, announcements, attendanceRecords, stats } = dashboardData

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-amber-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">G2 Melody</span>
              <Badge className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                <Users className="h-3 w-3 mr-1" />Member
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Website
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-xl">
              <AvatarImage src={member.image} />
              <AvatarFallback className={`${vocalPartColors[member.vocalPart]} text-white text-xl font-bold`}>
                {member.name?.charAt(0) || 'M'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome, {member.name?.split(' ')[0]}!
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${vocalPartColors[member.vocalPart]} text-white`}>
                  <Mic2 className="h-3 w-3 mr-1" />
                  {vocalPartLabels[member.vocalPart]}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">{member.email}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => fetchDashboardData(member.id)} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.attendanceRate}%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Events Attended</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.presentCount}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Practice Tracks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{practiceTracks.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FileAudio className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduleItems.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-900 shadow-lg border-0 p-1 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />Overview
            </TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Music className="h-4 w-4 mr-2" />Practice
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />Schedule
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Megaphone className="h-4 w-4 mr-2" />Announcements
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <CheckCircle2 className="h-4 w-4 mr-2" />Attendance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Announcements */}
              <Card className="border-0 shadow-xl dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-amber-500" />
                    Latest Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {announcements.length === 0 ? (
                    <p className="text-gray-500 text-sm">No announcements at this time</p>
                  ) : (
                    announcements.slice(0, 3).map((ann) => (
                      <div key={ann.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">{ann.title}</h4>
                          {ann.priority === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                          {ann.priority === 'important' && (
                            <Badge className="bg-amber-500 text-xs">Important</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{ann.content}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(ann.publishedAt)}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Schedule */}
              <Card className="border-0 shadow-xl dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scheduleItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">No upcoming events</p>
                  ) : (
                    scheduleItems.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">{event.title}</h4>
                          <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">{event.type}</Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-500" />
                  Practice Resources
                </CardTitle>
                <CardDescription>
                  Audio tracks and resources for your vocal part ({vocalPartLabels[member.vocalPart]})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {practiceTracks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No practice tracks available yet</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {practiceTracks.map((track) => (
                      <div key={track.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                            <FileAudio className="h-6 w-6 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs">{track.type}</Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{track.title}</h4>
                        {track.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{track.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {track.duration || 'N/A'}
                          </span>
                          <Badge className={`${vocalPartColors[track.vocalPart]} text-white text-xs`}>
                            {vocalPartLabels[track.vocalPart]}
                          </Badge>
                        </div>
                        {track.audioUrl && (
                          <Button size="sm" className="w-full mt-3 bg-purple-500 hover:bg-purple-600">
                            <Play className="h-4 w-4 mr-2" />
                            Play Track
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Schedule
                </CardTitle>
                <CardDescription>Rehearsals, events, and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                {scheduleItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No upcoming events scheduled</p>
                ) : (
                  <div className="space-y-3">
                    {scheduleItems.map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex flex-col items-center justify-center text-white flex-shrink-0">
                          <span className="text-xs font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{event.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{event.time || formatDate(event.date)}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-amber-500" />
                  All Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No announcements at this time</p>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className={`p-4 rounded-xl border ${ann.priority === 'urgent' ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : ann.priority === 'important' ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{ann.title}</h4>
                          <div className="flex items-center gap-2">
                            {ann.priority === 'urgent' && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                            {ann.priority === 'important' && (
                              <Badge className="bg-amber-500">Important</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{ann.content}</p>
                        <p className="text-xs text-gray-400 mt-3">{formatDate(ann.publishedAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Attendance History
                </CardTitle>
                <CardDescription>
                  Your attendance rate: <span className="font-bold text-green-600">{stats.attendanceRate}%</span> ({stats.presentCount}/{stats.totalAttendance} events)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No attendance records yet</p>
                ) : (
                  <div className="space-y-3">
                    {attendanceRecords.map((record) => (
                      <div key={record.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${record.present ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          {record.present ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{record.eventTitle || record.eventType}</h4>
                          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                        </div>
                        <Badge variant={record.present ? 'default' : 'destructive'} className={record.present ? 'bg-green-500' : ''}>
                          {record.present ? 'Present' : 'Absent'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
