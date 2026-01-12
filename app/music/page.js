'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Music, Headphones, Play, Pause, ShoppingCart, Search, Filter, Loader2
} from 'lucide-react'

export default function MusicPage() {
  const [music, setMusic] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [playingId, setPlayingId] = useState(null)
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        await fetch('/api/seed', { method: 'POST' })
        const res = await fetch('/api/music')
        const data = await res.json()
        setMusic(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMusic()
  }, [])

  const genres = ['all', ...new Set(music.map(m => m.genre).filter(Boolean))]

  const filteredMusic = music.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.artist.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || m.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  const handlePurchase = (track) => {
    setSelectedTrack(track)
    setPurchaseDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SharedNavigation currentPage="music" />

      {/* Hero with Background Image */}
      <section className="relative py-24 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551696785-927d4ac2d35b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxjb25jZXJ0JTIwcGVyZm9ybWFuY2V8ZW58MHx8fHwxNzY4MjQ4MTI0fDA&ixlib=rb-4.1.0&q=85"
            alt="Concert Performance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/80 to-purple-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <Headphones className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/90">Music Store</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Music Collection</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Experience the power of acapella worship. Purchase and download our original compositions and hymns.
          </p>
        </div>
      </section>

      {/* Featured Album */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-white/20 text-white mb-4">Featured Album</Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Unfathomable Love</h3>
                <p className="text-white/80 mb-6">
                  Our debut album released in 2019, featuring original compositions that showcase the beauty of four-part harmony.
                </p>
                <Button className="bg-white text-purple-600 hover:bg-white/90">
                  <Play className="mr-2 h-4 w-4" /> Listen Now
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Music className="w-20 h-20 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Music Grid */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMusic.map((track) => (
              <Card key={track.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative aspect-square">
                  <img
                    src={track.coverImage || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl"
                      onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                    >
                      {playingId === track.id ? (
                        <Pause className="w-6 h-6 text-purple-600" />
                      ) : (
                        <Play className="w-6 h-6 text-purple-600 ml-1" />
                      )}
                    </button>
                  </div>
                  {track.isHymn && <Badge className="absolute top-3 left-3 bg-amber-500">Hymn</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-1">{track.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{track.artist}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{track.album || 'Single'}</span>
                    <span>{formatDuration(track.duration)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <span className="text-lg font-bold text-purple-600">{formatCurrency(track.price)}</span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handlePurchase(track)}>
                    <ShoppingCart className="w-4 h-4 mr-1" /> Buy
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredMusic.length === 0 && (
            <div className="text-center py-16">
              <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No music found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Purchase Dialog */}
      <PurchaseDialog track={selectedTrack} open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen} />

      <SharedFooter />
    </div>
  )
}

function PurchaseDialog({ track, open, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handlePurchase = async () => {
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ musicId: track.id, guestEmail: email })
      })
      if (!res.ok) throw new Error('Purchase failed')
      toast.success('Purchase successful!', { description: 'Download link sent to your email.' })
      onOpenChange(false)
    } catch (error) {
      toast.error('Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount || 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Music</DialogTitle>
          <DialogDescription>Complete your purchase</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-4 py-4 px-4 bg-gray-50 rounded-xl">
          <img src={track?.coverImage || ''} alt={track?.title} className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <h3 className="font-semibold">{track?.title}</h3>
            <p className="text-sm text-gray-500">{track?.artist}</p>
            <p className="font-bold text-purple-600">{formatCurrency(track?.price)}</p>
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email for download link</Label>
          <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handlePurchase} disabled={loading || !email} className="bg-purple-600 hover:bg-purple-700">
            {loading ? 'Processing...' : 'Complete Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
