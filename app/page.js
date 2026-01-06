'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Music, Heart, Users, Calendar, ChevronRight, Play, Pause, ShoppingCart,
  Menu, X, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube,
  Target, Clock, DollarSign, Download, Search, Filter, Star, Award,
  Mic2, BookOpen, Headphones, Gift, ArrowRight, CheckCircle2
} from 'lucide-react'

// Navigation Component
function Navigation({ isScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>G2 Melody</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#projects" className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>Projects</a>
            <a href="#music" className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>Music Store</a>
            <a href="#about" className={`font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>About</a>
            <Link href="/login">
              <Button variant={isScrolled ? 'outline' : 'secondary'} size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Join Us</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className={isScrolled ? 'text-gray-900' : 'text-white'} /> : <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-xl p-4 mt-2 space-y-4">
            <a href="#projects" className="block py-2 text-gray-700 hover:text-blue-600">Projects</a>
            <a href="#music" className="block py-2 text-gray-700 hover:text-blue-600">Music Store</a>
            <a href="#about" className="block py-2 text-gray-700 hover:text-blue-600">About</a>
            <div className="flex space-x-2 pt-4">
              <Link href="/login" className="flex-1"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link href="/register" className="flex-1"><Button className="w-full bg-blue-600">Join Us</Button></Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/9182272/pexels-photo-9182272.jpeg"
          alt="Choir Performance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <Badge className="mb-6 bg-blue-600/20 text-blue-200 border-blue-400/30">
            <Music className="w-3 h-3 mr-1" /> Excellence in Worship
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Lifting Hearts Through <span className="text-blue-400">Gospel Music</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            G2 Melody is Cameroon's premier choir dedicated to spreading the gospel through excellence in worship, community building, and music education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#projects">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                <Heart className="mr-2 h-5 w-5" /> Support Our Projects
              </Button>
            </a>
            <a href="#music">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                <Headphones className="mr-2 h-5 w-5" /> Explore Music
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-gray-300">Choir Members</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">100+</div>
              <div className="text-gray-300">Performances</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">15+</div>
              <div className="text-gray-300">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Projects Section
function ProjectsSection({ projects, onDonate }) {
  const currentProjects = projects.filter(p => p.status === 'CURRENT')
  const pastProjects = projects.filter(p => p.status === 'PAST')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  const getProgress = (current, goal) => Math.min((current / goal) * 100, 100)

  const getDaysLeft = (deadline) => {
    if (!deadline) return null
    const diff = new Date(deadline) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700">
            <Target className="w-3 h-3 mr-1" /> Our Initiatives
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Support Our Projects</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help G2 Melody continue spreading the gospel through music. Every contribution makes a difference.
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="current">Current Projects ({currentProjects.length})</TabsTrigger>
            <TabsTrigger value="past">Completed ({pastProjects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image || 'https://images.pexels.com/photos/444658/pexels-photo-444658.jpeg'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.deadline && (
                      <Badge className="absolute top-4 right-4 bg-orange-500">
                        <Clock className="w-3 h-3 mr-1" /> {getDaysLeft(project.deadline)} days left
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={getProgress(project.currentAmount, project.goalAmount)} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-blue-600">{formatCurrency(project.currentAmount)}</span>
                        <span className="text-gray-500">of {formatCurrency(project.goalAmount)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {project._count?.donations || 0} donors
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => onDonate(project)}>
                      <Heart className="mr-2 h-4 w-4" /> Donate Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden opacity-90">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image || 'https://images.pexels.com/photos/444658/pexels-photo-444658.jpeg'}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale-[30%]"
                    />
                    <Badge className="absolute top-4 right-4 bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-green-600">Goal Reached!</span>
                      <span className="text-gray-500">{formatCurrency(project.goalAmount)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

// Music Store Section
function MusicStoreSection({ music, onPurchase }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [playingId, setPlayingId] = useState(null)

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

  return (
    <section id="music" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700">
            <Headphones className="w-3 h-3 mr-1" /> Music Store
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Music Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Listen, purchase, and download our worship songs, hymns, and original compositions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search songs, artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full sm:w-48">
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

        {/* Music Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMusic.map((track) => (
            <Card key={track.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative aspect-square">
                <img
                  src={track.coverImage || 'https://images.unsplash.com/photo-1652626627227-acc5ce198876'}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                    {playingId === track.id ? (
                      <Pause className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Play className="w-6 h-6 text-blue-600 ml-1" />
                    )}
                  </div>
                </button>
                {track.isHymn && (
                  <Badge className="absolute top-3 left-3 bg-amber-500">Hymn</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{track.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{track.artist}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{track.album || 'Single'}</span>
                  <span>{formatDuration(track.duration)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="font-bold text-blue-600">{formatCurrency(track.price)}</span>
                <Button size="sm" onClick={() => onPurchase(track)}>
                  <ShoppingCart className="w-4 h-4 mr-1" /> Buy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredMusic.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No music found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-blue-600/20 text-blue-200 border-blue-400/30">
              <Users className="w-3 h-3 mr-1" /> About Us
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Who We Are</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              G2 Melody is a vibrant gospel choir based in Cameroon, dedicated to spreading the message of hope and salvation through excellent worship music. Founded with a passion for musical excellence and spiritual growth, we have grown into a community of talented musicians and singers united by faith.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mic2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Excellence in Worship</h3>
                  <p className="text-gray-400 text-sm">We strive for the highest standards in every performance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Music Education</h3>
                  <p className="text-gray-400 text-sm">Training the next generation of worship leaders.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Community Impact</h3>
                  <p className="text-gray-400 text-sm">Making a difference through music ministry.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Award Winning</h3>
                  <p className="text-gray-400 text-sm">Recognized for excellence in gospel music.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/10206936/pexels-photo-10206936.jpeg"
              alt="G2 Melody Community"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9</div>
                  <div className="text-gray-500 text-sm">Community Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">G2 Melody</span>
            </div>
            <p className="text-gray-400 mb-6">
              Excellence in worship, spreading the gospel through music from Cameroon to the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#music" className="hover:text-white transition-colors">Music Store</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Book the Choir</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>Douala, Cameroon</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>contact@g2melody.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <span>+237 6XX XXX XXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} G2 Melody. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Donation Dialog
function DonationDialog({ project, open, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    message: '',
    anonymous: false,
    paymentMethod: 'card'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          projectId: project.id
        })
      })

      if (!res.ok) throw new Error('Donation failed')

      toast.success('Thank you for your donation!', {
        description: 'Your support means the world to us.'
      })
      onOpenChange(false)
      setFormData({ amount: '', donorName: '', donorEmail: '', message: '', anonymous: false, paymentMethod: 'card' })
      // Reload to show updated amounts
      window.location.reload()
    } catch (error) {
      toast.error('Donation failed', { description: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const suggestedAmounts = [5000, 10000, 25000, 50000, 100000]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Donate to {project?.title}</DialogTitle>
          <DialogDescription>
            Your donation helps us achieve our goals. Every contribution matters!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Suggested Amounts */}
          <div>
            <Label className="mb-3 block">Quick Amount (XAF)</Label>
            <div className="grid grid-cols-5 gap-2">
              {suggestedAmounts.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                >
                  {(amount / 1000)}k
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="amount">Amount (XAF)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          {/* Donor Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="donorName">Your Name</Label>
              <Input
                id="donorName"
                placeholder="John Doe"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                className="mt-1"
                disabled={formData.anonymous}
              />
            </div>
            <div>
              <Label htmlFor="donorEmail">Email</Label>
              <Input
                id="donorEmail"
                type="email"
                placeholder="john@example.com"
                value={formData.donorEmail}
                onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Anonymous */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) => setFormData({ ...formData, anonymous: checked })}
            />
            <Label htmlFor="anonymous" className="text-sm text-gray-600">
              Make this donation anonymous
            </Label>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Leave a message of support..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Payment Method */}
          <div>
            <Label className="mb-3 block">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'card', label: 'Card', icon: '💳' },
                { id: 'momo', label: 'MTN MoMo', icon: '📱' },
                { id: 'orange', label: 'Orange Money', icon: '🍊' },
                { id: 'paypal', label: 'PayPal', icon: '🅿️' }
              ].map(method => (
                <Button
                  key={method.id}
                  type="button"
                  variant={formData.paymentMethod === method.id ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                >
                  <span className="mr-2">{method.icon}</span> {method.label}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Processing...' : 'Complete Donation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Purchase Dialog
function PurchaseDialog({ track, open, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          musicId: track.id,
          guestEmail: email
        })
      })

      if (!res.ok) throw new Error('Purchase failed')

      toast.success('Purchase successful!', {
        description: 'Your download link has been sent to your email.'
      })
      onOpenChange(false)
    } catch (error) {
      toast.error('Purchase failed', { description: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Music</DialogTitle>
          <DialogDescription>
            Complete your purchase to download this track.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <img
            src={track?.coverImage || 'https://images.unsplash.com/photo-1652626627227-acc5ce198876'}
            alt={track?.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold">{track?.title}</h3>
            <p className="text-sm text-gray-500">{track?.artist}</p>
            <p className="font-bold text-blue-600 mt-1">{formatCurrency(track?.price || 0)}</p>
          </div>
        </div>

        <div>
          <Label htmlFor="purchaseEmail">Email for download link</Label>
          <Input
            id="purchaseEmail"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={loading || !email} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Processing...' : 'Complete Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main App Component
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [projects, setProjects] = useState([])
  const [music, setMusic] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [donationDialogOpen, setDonationDialogOpen] = useState(false)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Seed data first
        await fetch('/api/seed', { method: 'POST' })
        
        // Fetch projects and music
        const [projectsRes, musicRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/music')
        ])
        
        const projectsData = await projectsRes.json()
        const musicData = await musicRes.json()
        
        setProjects(projectsData)
        setMusic(musicData)
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleDonate = (project) => {
    setSelectedProject(project)
    setDonationDialogOpen(true)
  }

  const handlePurchase = (track) => {
    setSelectedTrack(track)
    setPurchaseDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-950">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Music className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Loading G2 Melody...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation isScrolled={isScrolled} />
      <HeroSection />
      <ProjectsSection projects={projects} onDonate={handleDonate} />
      <MusicStoreSection music={music} onPurchase={handlePurchase} />
      <AboutSection />
      <Footer />

      {/* Dialogs */}
      {selectedProject && (
        <DonationDialog
          project={selectedProject}
          open={donationDialogOpen}
          onOpenChange={setDonationDialogOpen}
        />
      )}
      {selectedTrack && (
        <PurchaseDialog
          track={selectedTrack}
          open={purchaseDialogOpen}
          onOpenChange={setPurchaseDialogOpen}
        />
      )}
    </div>
  )
}
