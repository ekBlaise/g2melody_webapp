'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import { Calendar, Clock, MapPin, ArrowRight, Megaphone, FileText, Loader2, Newspaper, CalendarDays } from 'lucide-react'

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
          setNews(data.filter(n => n.type !== 'event'))
          setEvents(data.filter(n => n.type === 'event'))
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
    ? [...news, ...events].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    : activeFilter === 'events' 
      ? events 
      : news

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SharedNavigation currentPage="news" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              News & Events
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest happenings, announcements, and upcoming events from G2 Melody
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4">
            {[
              { id: 'all', label: 'All Updates', icon: Newspaper },
              { id: 'news', label: 'News & Announcements', icon: Megaphone },
              { id: 'events', label: 'Upcoming Events', icon: CalendarDays }
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'outline'}
                className={activeFilter === filter.id ? 'bg-amber-500 hover:bg-amber-600' : ''}
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
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : allItems.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No updates yet</h3>
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
                      <Card key={item.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow group">
                        <div className="relative h-56">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                              {item.type === 'event' ? (
                                <Calendar className="w-16 h-16 text-white/80" />
                              ) : (
                                <Megaphone className="w-16 h-16 text-white/80" />
                              )}
                            </div>
                          )}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className={`${
                              item.type === 'event' ? 'bg-blue-500' : 
                              item.type === 'announcement' ? 'bg-amber-500' : 'bg-gray-800'
                            } text-white`}>
                              {item.type}
                            </Badge>
                            <Badge className="bg-purple-500 text-white">Featured</Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
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
                            <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                              Read More <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
                    <Card key={item.id} className="overflow-hidden border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all group">
                      <div className="relative h-40">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            item.type === 'event' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            item.type === 'announcement' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
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
                          item.type === 'event' ? 'bg-blue-500' : 
                          item.type === 'announcement' ? 'bg-amber-500' : 'bg-gray-800'
                        } text-white text-xs`}>
                          {item.type}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
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
                          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 text-xs h-7">
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
