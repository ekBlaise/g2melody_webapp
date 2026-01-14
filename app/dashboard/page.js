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
  Volume2, CheckCircle2, Circle, Flame, Zap, GraduationCap, LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [playingLesson, setPlayingLesson] = useState(null)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New lesson available', desc: 'Four-Part Harmony Basics is now live!', time: '2 hours ago', unread: true },
    { id: 2, title: 'Practice reminder', desc: 'You haven\'t practiced in 3 days', time: '1 day ago', unread: true },
    { id: 3, title: 'Achievement unlocked!', desc: 'You completed your first week of practice', time: '3 days ago', unread: false },
  ])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!session) return null

  const userName = session.user?.name || 'Learner'
  const userEmail = session.user?.email || ''
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  // Mock data for demonstration
  const learningProgress = {
    overallProgress: 35,
    currentStreak: 7,
    totalLessons: 24,
    completedLessons: 8,
    practiceHours: 12.5,
    nextMilestone: 'Complete 10 lessons'
  }

  const activeCourses = [
    { id: 1, title: 'Vocal Fundamentals', progress: 60, totalLessons: 12, completedLessons: 7, image: '🎤' },
    { id: 2, title: 'Four-Part Harmony', progress: 25, totalLessons: 8, completedLessons: 2, image: '🎵' },
    { id: 3, title: 'Sight Reading Basics', progress: 10, totalLessons: 10, completedLessons: 1, image: '📖' },
  ]

  const practiceTracks = [
    { id: 1, title: 'Soprano Scale Practice', duration: '5:30', type: 'Exercise' },
    { id: 2, title: 'Unfathomable Love - Tenor Part', duration: '4:15', type: 'Song' },
    { id: 3, title: 'Breathing Exercises', duration: '3:00', type: 'Exercise' },
    { id: 4, title: 'Harmony Drill #3', duration: '6:45', type: 'Exercise' },
  ]

  const upcomingSchedule = [
    { id: 1, title: 'Online Rehearsal', date: 'Today', time: '6:00 PM', type: 'rehearsal' },
    { id: 2, title: 'Vocal Training Session', date: 'Tomorrow', time: '4:00 PM', type: 'lesson' },
    { id: 3, title: 'Assignment Due: Harmony Exercise', date: 'Jan 18', time: '11:59 PM', type: 'deadline' },
  ]

  const recommendedLessons = [
    { id: 1, title: 'Advanced Breathing Techniques', duration: '15 min', level: 'Intermediate' },
    { id: 2, title: 'Introduction to Alto Part', duration: '20 min', level: 'Beginner' },
    { id: 3, title: 'Blending Voices in Harmony', duration: '25 min', level: 'Intermediate' },
  ]

  const supporterStats = {
    totalDonations: 150000,
    studentsSupported: 5,
    mentorshipHours: 8,
    badgesEarned: 3
  }

  const impactHighlights = [
    { metric: '5 Learners', desc: 'directly supported by your contributions' },
    { metric: '12 Hours', desc: 'of lessons enabled' },
    { metric: '3 Songs', desc: 'recorded with your support' },
  ]

  const supporterLeaderboard = [
    { rank: 1, name: 'Sister Mafani Patricia', amount: 500000, badge: 'Gold Patron' },
    { rank: 2, name: 'Brother John Neba', amount: 250000, badge: 'Silver Patron' },
    { rank: 3, name: 'Anonymous', amount: 100000, badge: 'Bronze Patron' },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
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
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#1e40af]-500 rounded-full"></span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session.user?.image} />
                  <AvatarFallback className="bg-gradient-to-br from-[#1e40af]-500 to-[#0891b2]-500 text-white text-sm font-semibold">
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
            <div className="hidden md:flex items-center space-x-2 bg-[#1e40af]-50 rounded-full px-4 py-2">
              <Flame className="w-5 h-5 text-[#1e40af]-500" />
              <span className="text-sm font-semibold text-[#1e40af]-700">{learningProgress.currentStreak} Day Streak!</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1 h-auto">
            <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-[#1e40af]-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="learning" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-[#1e40af]-500 data-[state=active]:text-white">
              <GraduationCap className="w-4 h-4 mr-2" /> Learning
            </TabsTrigger>
            <TabsTrigger value="practice" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-[#1e40af]-500 data-[state=active]:text-white">
              <Headphones className="w-4 h-4 mr-2" /> Practice
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-[#1e40af]-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" /> Support
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-[#1e40af]-500 to-[#0891b2]-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold">{learningProgress.overallProgress}%</span>
                  </div>
                  <p className="text-white/90 font-medium">Overall Progress</p>
                  <Progress value={learningProgress.overallProgress} className="mt-2 h-2 bg-white/30" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{learningProgress.completedLessons}/{learningProgress.totalLessons}</span>
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
                    <span className="text-3xl font-bold text-gray-900">{learningProgress.practiceHours}h</span>
                  </div>
                  <p className="text-gray-600 font-medium">Practice Hours</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1e40af]-100 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-[#1e40af]-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">3</span>
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
                    {activeCourses.map((course) => (
                      <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e40af]-100 to-[#0891b2]-100 flex items-center justify-center text-2xl">
                          {course.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-[#1e40af]-600 transition-colors">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.completedLessons} of {course.totalLessons} lessons</p>
                          <Progress value={course.progress} className="mt-2 h-2" />
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-[#1e40af]-600">{course.progress}%</span>
                          <ChevronRight className="w-5 h-5 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Schedule */}
              <div>
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-[#1e40af]-500" />
                      Upcoming Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingSchedule.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          item.type === 'rehearsal' ? 'bg-blue-500' :
                          item.type === 'lesson' ? 'bg-[#1e40af]-500' : 'bg-rose-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.date} • {item.time}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      <Calendar className="w-4 h-4 mr-2" /> View Full Schedule
                    </Button>
                  </CardContent>
                </Card>

                {/* Next Milestone */}
                <Card className="border-0 shadow-md mt-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#1e40af]-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Next Milestone</p>
                        <p className="font-semibold">{learningProgress.nextMilestone}</p>
                      </div>
                    </div>
                    <Progress value={80} className="h-2 bg-gray-700" />
                    <p className="text-xs text-gray-400 mt-2">2 more lessons to go!</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Notifications */}
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-[#1e40af]-500" />
                  Notifications
                </CardTitle>
                <Button variant="ghost" size="sm">Mark all as read</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl ${notif.unread ? 'bg-[#1e40af]-50' : 'bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-[#1e40af]-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{notif.title}</p>
                        <p className="text-sm text-gray-500">{notif.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400">{notif.time}</span>
                    </div>
                  ))}
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
                    {activeCourses.map((course) => (
                      <div key={course.id} className="p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1e40af]-100 to-[#0891b2]-100 flex items-center justify-center text-3xl">
                            {course.image}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-500 mb-2">{course.completedLessons} of {course.totalLessons} lessons completed</p>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <Button className="bg-[#1e40af]-500 hover:bg-[#1e40af]-600">
                            <Play className="w-4 h-4 mr-2" /> Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommended Lessons */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-[#1e40af]-500" />
                      Recommended For You
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {recommendedLessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                          <div className="w-full h-24 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-3">
                            <GraduationCap className="w-10 h-10 text-blue-500" />
                          </div>
                          <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-[#1e40af]-600">{lesson.title}</h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{lesson.duration}</span>
                            <Badge variant="outline" className="text-xs">{lesson.level}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Stats Sidebar */}
              <div className="space-y-6">
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardContent className="p-6">
                    <Mic2 className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-lg font-bold mb-2">Your Vocal Part</h3>
                    <p className="text-3xl font-bold mb-1">Tenor</p>
                    <p className="text-sm text-white/80">Focus on mid-range exercises</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: '🔥', title: '7 Day Streak', desc: 'Practice for 7 days in a row' },
                      { icon: '🎵', title: 'First Song', desc: 'Complete your first song lesson' },
                      { icon: '⭐', title: 'Quick Learner', desc: 'Complete 5 lessons in a week' },
                    ].map((achievement, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#1e40af]-50">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                          <p className="text-xs text-gray-500">{achievement.desc}</p>
                        </div>
                      </div>
                    ))}
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
                      {practiceTracks.map((track) => (
                        <div key={track.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                          playingLesson === track.id ? 'bg-rose-50 border border-rose-200' : 'bg-gray-50 hover:bg-gray-100'
                        }`}>
                          <button
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                              playingLesson === track.id 
                                ? 'bg-rose-500 text-white' 
                                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                            }`}
                            onClick={() => setPlayingLesson(playingLesson === track.id ? null : track.id)}
                          >
                            {playingLesson === track.id ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{track.title}</h4>
                            <p className="text-sm text-gray-500">{track.duration} • {track.type}</p>
                          </div>
                          <Badge variant="outline">{track.type}</Badge>
                        </div>
                      ))}
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
                    <p className="text-sm text-white/80">15 min completed today</p>
                    <Progress value={50} className="mt-4 h-2 bg-white/30" />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Practice Checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: 'Warm-up exercises', done: true },
                      { title: 'Scale practice', done: true },
                      { title: 'Song rehearsal', done: false },
                      { title: 'Cool-down', done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.done ? (
                          <CheckCircle2 className="w-5 h-5 text-[#1e40af]-500" />
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
              <Card className="border-0 shadow-md bg-gradient-to-br from-[#1e40af]-500 to-[#0891b2]-500 text-white">
                <CardContent className="p-6">
                  <DollarSign className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-3xl font-bold">{formatCurrency(supporterStats.totalDonations)}</p>
                  <p className="text-white/80 text-sm">Total Contributions</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mb-2 text-blue-500" />
                  <p className="text-3xl font-bold text-gray-900">{supporterStats.studentsSupported}</p>
                  <p className="text-gray-500 text-sm">Learners Supported</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 mb-2 text-rose-500" />
                  <p className="text-3xl font-bold text-gray-900">{supporterStats.mentorshipHours}h</p>
                  <p className="text-gray-500 text-sm">Mentorship Hours</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Award className="w-8 h-8 mb-2 text-[#1e40af]-500" />
                  <p className="text-3xl font-bold text-gray-900">{supporterStats.badgesEarned}</p>
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
                      <TrendingUp className="w-5 h-5 mr-2 text-[#1e40af]-500" />
                      Your Impact
                    </CardTitle>
                    <CardDescription>See how your support is making a difference</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {impactHighlights.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#1e40af]-50 to-[#0891b2]-50 text-center">
                          <p className="text-2xl font-bold text-[#1e40af]-600">{item.metric}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="p-6 rounded-xl bg-gray-900 text-white">
                      <p className="italic text-lg mb-4">
                        "Thanks to our supporters, I was able to complete my vocal training and now lead the soprano section. Your generosity changes lives!"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1e40af]-500 flex items-center justify-center font-bold">NC</div>
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
                      <Trophy className="w-5 h-5 mr-2 text-[#1e40af]-500" />
                      Top Supporters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supporterLeaderboard.map((supporter) => (
                      <div key={supporter.rank} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          supporter.rank === 1 ? 'bg-[#1e40af]-500 text-white' :
                          supporter.rank === 2 ? 'bg-gray-400 text-white' :
                          'bg-[#1e40af]-700 text-white'
                        }`}>
                          {supporter.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{supporter.name}</p>
                          <Badge className="text-xs bg-[#1e40af]-100 text-[#1e40af]-700">{supporter.badge}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md mt-6">
                  <CardContent className="p-6 text-center">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-[#1e40af]-500" />
                    <h3 className="font-bold text-gray-900 mb-2">Make a Donation</h3>
                    <p className="text-sm text-gray-500 mb-4">Support our learners and ministry</p>
                    <Link href="/projects">
                      <Button className="w-full bg-gradient-to-r from-[#1e40af]-500 to-[#0891b2]-500 hover:from-[#1e40af]-600 hover:to-[#0891b2]-600">
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

