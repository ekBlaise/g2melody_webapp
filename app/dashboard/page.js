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
  CreditCard, Calendar, DollarSign, ChevronRight, Loader2, TrendingUp,
  Target, Award, Sparkles, Gift, BookOpen, Headphones, Play, Clock,
  Star, Zap, ArrowUpRight, Crown, Shield, Bell, Search, MoreVertical,
  BarChart3, PieChart, Activity, Users, CheckCircle2, Flame
} from 'lucide-react'

// Animated Counter Component
function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * numericValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])
  
  return <span>{count.toLocaleString()}</span>
}

// Impact Card Component for visualizing donation impact
function ImpactCard({ icon: Icon, title, value, subtitle, color, delay = 0 }) {
  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="mt-1 text-3xl font-bold">{value}</p>
        <p className="mt-2 text-xs text-white/60">{subtitle}</p>
      </div>
    </div>
  )
}

// Music Track Card with hover animation
function MusicTrackCard({ track, onDownload }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="group relative flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-purple-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
        <img
          src={track.music?.coverImage || 'https://images.unsplash.com/photo-1652626627227-acc5ce198876'}
          alt={track.music?.title}
          className={`h-full w-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
        />
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
            <Play className="h-4 w-4 text-purple-600 ml-0.5" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{track.music?.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{track.music?.artist}</p>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
            {track.music?.genre || 'Gospel'}
          </Badge>
        </div>
      </div>
      
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-10 w-10 p-0 hover:bg-purple-50 dark:hover:bg-purple-900/30"
        onClick={() => onDownload?.(track)}
      >
        <Download className="h-4 w-4 text-purple-600" />
      </Button>
    </div>
  )
}

// Donation History Item with animation
function DonationItem({ donation, index }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  return (
    <div 
      className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
        <Heart className="h-5 w-5" />
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">{donation.project?.title || 'Project'}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(donation.createdAt)}</p>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(donation.amount)}</p>
        <Badge className="bg-emerald-50 text-emerald-700 border-0 dark:bg-emerald-900/30 dark:text-emerald-300">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {donation.status}
        </Badge>
      </div>
    </div>
  )
}

// Quick Stats Ring
function StatsRing({ value, max, label, color, icon: Icon }) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="h-24 w-24 -rotate-90 transform">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100 dark:text-gray-800" />
          <circle
            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={color}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`h-8 w-8 ${color.replace('text-', 'text-')}`} />
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}

export default function SupporterDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [donations, setDonations] = useState([])
  const [purchases, setPurchases] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return

      try {
        const [donationsRes, purchasesRes, paymentsRes] = await Promise.all([
          fetch(`/api/donations?userId=${session.user.id}`),
          fetch(`/api/purchases?userId=${session.user.id}`),
          fetch(`/api/payments?userId=${session.user.id}`)
        ])

        const [donationsData, purchasesData, paymentsData] = await Promise.all([
          donationsRes.json(),
          purchasesRes.json(),
          paymentsRes.json()
        ])

        setDonations(Array.isArray(donationsData) ? donationsData : [])
        setPurchases(Array.isArray(purchasesData) ? purchasesData : [])
        setPayments(Array.isArray(paymentsData) ? paymentsData : [])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-xl shadow-orange-500/30">
            <Music className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loading your dashboard...</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Preparing your G2 Melody experience</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
  const totalPurchased = purchases.reduce((sum, p) => sum + (p.amount || 0), 0)
  const impactScore = Math.min(Math.floor((totalDonated / 100000) * 100), 100)

  // Redirect admins and members to their specific dashboards
  if (session.user.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle>Admin Access Detected</CardTitle>
            <CardDescription>You have admin privileges. Access the admin dashboard for full control.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin" className="block">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500">
                Go to Admin Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (session.user.role === 'MEMBER') {
    router.push('/member')
    return null
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-orange-500/30">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">G2 Melody</span>
              <Badge className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Supporter</Badge>
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
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-2xl shadow-orange-500/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                <AvatarImage src={session.user.image} />
                <AvatarFallback className="bg-white/20 text-2xl font-bold text-white">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/80 text-sm font-medium">Welcome back,</p>
                <h1 className="text-3xl font-bold">{session.user.name || 'Valued Supporter'}</h1>
                <p className="text-white/70 text-sm mt-1">{session.user.email}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/projects">
                <Button className="bg-white/20 backdrop-blur border-2 border-white/30 hover:bg-white/30 text-white gap-2">
                  <Heart className="h-4 w-4" /> Support a Project
                </Button>
              </Link>
              <Link href="/music">
                <Button className="bg-white text-orange-600 hover:bg-white/90 gap-2">
                  <Music className="h-4 w-4" /> Browse Music
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ImpactCard
            icon={Heart}
            title="Total Donated"
            value={formatCurrency(totalDonated)}
            subtitle={`${donations.length} donations made`}
            color="from-emerald-500 to-teal-600"
            delay={0}
          />
          <ImpactCard
            icon={Music}
            title="Music Owned"
            value={`${purchases.length} tracks`}
            subtitle={formatCurrency(totalPurchased) + " invested"}
            color="from-purple-500 to-indigo-600"
            delay={100}
          />
          <ImpactCard
            icon={Target}
            title="Projects Supported"
            value={donations.length.toString()}
            subtitle="Helping G2 Melody grow"
            color="from-amber-500 to-orange-600"
            delay={200}
          />
          <ImpactCard
            icon={Flame}
            title="Impact Score"
            value={`${impactScore}/100`}
            subtitle="Your generosity level"
            color="from-rose-500 to-pink-600"
            delay={300}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800">
            <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <BarChart3 className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="donations" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Heart className="mr-2 h-4 w-4" /> Donations
            </TabsTrigger>
            <TabsTrigger value="music" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-gray-900">
              <Headphones className="mr-2 h-4 w-4" /> My Music
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Activity Summary */}
              <Card className="lg:col-span-2 border-0 shadow-xl dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest contributions and purchases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <History className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">No activity yet</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start by supporting a project or purchasing music</p>
                      <div className="mt-4 flex gap-3">
                        <Link href="/projects">
                          <Button size="sm" variant="outline">View Projects</Button>
                        </Link>
                        <Link href="/music">
                          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500">Browse Music</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.slice(0, 5).map((payment, index) => (
                        <div key={payment.id} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            payment.type === 'DONATION' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                          }`}>
                            {payment.type === 'DONATION' ? <Heart className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {payment.type === 'DONATION' ? payment.donation?.project?.title : payment.purchase?.music?.title}
                            </p>
                            <p className="text-sm text-gray-500">{payment.type} • {payment.paymentMethod || 'Card'}</p>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Impact Visualization */}
              <Card className="border-0 shadow-xl dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Your Impact
                  </CardTitle>
                  <CardDescription>How you're making a difference</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-4">
                    <div className="relative mb-6">
                      <svg className="h-32 w-32 -rotate-90 transform">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-100 dark:text-gray-800" />
                        <circle
                          cx="64" cy="64" r="56" stroke="url(#gradient)" strokeWidth="12" fill="none"
                          strokeDasharray={2 * Math.PI * 56}
                          strokeDashoffset={2 * Math.PI * 56 - (impactScore / 100) * 2 * Math.PI * 56}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{impactScore}</span>
                        <span className="text-xs text-gray-500">Impact Score</span>
                      </div>
                    </div>
                    
                    <div className="w-full space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Donations</span>
                        <span className="font-medium text-gray-900 dark:text-white">{donations.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Music Purchased</span>
                        <span className="font-medium text-gray-900 dark:text-white">{purchases.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Total Contributed</span>
                        <span className="font-bold text-amber-600">{formatCurrency(totalDonated + totalPurchased)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Donations</CardTitle>
                  <CardDescription>Track all your contributions to G2 Melody projects</CardDescription>
                </div>
                <Link href="/projects">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 gap-2">
                    <Heart className="h-4 w-4" /> Donate Now
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                      <Heart className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No donations yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                      Your generosity helps G2 Melody spread the Gospel through music across Cameroon and beyond.
                    </p>
                    <Link href="/projects" className="mt-6">
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 gap-2 shadow-lg shadow-emerald-500/30">
                        <Heart className="h-4 w-4" /> Support a Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {donations.map((donation, index) => (
                      <DonationItem key={donation.id} donation={donation} index={index} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <Card className="border-0 shadow-xl dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Music Library</CardTitle>
                  <CardDescription>Download your purchased tracks anytime</CardDescription>
                </div>
                <Link href="/music">
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 gap-2">
                    <Music className="h-4 w-4" /> Browse Store
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                      <Headphones className="h-10 w-10 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your library is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                      Discover beautiful acapella worship music and support G2 Melody's mission.
                    </p>
                    <Link href="/music" className="mt-6">
                      <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 gap-2 shadow-lg shadow-purple-500/30">
                        <Music className="h-4 w-4" /> Browse Music Store
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {purchases.map((purchase) => (
                      <MusicTrackCard
                        key={purchase.id}
                        track={purchase}
                        onDownload={() => toast.success('Download started!')}
                      />
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
