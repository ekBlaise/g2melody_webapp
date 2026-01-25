'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import { Calendar, Clock, MapPin, ArrowRight, Megaphone, FileText, Newspaper, CalendarDays } from 'lucide-react'

const NewsSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card key={i} className="overflow-hidden border-0 shadow-lg">
        <div className="h-40 bg-gray-200 animate-pulse" />
        <CardContent className="p-4 space-y-3">
          <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        if (response.ok) {
          const data = await response.json()
          setNews(Array.isArray(data) ? data.filter(n => n.type !== 'event') : [])
          setEvents(Array.isArray(data) ? data.filter(n => n.type === 'event') : [])
        }
      } catch (err) {
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const allItems = activeFilter === 'all' 
    ? [...(news || []), ...(events || [])].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    : activeFilter === 'events' 
      ? (events || [])
      : (news || [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SharedNavigation currentPage="news" />

      {/* Hero Section with Image */}
      <section className="relative pt-20 sm:pt-24">
        <div className="absolute inset-0 h-[400px] sm:h-[450px]">
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="G2 Melody News"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-24 sm:pb-32">
          <div className="text-center">
            <Badge className="bg-[#1e40af]/20 text-[#1e40af] border-[#1e40af]/30 mb-4">
              <Newspaper className="w-3 h-3 mr-1" /> Stay Informed
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              News & Events
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest happenings, announcements, and upcoming events from G2 Melody
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30 -mt-8 sm:-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'All Updates', icon: Newspaper },
              { id: 'news', label: 'News', icon: Megaphone },
              { id: 'events', label: 'Events', icon: CalendarDays }
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'outline'}
                className={`flex-shrink-0 ${activeFilter === filter.id ? 'bg-[#1e40af] hover:bg-[#1e3a8a]' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <filter.icon className="w-4 h-4 mr-2" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <NewsSkeleton />
          ) : allItems.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">No updates yet</h3>
              <p className="text-gray-500">Check back soon for news and events</p>
            </div>
          ) : (
            <>
              {/* Featured Items */}
              {activeFilter === 'all' && allItems.filter(item => item.isFeatured).length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {allItems.filter(item => item.isFeatured).slice(0, 2).map((item) => (
                      <Link key={item.id} href={`/news/${item.id}`}>
                        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                          <div className="relative h-56">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#1e40af] to-[#0891b2] flex items-center justify-center">
                                {item.type === 'event' ? (
                                  <Calendar className="w-16 h-16 text-white/80" />
                                ) : (
                                  <Megaphone className="w-16 h-16 text-white/80" />
                                )}
                              </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <Badge className={`${
                                item.type === 'event' ? 'bg-[#1e40af]' : 
                                item.type === 'announcement' ? 'bg-[#0891b2]' : 'bg-gray-800'
                              } text-white`}>
                                {item.type}
                              </Badge>
                              <Badge className="bg-purple-500 text-white">Featured</Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1e40af] transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{item.summary}</p>
                            {item.type === 'event' && item.eventDate && (
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(item.eventDate)}
                                </span>
                                {item.eventTime && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {item.eventTime}
                                  </span>
                                )}
                                {item.eventLocation && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {item.eventLocation}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">
                                {formatDate(item.publishedAt)}
                              </span>
                              <span className="text-[#1e40af] group-hover:text-[#1e3a8a] font-medium flex items-center">
                                Read More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All Items Grid */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {activeFilter === 'events' ? 'Upcoming Events' : 
                   activeFilter === 'news' ? 'News & Announcements' : 'All Updates'}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allItems.filter(item => activeFilter !== 'all' || !item.isFeatured).map((item) => (
                    <Link key={item.id} href={`/news/${item.id}`}>
                      <Card className="overflow-hidden border border-gray-200 hover:border-[#1e40af] hover:shadow-lg transition-all duration-300 group h-full">
                        <div className="relative h-40">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${
                              item.type === 'event' ? 'bg-gradient-to-br from-[#1e40af] to-[#0891b2]' :
                              item.type === 'announcement' ? 'bg-gradient-to-br from-[#0891b2] to-cyan-500' :
                              'bg-gradient-to-br from-gray-700 to-gray-900'
                            }`}>
                              {item.type === 'event' ? (
                                <Calendar className="w-12 h-12 text-white/80" />
                              ) : item.type === 'announcement' ? (
                                <Megaphone className="w-12 h-12 text-white/80" />
                              ) : (
                                <FileText className="w-12 h-12 text-white/80" />
                              )}
                            </div>
                          )}
                          <Badge className={`absolute top-3 left-3 ${
                            item.type === 'event' ? 'bg-[#1e40af]' : 
                            item.type === 'announcement' ? 'bg-[#0891b2]' : 'bg-gray-800'
                          } text-white text-xs`}>
                            {item.type}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1e40af] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.summary}</p>
                          {item.type === 'event' && item.eventDate && (
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.eventDate)}
                              </span>
                              {item.eventLocation && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.eventLocation}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-400">
                              {formatDate(item.publishedAt)}
                            </span>
                            <span className="text-[#1e40af] group-hover:text-[#1e3a8a] text-xs font-medium flex items-center">
                              Read More <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <SharedFooter />
    </div>
  )
}
