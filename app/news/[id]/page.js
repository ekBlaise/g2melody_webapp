'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Calendar, Clock, MapPin, Play, ArrowLeft, Share2, Facebook, Twitter,
  Copy, Image as ImageIcon, Video, ChevronLeft, ChevronRight, X, Loader2
} from 'lucide-react'
import { toast } from 'sonner'

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mediaModal, setMediaModal] = useState({ open: false, type: null, index: 0 })

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/activities/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setActivity(data)
        } else {
          // Use sample data
          const sample = sampleActivities.find(a => a.id === params.id)
          if (sample) {
            setActivity(sample)
          } else {
            router.push('/news')
          }
        }
      } catch (error) {
        const sample = sampleActivities.find(a => a.id === params.id)
        if (sample) {
          setActivity(sample)
        } else {
          router.push('/news')
        }
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchActivity()
  }, [params.id, router])

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

  const handleShare = async (platform) => {
    const url = window.location.href
    const text = `${activity?.title} - G2 Melody`
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied!')
      return
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    }
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  const isPast = activity && new Date(activity.date) < new Date()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
      </div>
    )
  }

  if (!activity) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="news" />

      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={activity.coverImage || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 right-4 md:top-6 md:right-8">
          <Link href="/news">
            <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            <Badge className={`mb-4 ${
              activity.type === 'concert' ? 'bg-purple-500' :
              activity.type === 'workshop' ? 'bg-blue-500' :
              activity.type === 'outreach' ? 'bg-green-500' :
              'bg-rose-500'
            }`}>
              {isPast ? 'Past Event' : activity.type}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{activity.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(activity.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{formatTime(activity.date)}</span>
              </div>
              {activity.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{activity.venue}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {activity.description}
                </p>
                {activity.fullDescription && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mt-4">
                    {activity.fullDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Photo Gallery */}
            {activity.images && activity.images.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-rose-500" /> Photos
                  </h2>
                  <span className="text-gray-500 text-sm">{activity.images.length} photos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {activity.images.map((img, index) => (
                    <div 
                      key={index}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setMediaModal({ open: true, type: 'image', index })}
                    >
                      <img
                        src={img.url || `https://images.unsplash.com/photo-${1500000000000 + index}?w=400`}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {activity.videos && activity.videos.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-500" /> Videos
                  </h2>
                  <span className="text-gray-500 text-sm">{activity.videos.length} videos</span>
                </div>
                <div className="grid gap-4">
                  {activity.videos.map((video, index) => (
                    <div 
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 cursor-pointer group"
                      onClick={() => setMediaModal({ open: true, type: 'video', index })}
                    >
                      <img
                        src={video.thumbnail || activity.coverImage}
                        alt={`Video ${index + 1}`}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      {video.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
                          <p className="text-white font-medium">{video.title}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="font-bold text-lg mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(activity.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{formatTime(activity.date)}</p>
                  </div>
                </div>

                {activity.venue && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium">{activity.venue}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t mt-6 pt-6">
                <p className="text-sm text-gray-500 mb-3">Share this event</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare('copy')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isPast && (
                <Button className="w-full mt-6 bg-rose-500 hover:bg-rose-600">
                  Add to Calendar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal 
        open={mediaModal.open}
        onClose={() => setMediaModal({ ...mediaModal, open: false })}
        type={mediaModal.type}
        index={mediaModal.index}
        images={activity.images || []}
        videos={activity.videos || []}
        onNavigate={(newIndex) => setMediaModal({ ...mediaModal, index: newIndex })}
      />

      <SharedFooter />
    </div>
  )
}

function MediaModal({ open, onClose, type, index, images, videos, onNavigate }) {
  const items = type === 'image' ? images : videos
  const currentItem = items[index]

  if (!open || !currentItem) return null

  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black/95 border-0">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="relative">
          {type === 'image' ? (
            <img
              src={currentItem.url || currentItem}
              alt={`Image ${index + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <video
              src={currentItem.url || currentItem}
              controls
              autoPlay
              className="w-full max-h-[80vh]"
            />
          )}

          {/* Navigation */}
          {hasPrev && (
            <button
              onClick={() => onNavigate(index - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => onNavigate(index + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
          {index + 1} / {items.length}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Sample data
const sampleActivities = [
  {
    id: 'act-1',
    title: 'Christmas Cantata 2024',
    description: 'Join us for our annual Christmas cantata featuring traditional carols and original compositions celebrating the birth of Christ.',
    fullDescription: 'This year\'s Christmas Cantata promises to be our most spectacular yet. Featuring over 30 choir members, we will perform a mix of traditional Christmas carols, contemporary worship songs, and original compositions by our talented members.\n\nThe program includes:\n- Traditional carols in four-part harmony\n- Original compositions from our "Unfathomable Love" album\n- Special solo performances\n- Congregational hymn singing\n\nAll are welcome to attend this free event. A love offering will be collected to support our ongoing ministry work.',
    type: 'concert',
    date: '2024-12-22T18:00:00',
    venue: 'Church of Christ Bomaka, Buea',
    coverImage: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800',
    images: [
      { url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600' },
      { url: 'https://images.unsplash.com/photo-1482575832494-771f74bf6857?w=600' },
      { url: 'https://images.unsplash.com/photo-1511715282680-fbf93a50e721?w=600' }
    ],
    videos: [
      { url: '', title: 'Christmas Cantata Highlights', thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600' }
    ]
  },
  {
    id: 'act-2',
    title: 'Vocal Training Workshop',
    description: 'A comprehensive workshop on vocal techniques, breathing exercises, and four-part harmony basics for aspiring singers.',
    type: 'workshop',
    date: '2025-01-15T14:00:00',
    venue: 'G2 Melody Training Center',
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    images: [
      { url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600' }
    ],
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
    id: 'act-5',
    title: 'Annual General Meeting 2024',
    description: 'Our annual meeting to review the year, celebrate achievements, and plan for the future.',
    type: 'meeting',
    date: '2024-11-30T14:00:00',
    venue: 'G2 Melody Office',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    images: [
      { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600' },
      { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600' },
      { url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600' }
    ],
    videos: [
      { url: '', title: 'AGM 2024 Recap', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600' }
    ]
  },
  {
    id: 'act-6',
    title: 'Unfathomable Love Album Launch',
    description: 'The official launch of our debut album "Unfathomable Love" with live performances.',
    type: 'concert',
    date: '2019-08-15T17:00:00',
    venue: 'Multipurpose Hall, Buea',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    images: [
      { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600' },
      { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600' },
      { url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600' },
      { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600' }
    ],
    videos: [
      { url: '', title: 'Album Launch Highlights', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600' },
      { url: '', title: 'Live Performance', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600' }
    ]
  }
]
