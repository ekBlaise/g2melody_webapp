'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Music, Heart, Users, Target, Lightbulb, Shield, HandHeart,
  Users2, Mic2, GraduationCap, Globe, Sparkles, ArrowRight,
  Calendar, Award, User, ChevronLeft, ChevronRight, Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AboutPage() {
  const [founders, setFounders] = useState([])
  const [members, setMembers] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const membersPerPage = 12

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foundersRes, membersRes] = await Promise.all([
          fetch('/api/founders'),
          fetch('/api/choir-members')
        ])
        
        if (foundersRes.ok) {
          const foundersData = await foundersRes.json()
          setFounders(foundersData)
        }
        
        if (membersRes.ok) {
          const membersData = await membersRes.json()
          setMembers(membersData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const coreValues = [
    { icon: Shield, title: 'Holiness', desc: 'Striving for purity in all actions' },
    { icon: HandHeart, title: 'Stewardship', desc: 'Using talents to serve selflessly' },
    { icon: Users2, title: 'Teamwork', desc: 'Unity in achieving goals' },
    { icon: Heart, title: 'Agape Love', desc: 'Christ-like love for all' },
    { icon: Award, title: 'Discipline', desc: 'High standards of commitment' },
  ]

  const objectives = [
    { icon: Mic2, title: 'Evangelism Through Music', desc: 'Using non-instrumental singing to spread the Gospel' },
    { icon: Sparkles, title: 'Spiritual Devotion', desc: "Serving as a beacon of faith and commitment" },
    { icon: Users, title: 'Unity in Diversity', desc: 'Bringing together individuals from diverse backgrounds' },
    { icon: Music, title: 'Revitalize Church Music', desc: 'Promoting mastery of four-part harmony' },
    { icon: GraduationCap, title: 'Music Education', desc: 'Developing talents through professional training' },
    { icon: Globe, title: 'Global Outreach', desc: 'Spreading worship across Cameroon and beyond' },
  ]

  const memberTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'theosortian', label: 'Theosortians' },
    { id: 'sponsor', label: 'Sponsors' },
  ]

  // Filter and search members
  const filteredMembers = members
    .filter(m => activeTab === 'all' || m.status.toLowerCase() === activeTab)
    .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage)
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  )

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchTerm])

  const getVocalPartColor = (part) => {
    switch(part) {
      case 'SOPRANO': return 'bg-rose-100 text-rose-700'
      case 'ALTO': return 'bg-amber-100 text-amber-700'
      case 'TENOR': return 'bg-orange-100 text-orange-700'
      case 'BASS': return 'bg-gray-200 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-amber-500'
      case 'ALUMNI': return 'bg-gray-500'
      case 'THEOSORTIAN': return 'bg-orange-500'
      case 'SPONSOR': return 'bg-rose-500'
      default: return 'bg-gray-500'
    }
  }

  // Get founder by name for history section
  const getFounder = (name) => founders.find(f => f.name.toLowerCase().includes(name.toLowerCase()))
  const andyLeroy = getFounder('andy') || { name: 'Minister Andy Leroy', bio: 'Conceived the idea of G2 Melody', image: null }
  const ekwogeBlaise = getFounder('blaise') || { name: 'Ekwoge Blaise', bio: 'Co-founder and director', image: null }

  return (
    <div className="min-h-screen bg-white">
      <SharedNavigation currentPage="about" />

      {/* Hero */}
      <section className="relative py-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1593678820334-91d5f99be314?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
            alt="Gospel Choir"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white/90">About Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gospel Guardians <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Melody</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            "WE ARE BETTER TOGETHER, UNITY IS STRENGTH" — Founded in late 2016, G2 Melody originated from "Melodious Voices" of The Church of Christ Muea, evolving into a powerful force for musical evangelism.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-white/90 leading-relaxed">
                  Evangelizing through music, uniting individuals under a shared purpose, revitalizing church music, and exemplifying spiritual devotion rooted in the doctrine of Christ and the musical heritage of the Church.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-white/90 leading-relaxed">
                  A future where the musical landscape of the Church is revitalized, young choirs are nurtured, and music-driven evangelism plays a central role in spreading the Gospel across Cameroon and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed History with Founders Integrated */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Our History</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The G2 Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a simple conversation between two visionaries to a thriving community of musical evangelists.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Late 2016 - The Visionaries & Beginning */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">Late 2016</span>
                <h3 className="text-xl font-bold text-gray-900">The Visionaries & Beginning</h3>
              </div>
              <p className="text-gray-600 mb-6">
                G2 Melody was born from a conversation between two visionaries who shared a dream of creating a unified choir dedicated to musical evangelism for the TV program "Gospel Guardians."
              </p>
              
              {/* Founders Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    {andyLeroy.image ? (
                      <img src={andyLeroy.image} alt={andyLeroy.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{andyLeroy.name}</h4>
                    <p className="text-sm text-amber-600 font-medium">Co-Founder & Visionary</p>
                    <p className="text-xs text-gray-500 mt-1">Conceived the idea of G2 Melody for the "Gospel Guardians" TV program</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    {ekwogeBlaise.image ? (
                      <img src={ekwogeBlaise.image} alt={ekwogeBlaise.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{ekwogeBlaise.name}</h4>
                    <p className="text-sm text-amber-600 font-medium">Co-Founder & Director</p>
                    <p className="text-xs text-gray-500 mt-1">Persevered through early challenges, still serving today</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600">
                Originally named <strong>"Melodious Voices"</strong> from The Church of Christ Muea, the choir was envisioned as one of three acapella groups performing for the "Gospel Guardians" TV program.
              </p>
            </div>

            {/* October 2016 - First Members */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold">October 2016</span>
                <h3 className="text-xl font-bold text-gray-900">The First Gathering</h3>
              </div>
              <p className="text-gray-600">
                The choir officially commenced with approximately <strong>30 members</strong> from three locations: <strong>Muea, Bomaka, and Mile 16</strong>. This was the beginning of a community united by faith and music.
              </p>
            </div>

            {/* 2017 - Perseverance */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-rose-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-bold">2017</span>
                <h3 className="text-xl font-bold text-gray-900">Perseverance Through Trials</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Due to challenges with music instruction and understanding the principles of <strong>four-part harmony</strong>, membership swiftly dwindled to just <strong>2-3 dedicated members</strong>:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-gray-100 text-gray-700 px-3 py-1">Eweh Ivo (Bass)</Badge>
                <Badge className="bg-gray-100 text-gray-700 px-3 py-1">Ngoberi Falyne (Soprano)</Badge>
                <Badge className="bg-gray-100 text-gray-700 px-3 py-1">Ekwoge Blaise (Tenor)</Badge>
              </div>
              <p className="text-gray-600 italic">
                "Despite numerous attempts to reorganize, these founding members persevered, keeping the dream alive when it would have been easier to give up."
              </p>
            </div>

            {/* 2018 - Breakthrough */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2018</span>
                <h3 className="text-xl font-bold text-gray-900">The Breakthrough</h3>
              </div>
              <p className="text-gray-600">
                A pivotal breakthrough emerged, leading to a complete <strong>redefinition of the choir's goals and objectives</strong>. The vision evolved beyond just serving a TV program to encompass broader goals: musical evangelism, unity, spiritual devotion, and church music revitalization. G2 Melody finally had a clearer identity.
              </p>
            </div>

            {/* 2019 - Growth & Album */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold">2019</span>
                <h3 className="text-xl font-bold text-gray-900">Debut Album & New Initiatives</h3>
              </div>
              <p className="text-gray-600 mb-4">
                G2 Melody achieved a major milestone by producing the inaugural album <strong>"Unfathomable Love"</strong> comprising <strong>6 songs</strong>. This marked the choir's first official recording.
              </p>
              <p className="text-gray-600">
                New initiatives were introduced for the first time in the church: <strong>camping sessions, visits, outreach programs</strong>, and annual auditions (April & November). These activities helped build the G2 family spirit.
              </p>
            </div>

            {/* November 2020 - Equipment */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-rose-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-bold">November 2020</span>
                <h3 className="text-xl font-bold text-gray-900">Professional Equipment & Growth</h3>
              </div>
              <p className="text-gray-600 mb-4">
                The choir purchased its own <strong>professional PA system</strong> — described as "one of the best the church has had." This purchase was championed by <strong>Sister Mafani Patricia</strong>, one of G2's matrons and sponsors.
              </p>
              <p className="text-gray-600">
                Membership expanded significantly as the choir's reputation grew. The Theosortians (management arm) was established with members like <strong>Ndenge Gerald, Oliver Peyele, and Bechem Manfred</strong>.
              </p>
            </div>

            {/* 2024 - Constitution & Vision */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2024</span>
                <h3 className="text-xl font-bold text-gray-900">Constitution & G2 Meloverse Vision</h3>
              </div>
              <p className="text-gray-600 mb-4">
                G2 Melody officially adopted its <strong>Choristers' Handbook</strong> containing the tenets and operational guidelines. The ambitious <strong>G2 Meloverse</strong> project was launched — a vision for a permanent multi-purpose facility in Buea, Cameroon, including:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-amber-100 text-amber-700 px-3 py-1">Music Academy</Badge>
                <Badge className="bg-amber-100 text-amber-700 px-3 py-1">Recording Studios</Badge>
                <Badge className="bg-amber-100 text-amber-700 px-3 py-1">Radio Station</Badge>
                <Badge className="bg-amber-100 text-amber-700 px-3 py-1">Event Spaces</Badge>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
              <p className="text-xl italic font-medium mb-4">
                "If your musical abilities today remain unchanged from what they were 3 or 5 years ago, you may not be fully realizing the potential of your gift. Gifts should be cultivated and refined, never hoarded."
              </p>
              <p className="text-amber-100">— G2 Melody Handbook</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <obj.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{obj.title}</h4>
                <p className="text-gray-600 text-sm">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {coreValues.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                  <value.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h4 className="font-semibold mb-1">{value.title}</h4>
                <p className="text-xs text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Section - Improved UI */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
              <Users className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Our Family</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Members Since 2016</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The dedicated voices that make up the G2 Melody family.
            </p>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {memberTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab.label}
                  <span className="ml-1 text-xs opacity-70">
                    ({tab.id === 'all' ? members.length : members.filter(m => m.status.toLowerCase() === tab.id).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : paginatedMembers.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {paginatedMembers.map((member) => (
                  <Card key={member.id} className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden group">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusBadge(member.status)} ring-2 ring-white`} title={member.status}></div>
                      {member.isFounding && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Founder
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 text-center">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{member.name}</h4>
                      {member.role && (
                        <p className="text-xs text-amber-600 truncate">{member.role}</p>
                      )}
                      <div className="flex items-center justify-center gap-1 mt-2 flex-wrap">
                        {member.vocalPart !== 'NONE' && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getVocalPartColor(member.vocalPart)}`}>
                            {member.vocalPart.charAt(0) + member.vocalPart.slice(1).toLowerCase()}
                          </span>
                        )}
                        {member.yearJoined && (
                          <span className="text-xs text-gray-500">{member.yearJoined}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No members found.</p>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs text-gray-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Active</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-500"></div> Alumni</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Theosortian</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Sponsor</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-gray-600 mb-8">Become part of our community and help spread the Gospel through music.</p>
          <Link href="/join">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              Join G2 Melody <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
