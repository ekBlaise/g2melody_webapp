'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import {
  Music, Heart, Users, Calendar, ChevronRight, Play, Pause, ShoppingCart,
  Menu, X, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube,
  Target, Clock, DollarSign, Download, Search, Filter, Star, Award,
  Mic2, BookOpen, Headphones, Gift, ArrowRight, CheckCircle2, GraduationCap,
  Church, Globe, Sparkles, Quote, ChevronDown, Send, MessageCircle,
  Video, FileText, Zap, Shield, Users2, Building, Lightbulb, HandHeart
} from 'lucide-react'

// Navigation Component
function Navigation({ isScrolled, activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/music', label: 'Music' },
    { href: '/news', label: 'News' },
    { href: '/learn', label: 'Learn Muzik' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="G2 Melody" 
              className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
            />
            <span className={`hidden sm:block text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>G2 Melody</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className={isScrolled ? 'text-gray-700' : 'text-white hover:bg-white/10'}>
                Sign In
              </Button>
            </Link>
            <Link href="/join">
              <Button size="sm" className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Join G2 Melody
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-2xl p-6 mt-2 mb-4 animate-in slide-in-from-top-5">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-xl text-gray-700 hover:bg-[#1e40af]/10 hover:text-[#1e40af] font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex space-x-3 pt-6 mt-6 border-t">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a]">Join Us</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Hero Section
function HeroSection({ siteSettings }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      image: 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg',
      title: 'Evangelizing ',
      titleColored: 'Through',
      highlight: 'Music',
      subtitle: 'Uniting voices in worship, spreading the Gospel across Cameroon and beyond'
    },
    {
      image: 'https://images.unsplash.com/photo-1541697367348-dfc31a1611dc',
      title: 'Revitalizing',
      highlight: 'Church Music',
      highlightParts: [{text: 'Church', colored: false}, ' ', {text: 'Music', colored: true}],
      subtitle: 'Preserving acapella heritage while nurturing the next generation of worship leaders'
    },
    {
      image: 'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg',
      title: 'Training Future',
      highlight: 'Worship Leaders',
      subtitle: 'Developing talents through structured music education and spiritual growth'
    },
    {
      image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
      title: 'Building',
      highlight: 'Community',
      subtitle: 'Bringing together individuals from diverse backgrounds united by faith and music'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover scale-105"
          />
        </div>
      ))}
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#1e40af]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1e40af]/15 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.9]">
            {slides[currentSlide].title}
            {slides[currentSlide].titleColored && (
              <span className="font-bold bg-gradient-to-r from-[#1e40af] to-[#0891b2] text-transparent bg-clip-text">
                {slides[currentSlide].titleColored}
              </span>
            )}{' '}
            {slides[currentSlide].highlightParts ? (
              slides[currentSlide].highlightParts.map((part, i) => 
                typeof part === 'string' ? part : (
                  <span key={i} className={part.colored === false ? 'text-white' : 'font-bold bg-gradient-to-r from-[#1e40af] to-[#0891b2] text-transparent bg-clip-text'}>
                    {part.text}
                  </span>
                )
              )
            ) : (
              <span className="font-bold bg-gradient-to-r from-[#1e40af] to-[#0891b2] text-transparent bg-clip-text">
                {slides[currentSlide].highlight}
              </span>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/projects">
              <Button size="lg" className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-lg transition-all duration-300 group">
                <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Support Our Mission
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl">
                <GraduationCap className="mr-2 h-5 w-5" />
                Learn Muzik
              </Button>
            </Link>
          </div>

          {/* Stats - Now dynamic from siteSettings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2016', label: 'Founded', icon: Calendar },
              { value: `${siteSettings?.memberCount || 50}+`, label: 'Members', icon: Users },
              { value: '4-Part', label: 'Harmony', icon: Music },
              { value: '∞', label: 'Faith', icon: Heart },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <stat.icon className="w-6 h-6 text-[#1e40af] mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about" className="flex flex-col items-center text-white/60 hover:text-white transition-colors">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  const coreValues = [
    { icon: Shield, title: 'Holiness', desc: 'Walking in righteousness and spiritual purity' },
    { icon: HandHeart, title: 'Stewardship', desc: 'Faithful management of God-given talents' },
    { icon: Users2, title: 'Teamwork', desc: 'Unity in purpose and collaborative excellence' },
    { icon: Heart, title: 'Agape Love', desc: 'Unconditional Christ-like love for all' },
    { icon: Shield, title: 'Discipline', desc: 'Commitment to growth and accountability' },
  ]

  const objectives = [
    { icon: Mic2, title: 'Evangelism Through Music', titleParts: ['Evangelism ', {text: 'Through Music', colored: true}], desc: 'Using non-instrumental singing to spread the Gospel of Christ' },
    { icon: Sparkles, title: 'Spiritual Devotion', desc: 'Serving as a beacon of faith and commitment to God\'s work' },
    { icon: Users, title: 'Unity in Diversity', desc: 'Bringing together individuals from diverse backgrounds' },
    { icon: Music, title: 'Revitalize Church Music', titleParts: ['Revitalize ', {text: 'Church', colored: false}, ' Music'], desc: 'Promoting mastery of four-part harmony and acapella traditions' },
    { icon: GraduationCap, title: 'Music Education', desc: 'Developing talents through structured professional training' },
    { icon: Globe, title: 'Global Outreach', desc: 'Spreading worship across Cameroon and beyond' },
  ]

  return (
    <section id="about" className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent opacity-50" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1e40af]/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#0891b2]/20 text-[#0891b2] px-4 py-1.5 text-sm font-medium border border-[#0891b2]/30">
            About Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Gospel Guardians{' '}
            <span className="text-[#1e40af] font-bold">Melody</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded in late 2016, G2 Melody originated from "Melodious Voices" of The Church of Christ Muea, 
            evolving into a powerful force for musical evangelism and worship excellence.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="border-0 shadow-xl bg-[#1e40af] text-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Target className="w-7 h-7" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed">
                Evangelizing <span className="bg-gradient-to-r from-[#1e40af] to-[#0891b2] text-transparent bg-clip-text font-semibold">through music</span>, uniting individuals under a shared purpose, revitalizing church music, 
                and exemplifying spiritual devotion rooted in the doctrine of Christ and the musical heritage of the Church, 
                while extending Christ's love to individuals from diverse backgrounds.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Lightbulb className="w-7 h-7" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed">
                A future where the musical landscape of the Church is revitalized, young choirs are nurtured, 
                and music-driven evangelism plays a central role in spreading the Gospel across Cameroon and beyond. 
                We envision establishing a music academy and nurturing worship leaders globally.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Objectives Grid */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">What We Do</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#1e40af]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <obj.icon className="w-6 h-6 text-[#1e40af]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {obj.titleParts ? (
                    obj.titleParts.map((part, i) => 
                      typeof part === 'string' ? part : (
                        <span key={i} className={part.colored ? 'bg-gradient-to-r from-[#1e40af] to-[#0891b2] text-transparent bg-clip-text font-bold' : ''}>
                          {part.text}
                        </span>
                      )
                    )
                  ) : obj.title}
                </h4>
                <p className="text-gray-600 text-sm">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gray-200 rounded-3xl p-8 md:p-12 text-gray-900">
          <h3 className="text-2xl font-bold text-center mb-10">Our Core Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {coreValues.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#1e40af]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1e40af] transition-all duration-300">
                  <value.icon className="w-7 h-7 text-[#1e40af] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-semibold mb-1">{value.title}</h4>
                <p className="text-xs text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Projects Section
function ProjectsSection({ projects, onDonate }) {
  // Get total counts for tabs
  const allCurrentProjects = projects.filter(p => p.status === 'CURRENT')
  const allPastProjects = projects.filter(p => p.status === 'PAST')
  
  // Limit to 3 projects for homepage display
  const currentProjects = allCurrentProjects.slice(0, 3)
  const pastProjects = allPastProjects.slice(0, 3)

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
    <section id="projects" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#0891b2]/20 text-[#0891b2] px-4 py-1.5 border border-[#0891b2]/30">
            <Target className="w-3 h-3 mr-1" /> Our Projects
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Support Our <span className="text-[#1e40af]">Mission</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your generous contributions help us spread the Gospel through music and nurture the next generation of worship leaders.
          </p>
        </div>

        {/* Current Projects */}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 p-1 bg-gray-100 rounded-xl">
            <TabsTrigger value="current" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              Active Projects ({allCurrentProjects.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              Completed ({allPastProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image || 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {project.deadline && (
                      <Badge className="absolute top-4 right-4 bg-[#1e40af] shadow-lg">
                        <Clock className="w-3 h-3 mr-1" /> {getDaysLeft(project.deadline)} days left
                      </Badge>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <Progress value={getProgress(project.currentAmount, project.goalAmount)} className="h-2 bg-white/30" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-2xl font-bold text-[#1e40af]">{formatCurrency(project.currentAmount)}</p>
                        <p className="text-sm text-gray-500">of {formatCurrency(project.goalAmount)} goal</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{Math.round(getProgress(project.currentAmount, project.goalAmount))}%</p>
                        <p className="text-xs text-gray-500">{project._count?.donations || 0} donors</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      className="flex-1 bg-[#1e40af] hover:bg-[#1e3a8a] shadow-lg" 
                      onClick={() => onDonate(project)}
                    >
                      <Heart className="mr-2 h-4 w-4" /> Donate
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden border-0 shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image || 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg'}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale-[30%]"
                    />
                    <Badge className="absolute top-4 right-4 bg-[#1e40af]">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <p className="text-[#1e40af] font-semibold">{formatCurrency(project.goalAmount)} raised</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* View All Projects Button */}
        <div className="text-center mt-10">
          <Link href="/projects">
            <Button size="lg" variant="outline" className="border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af]/10">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* G2 Meloverse Vision - Featured Section */}
        <div className="mt-20 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0">
            <img 
              src="/g2-meloverse.jpg" 
              alt="G2 Meloverse" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gray-900/70" />
          </div>
          <div className="relative p-8 md:p-16">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-[#1e40af] text-white border-[#1e40af]">
                <Building className="w-3 h-3 mr-1" /> Vision Project
              </Badge>
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">G2 Meloverse</h3>
              <p className="text-lg text-gray-300 mb-6">
                Our flagship vision project - a multi-purpose facility in Buea, Cameroon that will house:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: GraduationCap, title: 'G2 Music Academy', desc: 'Degree-granting institution' },
                  { icon: Mic2, title: 'Recording Studio', desc: 'Professional music production' },
                  { icon: Video, title: 'TV & Radio Station', desc: 'Gospel media broadcasting' },
                  { icon: Building, title: 'Multi-purpose Hall', desc: 'Events & community space' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3 bg-white/10 backdrop-blur rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1e40af]/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects/proj-meloverse">
                  <Button size="lg" className="bg-[#1e40af] text-white hover:bg-[#1e3a8a]">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <div className="text-white">
                  <p className="text-sm text-gray-400">Target Amount</p>
                  <p className="text-2xl font-bold">267,766,773 XAF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Music Store Section
function MusicStoreSection({ music, onPurchase }) {
  const [playingId, setPlayingId] = useState(null)

  // Limit to 4 music tracks for homepage display
  const displayedMusic = music.slice(0, 4)

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
    <section id="music" className="py-16 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#0891b2]/20 text-[#0891b2] px-4 py-1.5 border border-[#0891b2]/30">
            <Headphones className="w-3 h-3 mr-1" /> Music Store
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-purple-950">Music Collection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the power of acapella worship. Purchase and download our original compositions, hymns, and gospel tracks.
          </p>
        </div>

        {/* Album Highlight */}
        <div className="bg-purple-950 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-4">Featured Album</Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Unfathomable Love</h3>
              <p className="text-white/80 mb-6">
                Our debut album released in 2019, featuring original compositions that showcase the beauty of four-part harmony and acapella worship.
              </p>
              <Link href="/music">
                <Button className="bg-white text-purple-950 hover:bg-white/90">
                  <Play className="mr-2 h-4 w-4" /> Browse All Music
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Music className="w-24 h-24 text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Music Grid - Limited to 4 items per row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedMusic.map((track) => (
            <Card key={track.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative aspect-square">
                <img
                  src={track.coverImage || 'https://images.unsplash.com/photo-1652626627227-acc5ce198876'}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform"
                    onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                  >
                    {playingId === track.id ? (
                      <Pause className="w-5 h-5 text-[#1e40af]" />
                    ) : (
                      <Play className="w-5 h-5 text-[#1e40af] ml-0.5" />
                    )}
                  </button>
                </div>
                {track.isHymn && (
                  <Badge className="absolute top-2 left-2 bg-[#1e40af]-500 text-xs">Hymn</Badge>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm mb-1">{track.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{track.artist}</p>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex items-center justify-between">
                <span className="text-sm font-bold text-[#1e40af]">{formatCurrency(track.price)}</span>
                <Button size="sm" className="bg-[#1e40af] hover:bg-[#1e3a8a] h-7 text-xs px-2" onClick={() => onPurchase(track)}>
                  <ShoppingCart className="w-3 h-3 mr-1" /> Buy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {displayedMusic.length === 0 && (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No music available yet.</p>
          </div>
        )}

        {/* View All Music Button */}
        <div className="text-center mt-10">
          <Link href="/music">
            <Button size="lg" variant="outline" className="border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af]/10">
              View All Music <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Learn Muzik Section
function LearnMuzikSection() {
  const programs = [
    {
      icon: Mic2,
      title: 'Vocal Training',
      desc: 'Master the art of acapella singing with professional voice coaching',
      level: 'Beginner to Advanced',
      duration: '12 weeks'
    },
    {
      icon: Music,
      title: 'Four-Part Harmony',
      desc: 'Learn the fundamentals of SATB (Soprano, Alto, Tenor, Bass) arrangement',
      level: 'Intermediate',
      duration: '8 weeks'
    },
    {
      icon: BookOpen,
      title: 'Music Theory',
      desc: 'Understand the building blocks of music from notation to composition',
      level: 'All Levels',
      duration: '10 weeks'
    },
    {
      icon: FileText,
      title: 'Sight Reading',
      desc: 'Develop the ability to read and sing music at first sight',
      level: 'Beginner',
      duration: '6 weeks'
    },
    {
      icon: Users,
      title: 'Choir Leadership',
      desc: 'Learn to conduct, arrange, and lead worship teams effectively',
      level: 'Advanced',
      duration: '16 weeks'
    },
    {
      icon: Church,
      title: 'Worship Ministry',
      desc: 'Combine musical skills with spiritual leadership in worship settings',
      level: 'All Levels',
      duration: '8 weeks'
    },
  ]

  return (
    <section id="learn" className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#0891b2]/20 text-[#0891b2] px-4 py-1.5 border border-[#0891b2]/30">
            <GraduationCap className="w-3 h-3 mr-1" /> Learn Muzik
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Develop Your{' '}
            <span className="text-[#0891b2]">Musical Gift</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our structured music education program is designed to nurture your talents and equip you for worship leadership.
          </p>
        </div>

        {/* Feature Banner */}
        <div className="bg-[#1e40af] rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute right-20 top-10 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">G2 Melody Music Academy</h3>
              <p className="text-white/90 mb-6 text-lg">
                Our vision is to establish a full-fledged music academy in Cameroon that confers degrees in music studies. 
                Until then, we offer comprehensive training programs for aspiring musicians and worship leaders.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/join">
                  <Button className="bg-white text-[#1e40af] hover:bg-gray-100">
                    <GraduationCap className="mr-2 h-4 w-4" /> Enroll Now
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button className="bg-white/20 border-2 border-white text-white hover:bg-white/30">
                    View Curriculum
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold">100+</div>
                <div className="text-white/80">Students Trained</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold">6</div>
                <div className="text-white/80">Programs</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold">4-Part</div>
                <div className="text-white/80">Harmony Focus</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold">∞</div>
                <div className="text-white/80">Dedication</div>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-[#1e40af]/10 flex items-center justify-center mb-4 group-hover:bg-[#1e40af] transition-all duration-300">
                  <program.icon className="w-7 h-7 text-[#1e40af] group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-xl">{program.title}</CardTitle>
                <CardDescription>{program.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{program.level}</Badge>
                  <span className="text-gray-500">{program.duration}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full group-hover:bg-[#1e40af] group-hover:text-white group-hover:border-[#1e40af] transition-colors">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Ready to start your musical journey?</p>
          <Link href="/register">
            <Button size="lg" className="bg-[#1e40af] hover:bg-[#1e3a8a]">
              Join G2 Melody Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Message sent successfully!', {
      description: 'We\'ll get back to you as soon as possible.'
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <section id="contact" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#0891b2]/20 text-[#0891b2] px-4 py-1.5 border border-[#0891b2]/30">
            <MessageCircle className="w-3 h-3 mr-1" /> Contact Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get In <span className="text-[#0891b2]">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our ministry, music, or how to join? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-gray-400">Bomaka, Buea<br />South West Region, Cameroon</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-gray-400">g2melodycmr@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Church className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Affiliated Church</h4>
                    <p className="text-gray-400">The Church of Christ Bomaka</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-white/10">
                  <h4 className="font-semibold mb-4">Follow Us</h4>
                  <div className="flex space-x-3">
                    {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                      <a
                        key={index}
                        href="#"
                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#1e40af] transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card */}
            <Card className="border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-white" />
                  Book the Choir
                </CardTitle>
                <CardDescription>
                  Want G2 Melody to perform at your event?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  We're available for weddings, church programs, concerts, and special events. 
                  Contact us to discuss your requirements and get a quote.
                </p>
                <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a]">
                  Request Booking
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="booking">Event Booking</SelectItem>
                      <SelectItem value="music">Music Purchase</SelectItem>
                      <SelectItem value="donation">Donations</SelectItem>
                      <SelectItem value="learning">Learn Muzik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you?"
                    rows={5}
                    className="mt-1"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#1e40af] hover:bg-[#1e3a8a]"
                  disabled={sending}
                >
                  {sending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/g2melody', label: 'Facebook' },
    { icon: Youtube, href: 'https://www.youtube.com/@g2melody', label: 'YouTube' },
    { icon: Instagram, href: 'https://www.instagram.com/g2melody/', label: 'Instagram' },
    { icon: Music, href: 'https://www.tiktok.com/@g2melody_official', label: 'TikTok' }, // Using Music icon for TikTok
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img src="/logo.png" alt="G2 Melody" className="h-12 w-auto" />
              <div>
                <span className="text-xl font-bold text-white">G2 Melody</span>
                <p className="text-xs text-gray-500">Gospel Guardians Melody</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Evangelizing <span className="bg-gradient-to-r from-[#1e40af] to-[#0891b2] text-transparent bg-clip-text font-semibold">through music</span>, uniting voices in worship, and spreading the Gospel across Cameroon and beyond since 2016.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-[#1e40af] transition-colors" title={social.label}>
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'Our Projects', 'Music Store', 'Learn Muzik', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1 text-white" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Programs</h3>
            <ul className="space-y-3">
              {['Vocal Training', 'Four-Part Harmony', 'Music Theory', 'Choir Leadership', 'Worship Ministry'].map((item) => (
                <li key={item}>
                  <a href="#learn" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1 text-white" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span>Bomaka, Buea<br />Cameroon</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-white" />
                <span>g2melodycmr@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Church className="w-5 h-5 text-white" />
                <span>Church of Christ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} G2 Melody (Gospel Guardians Melody). All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Affiliated to Church of Christ Bomaka
            </p>
          </div>
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

      toast.success('Thank you for your generous donation!', {
        description: 'May God bless you abundantly.'
      })
      onOpenChange(false)
      setFormData({ amount: '', donorName: '', donorEmail: '', message: '', anonymous: false, paymentMethod: 'card' })
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
          <DialogTitle className="text-2xl">Support: {project?.title}</DialogTitle>
          <DialogDescription>
            Your donation helps us spread the Gospel through music. Every contribution matters!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="mb-3 block font-medium">Quick Amount (XAF)</Label>
            <div className="grid grid-cols-5 gap-2">
              {suggestedAmounts.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount.toString() ? 'default' : 'outline'}
                  size="sm"
                  className={formData.amount === amount.toString() ? 'bg-[#1e40af] hover:bg-[#1e3a8a]' : ''}
                  onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                >
                  {(amount / 1000)}k
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Custom Amount (XAF)</Label>
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

          <div>
            <Label className="mb-3 block font-medium">Payment Method</Label>
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
                  className={`justify-start ${formData.paymentMethod === method.id ? 'bg-[#1e40af] hover:bg-[#1e3a8a]' : ''}`}
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
            <Button type="submit" disabled={loading} className="bg-[#1e40af] hover:bg-[#1e3a8a]">
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
        description: 'Your download link will be sent to your email.'
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

        <div className="flex items-center space-x-4 py-4 px-4 bg-gray-50 rounded-xl">
          <img
            src={track?.coverImage || 'https://images.unsplash.com/photo-1652626627227-acc5ce198876'}
            alt={track?.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{track?.title}</h3>
            <p className="text-sm text-gray-500">{track?.artist}</p>
            <p className="font-bold text-purple-600 mt-1">{formatCurrency(track?.price || 0)}</p>
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
          <Button onClick={handlePurchase} disabled={loading || !email} className="bg-[#1e40af] hover:bg-[#1e3a8a]">
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
  const [activeSection, setActiveSection] = useState('home')
  const [projects, setProjects] = useState([])
  const [music, setMusic] = useState([])
  const [siteSettings, setSiteSettings] = useState({ memberCount: 50, studentsCount: 100, programsCount: 6, yearsActive: 8 })
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [donationDialogOpen, setDonationDialogOpen] = useState(false)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section
      const sections = ['home', 'about', 'projects', 'music', 'learn', 'contact']
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && element.getBoundingClientRect().top <= 100) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetch('/api/seed', { method: 'POST' })
        
        const [projectsRes, musicRes, settingsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/music'),
          fetch('/api/settings')
        ])
        
        const projectsData = await projectsRes.json()
        const musicData = await musicRes.json()
        const settingsData = await settingsRes.json()
        
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setMusic(Array.isArray(musicData) ? musicData : [])
        if (settingsData && !settingsData.error) {
          setSiteSettings(settingsData)
        }
      } catch (error) {
        console.error('Error initializing data:', error)
        setProjects([])
        setMusic([])
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#1e40af] flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">G2 Melody</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation isScrolled={isScrolled} activeSection={activeSection} />
      <HeroSection siteSettings={siteSettings} />
      <AboutSection />
      <ProjectsSection projects={projects} onDonate={handleDonate} />
      <MusicStoreSection music={music} onPurchase={handlePurchase} />
      <LearnMuzikSection />
      <ContactSection />
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

