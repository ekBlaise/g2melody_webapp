'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Calendar, Clock, MapPin, Play, Image as ImageIcon, Video, ArrowRight,
  Loader2, CalendarDays, History, Sparkles
} from 'lucide-react'

export default function NewsPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities')
        if (res.ok) {
          const data = await res.json()
          setActivities(data)
        } else {
          setActivities(sampleActivities)
        }
      } catch (error) {
        setActivities(sampleActivities)
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  const now = new Date()
  const upcomingActivities = activities.filter(a => new Date(a.date) >= now)
  const pastActivities = activities.filter(a => new Date(a.date) < now)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="news" />

      {/* Hero */}
      <section className="relative pt-24 pb-12 mt-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw0fHxjb25jZXJ0JTIwY3Jvd2R8ZW58MHx8fHwxNzY4MjQ4MTI0fDA&ixlib=rb-4.1.0&q=85"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Activities & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Events</span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Stay updated with our concerts, workshops, community outreach, and special events.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 p-1.5 bg-white shadow-lg rounded-2xl h-14">
            <TabsTrigger value="upcoming" className="rounded-xl text-base font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" /> Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-xl text-base font-medium data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              <History className="w-4 h-4 mr-2" /> Past Activities
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming">
            {upcomingActivities.length === 0 ? (
              <div className="text-center py-16">
                <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500">Check back soon for new events and activities!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} formatDate={formatDate} formatTime={formatTime} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Activities */}
          <TabsContent value="past">
            {pastActivities.length === 0 ? (
              <div className="text-center py-16">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No past activities to display yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} formatDate={formatDate} formatTime={formatTime} isPast />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <SharedFooter />
    </div>
  )
}

function ActivityCard({ activity, formatDate, formatTime, isPast }) {
  const hasMedia = activity.images?.length > 0 || activity.videos?.length > 0

  // Use amber for all badges to keep color consistency
  const getBadgeStyle = (type) => {
    switch(type) {
      case 'concert': return 'bg-amber-500'
      case 'workshop': return 'bg-orange-500'
      case 'outreach': return 'bg-amber-600'
      default: return 'bg-gray-700'
    }
  }

  return (
    <Link href={`/news/${activity.id}`}>
      <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full ${isPast ? 'opacity-90' : ''}`}>
        <div className="relative h-48">
          {activity.coverImage ? (
            <img
              src={activity.coverImage}
              alt={activity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <CalendarDays className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Type Badge */}
          <Badge className={`absolute top-3 left-3 ${getBadgeStyle(activity.type)}`}>
            {activity.type}
          </Badge>

          {/* Media Indicator */}
          {hasMedia && (
            <div className="absolute top-3 right-3 flex gap-1">
              {activity.images?.length > 0 && (
                <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
              )}
              {activity.videos?.length > 0 && (
                <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white rounded-lg px-3 py-1.5 shadow-lg">
              <p className="text-xs font-medium text-gray-500">
                {new Date(activity.date).toLocaleDateString('en-US', { month: 'short' })}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(activity.date).getDate()}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
            {activity.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {activity.description}
          </p>
          
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{formatTime(activity.date)}</span>
            </div>
            {activity.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="line-clamp-1">{activity.venue}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0">
          <Button variant="ghost" className="w-full group-hover:bg-amber-50 group-hover:text-amber-600">
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

// Sample data for demonstration
const sampleActivities = [
  {
    id: 'act-1',
    title: 'Christmas Cantata 2024',
    description: 'Join us for our annual Christmas cantata featuring traditional carols and original compositions celebrating the birth of Christ.',
    type: 'concert',
    date: '2024-12-22T18:00:00',
    venue: 'Church of Christ Bomaka, Buea',
    coverImage: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800',
    images: ['img1.jpg', 'img2.jpg'],
    videos: ['video1.mp4']
  },
  {
    id: 'act-2',
    title: 'Vocal Training Workshop',
    description: 'A comprehensive workshop on vocal techniques, breathing exercises, and four-part harmony basics for aspiring singers.',
    type: 'workshop',
    date: '2025-01-15T14:00:00',
    venue: 'G2 Melody Training Center',
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    images: ['img1.jpg'],
    videos: []
  },
  {
    id: 'act-3',
    title: 'Community Gospel Outreach',
    description: 'Spreading the Gospel through music in Molyko community. Join us for songs, testimonies, and fellowship.',
    type: 'outreach',
    date: '2025-02-08T10:00:00',
    venue: 'Molyko, Buea',
    coverImage: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800',
    images: [],
    videos: []
  },
  {
    id: 'act-4',
    title: 'Easter Celebration Concert',
    description: 'A special resurrection celebration featuring powerful hymns and worship songs.',
    type: 'concert',
    date: '2025-04-20T17:00:00',
    venue: 'Church of Christ Bomaka',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    images: [],
    videos: []
  },
  {
    id: 'act-5',
    title: 'Annual General Meeting 2024',
    description: 'Our annual meeting to review the year, celebrate achievements, and plan for the future.',
    type: 'meeting',
    date: '2024-11-30T14:00:00',
    venue: 'G2 Melody Office',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
    videos: ['recap.mp4']
  },
  {
    id: 'act-6',
    title: 'Unfathomable Love Album Launch',
    description: 'The official launch of our debut album "Unfathomable Love" with live performances.',
    type: 'concert',
    date: '2019-08-15T17:00:00',
    venue: 'Multipurpose Hall, Buea',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
    videos: ['highlight.mp4', 'performance.mp4']
  }
]
