'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Music, Headphones, Play, Pause, ShoppingCart, Search, Loader2, 
  Download, Disc3, Clock, ArrowLeft, X, Volume2
} from 'lucide-react'

export default function MusicPage() {
  const [music, setMusic] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [playingTrack, setPlayingTrack] = useState(null)
  const [purchaseDialog, setPurchaseDialog] = useState({ open: false, item: null, type: 'track' })
  const audioRef = useRef(null)

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        await fetch('/api/seed', { method: 'POST' })
        const res = await fetch('/api/music')
        const data = await res.json()
        setMusic(data)
        
        // Group by albums
        const albumsMap = new Map()
        data.forEach(track => {
          const albumName = track.album || 'Singles'
          if (!albumsMap.has(albumName)) {
            albumsMap.set(albumName, {
              name: albumName,
              artist: track.artist,
              coverImage: track.coverImage,
              tracks: [],
              totalPrice: 0,
              releaseDate: track.releaseDate
            })
          }
          const album = albumsMap.get(albumName)
          album.tracks.push(track)
          album.totalPrice += track.price
        })
        setAlbums(Array.from(albumsMap.values()))
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMusic()
  }, [])

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  const getTotalDuration = (tracks) => {
    const total = tracks.reduce((acc, t) => acc + (t.duration || 0), 0)
    const mins = Math.floor(total / 60)
    return `${mins} min`
  }

  const handlePlay = (track) => {
    if (playingTrack?.id === track.id) {
      setPlayingTrack(null)
    } else {
      setPlayingTrack(track)
    }
  }

  const handlePurchase = (item, type = 'track') => {
    setPurchaseDialog({ open: true, item, type })
  }

  const filteredAlbums = albums.filter(album => 
    album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.tracks.some(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e40af]-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SharedNavigation currentPage="music" />

      {/* Hero */}
      <section className="relative pt-24 pb-12 mt-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551696785-927d4ac2d35b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxjb25jZXJ0JTIwcGVyZm9ybWFuY2V8ZW58MHx8fHwxNzY4MjQ4MTI0fDA&ixlib=rb-4.1.0&q=85"
            alt="Concert Performance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-purple-300">Music Collection</span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
            Experience the power of acapella worship. Stream our music for free, or purchase to download high-quality tracks.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search albums or songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur"
            />
          </div>
        </div>
      </section>

      {/* Album View or Grid View */}
      {selectedAlbum ? (
        <AlbumDetail 
          album={selectedAlbum} 
          onBack={() => setSelectedAlbum(null)}
          onPlay={handlePlay}
          onPurchase={handlePurchase}
          playingTrack={playingTrack}
          formatDuration={formatDuration}
          formatCurrency={formatCurrency}
        />
      ) : (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Albums & Collections</h2>
                <p className="text-gray-500">{albums.length} albums available</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredAlbums.map((album, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg group-hover:shadow-xl transition-all">
                    <img
                      src={album.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#1e40af]-500 flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/60 text-white text-xs">
                      {album.tracks.length} tracks
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-[#1e40af]-600 transition-colors">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{album.artist}</p>
                  <p className="text-sm font-medium text-[#1e40af]-600 mt-1">
                    {formatCurrency(album.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            {filteredAlbums.length === 0 && (
              <div className="text-center py-16">
                <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No albums found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Purchase Dialog */}
      <PurchaseDialog 
        open={purchaseDialog.open}
        onOpenChange={(open) => setPurchaseDialog({ ...purchaseDialog, open })}
        item={purchaseDialog.item}
        type={purchaseDialog.type}
        formatCurrency={formatCurrency}
      />

      <SharedFooter />
    </div>
  )
}

// Album Detail Component
function AlbumDetail({ album, onBack, onPlay, onPurchase, playingTrack, formatDuration, formatCurrency }) {
  const getTotalDuration = () => {
    const total = album.tracks.reduce((acc, t) => acc + (t.duration || 0), 0)
    const mins = Math.floor(total / 60)
    return `${mins} min`
  }

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Albums
        </button>

        {/* Album Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <img
              src={album.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'}
              alt={album.name}
              className="w-full aspect-square rounded-2xl shadow-xl object-cover"
            />
          </div>
          <div className="flex flex-col justify-end">
            <Badge className="w-fit mb-3 bg-[#1e40af]-100 text-[#1e40af]-700">Album</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{album.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{album.artist}</p>
            <div className="flex items-center gap-4 text-gray-500 mb-6">
              <span className="flex items-center">
                <Disc3 className="w-4 h-4 mr-1" /> {album.tracks.length} songs
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" /> {getTotalDuration()}
              </span>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-gradient-to-r from-[#1e40af] to-[#0891b2] hover:from-[#1e3a8a] hover:to-cyan-700"
                onClick={() => onPurchase(album, 'album')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Album - {formatCurrency(album.totalPrice)}
              </Button>
              <Button variant="outline" onClick={() => onPlay(album.tracks[0])}>
                <Play className="w-4 h-4 mr-2" />
                Play All
              </Button>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3 text-sm font-medium text-gray-500 border-b">
            <span>#</span>
            <span>Title</span>
            <span className="text-right">Duration</span>
            <span className="text-right">Price</span>
          </div>
          <div className="divide-y divide-gray-100">
            {album.tracks.map((track, index) => (
              <div 
                key={track.id}
                className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-gray-100 transition-colors group ${
                  playingTrack?.id === track.id ? 'bg-[#1e40af]-50' : ''
                }`}
              >
                <span className="w-8 text-center">
                  <button 
                    onClick={() => onPlay(track)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1e40af]-100 transition-colors"
                  >
                    {playingTrack?.id === track.id ? (
                      <Pause className="w-4 h-4 text-[#1e40af]-600" />
                    ) : (
                      <span className="group-hover:hidden text-gray-400">{index + 1}</span>
                    )}
                    {playingTrack?.id !== track.id && (
                      <Play className="w-4 h-4 text-[#1e40af]-600 hidden group-hover:block" />
                    )}
                  </button>
                </span>
                <div>
                  <p className={`font-medium ${playingTrack?.id === track.id ? 'text-[#1e40af]-600' : 'text-gray-900'}`}>
                    {track.title}
                  </p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </div>
                <span className="text-gray-500 text-right">{formatDuration(track.duration)}</span>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[#1e40af]-600 font-medium">{formatCurrency(track.price)}</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPurchase(track, 'track')
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 p-4 bg-[#1e40af]-50 rounded-xl border border-amber-200">
          <p className="text-sm text-[#1e40af]-800">
            <strong>Copyright Notice:</strong> All music is available for streaming. To download high-quality files, 
            please purchase the individual tracks or the complete album. Digital downloads are for personal use only.
          </p>
        </div>
      </div>
    </section>
  )
}

// Purchase Dialog
function PurchaseDialog({ open, onOpenChange, item, type, formatCurrency }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  if (!item) return null

  const isAlbum = type === 'album'
  const price = isAlbum ? item.totalPrice : item.price
  const title = isAlbum ? item.name : item.title

  const handlePurchase = async () => {
    if (!email) return
    setLoading(true)
    try {
      if (isAlbum) {
        for (const track of item.tracks) {
          await fetch('/api/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ musicId: track.id, guestEmail: email })
          })
        }
      } else {
        await fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ musicId: item.id, guestEmail: email })
        })
      }
      toast.success('Purchase successful!', { 
        description: 'Download links have been sent to your email.' 
      })
      onOpenChange(false)
      setEmail('')
    } catch (error) {
      toast.error('Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {isAlbum ? 'Album' : 'Track'}</DialogTitle>
          <DialogDescription>Complete your purchase to download</DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <img 
            src={isAlbum ? item.coverImage : item.coverImage || ''} 
            alt={title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">
              {isAlbum ? `${item.tracks.length} tracks` : item.artist}
            </p>
            <p className="font-bold text-[#1e40af]-600 mt-1">{formatCurrency(price)}</p>
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email for download link</Label>
          <Input 
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <p><strong>Note:</strong> Digital downloads are for personal use only. 
          Download links will be sent to your email after payment.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handlePurchase} 
            disabled={loading || !email}
            className="bg-gradient-to-r from-[#1e40af] to-[#0891b2] hover:from-[#1e3a8a] hover:to-cyan-700"
          >
            {loading ? 'Processing...' : `Pay ${formatCurrency(price)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

