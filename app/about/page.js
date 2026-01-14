'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Music, Heart, Users, Target, Lightbulb, Shield, HandHeart,
  Users2, Mic2, GraduationCap, Globe, Sparkles, ArrowRight,
  Calendar, Award, User
} from 'lucide-react'

export default function AboutPage() {
  const [founders, setFounders] = useState([])
  const [members, setMembers] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

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
    { icon: Shield, title: 'Holiness', desc: 'Striving for purity in all actions, both within and outside the choir' },
    { icon: HandHeart, title: 'Stewardship', desc: 'Using God-given talents to serve others selflessly' },
    { icon: Users2, title: 'Teamwork', desc: 'Collaborating effectively to achieve goals through unity' },
    { icon: Heart, title: 'Agape Love', desc: 'Demonstrating Christ-like love that puts others first' },
    { icon: Award, title: 'Discipline', desc: 'Upholding high standards of conduct and commitment' },
  ]

  const objectives = [
    { icon: Mic2, title: 'Evangelism Through Music', desc: 'Using non-instrumental singing to spread the Gospel of Christ' },
    { icon: Sparkles, title: 'Spiritual Devotion', desc: "Serving as a beacon of faith and commitment to God's work" },
    { icon: Users, title: 'Unity in Diversity', desc: 'Bringing together individuals from diverse backgrounds' },
    { icon: Music, title: 'Revitalize Church Music', desc: 'Promoting mastery of four-part harmony and acapella traditions' },
    { icon: GraduationCap, title: 'Music Education', desc: 'Developing talents through structured professional training' },
    { icon: Globe, title: 'Global Outreach', desc: 'Spreading worship across Cameroon and beyond' },
  ]

  const memberTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'theosortian', label: 'Theosortians' },
    { id: 'sponsor', label: 'Sponsors' },
  ]

  const filteredMembers = activeTab === 'all' 
    ? members 
    : members.filter(m => m.status.toLowerCase() === activeTab)

  const getVocalPartColor = (part) => {
    switch(part) {
      case 'SOPRANO': return 'bg-amber-100 text-amber-700'
      case 'ALTO': return 'bg-orange-100 text-orange-700'
      case 'TENOR': return 'bg-amber-100 text-amber-700'
      case 'BASS': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-amber-500'
      case 'ALUMNI': return 'bg-gray-500'
      case 'THEOSORTIAN': return 'bg-orange-500'
      case 'SPONSOR': return 'bg-amber-600'
      default: return 'bg-gray-500'
    }
  }

  // Get founder by name for timeline
  const getFounder = (name) => founders.find(f => f.name.toLowerCase().includes(name.toLowerCase()))
  const andyLeroy = getFounder('andy') || { name: 'Minister Andy Leroy', bio: 'Conceived the idea of G2 Melody', image: null }
  const ekwogeBlaise = getFounder('blaise') || { name: 'Ekwoge Blaise', bio: 'Co-founder and director', image: null }

  return (
    <div className="min-h-screen bg-white">
      <SharedNavigation currentPage="about" />

      {/* Hero */}
      <section className="relative py-24 text-white overflow-hidden">
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
            Founded in late 2016, G2 Melody originated from "Melodious Voices" of The Church of Christ Muea, evolving into a powerful force for musical evangelism and worship excellence.
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

      {/* Our History with Founders Integrated */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Our History</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The G2 Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a simple idea between two visionaries to a thriving community of musical evangelists.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* 2016 - The Beginning with Founders */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2016</span>
                <h3 className="text-xl font-bold text-gray-900">The Beginning</h3>
              </div>
              <p className="text-gray-600 mb-6">
                In late 2016, G2 Melody was born from a conversation between two visionaries who shared a dream of creating a unified choir dedicated to musical evangelism through the TV program "Gospel Guardians."
              </p>
              
              {/* Founders Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    {andyLeroy.image ? (
                      <img src={andyLeroy.image} alt={andyLeroy.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{andyLeroy.name}</h4>
                    <p className="text-sm text-amber-600 font-medium">Co-Founder & Visionary</p>
                    <p className="text-xs text-gray-500 mt-1">Conceived the idea of G2 Melody</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    {ekwogeBlaise.image ? (
                      <img src={ekwogeBlaise.image} alt={ekwogeBlaise.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{ekwogeBlaise.name}</h4>
                    <p className="text-sm text-amber-600 font-medium">Co-Founder & Director</p>
                    <p className="text-xs text-gray-500 mt-1">Persevered through early challenges</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600">
                Originally named "Melodious Voices" from The Church of Christ Muea, the choir commenced in October 2016 with approximately 30 members from Muea, Bomaka, and Mile 16.
              </p>
            </div>

            {/* 2017 - Perseverance */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2017</span>
                <h3 className="text-xl font-bold text-gray-900">Perseverance Through Trials</h3>
              </div>
              <p className="text-gray-600">
                Due to challenges in music instruction and understanding principles of four-part harmony, membership dwindled to just 2-3 dedicated members: <strong>Eweh Ivo</strong>, <strong>Ngoberi Falyne</strong>, and <strong>Ekwoge Blaise</strong>. Despite numerous reorganization attempts, these founding members persevered, keeping the dream alive.
              </p>
            </div>

            {/* 2018 - Breakthrough */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2018</span>
                <h3 className="text-xl font-bold text-gray-900">The Breakthrough</h3>
              </div>
              <p className="text-gray-600">
                A pivotal breakthrough led to a redefinition of the choir's goals and objectives. Moving beyond just serving a TV program, G2 Melody established a clearer identity focused on musical evangelism, unity, and church music revitalization.
              </p>
            </div>

            {/* 2019 - Growth */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2019</span>
                <h3 className="text-xl font-bold text-gray-900">Debut Album & New Initiatives</h3>
              </div>
              <p className="text-gray-600">
                G2 Melody achieved significant progress, producing the inaugural album <strong>"Unfathomable Love"</strong> comprising 6 songs. New initiatives like camping, visits, and outreach activities were introduced - the first of its kind in the church.
              </p>
            </div>

            {/* 2020 - Equipment */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2020</span>
                <h3 className="text-xl font-bold text-gray-900">Growth & Professional Equipment</h3>
              </div>
              <p className="text-gray-600">
                In November 2020, G2 Melody purchased a professional PA system - one of the best the church has had - with funding championed by <strong>Sister Mafani Patricia</strong>, one of our matrons. Membership expanded significantly as the choir's reputation grew.
              </p>
            </div>

            {/* 2024 - Vision */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold">2024</span>
                <h3 className="text-xl font-bold text-gray-900">Constitution & Vision Projects</h3>
              </div>
              <p className="text-gray-600">
                G2 Melody officially adopted its constitution on August 27th, 2024. The ambitious <strong>G2 Meloverse</strong> project was launched - a vision for a permanent multi-purpose facility including a Music Academy, Recording Studios, and Radio Station in Buea, Cameroon.
              </p>
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

      {/* Members Since 2016 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
              <Users className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Our Family</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Members Since 2016</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The dedicated voices that make up the G2 Melody family - from founding members to our newest additions.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
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
                <span className="ml-2 text-xs opacity-70">
                  ({tab.id === 'all' ? members.length : members.filter(m => m.status.toLowerCase() === tab.id).length})
                </span>
              </button>
            ))}
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden group">
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    {/* Status indicator */}
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusBadge(member.status)} ring-2 ring-white`}></div>
                    {/* Founding badge */}
                    {member.isFounding && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Founding
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 text-center">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{member.name}</h4>
                    {member.role && (
                      <p className="text-xs text-amber-600 mb-1">{member.role}</p>
                    )}
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {member.vocalPart !== 'NONE' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getVocalPartColor(member.vocalPart)}`}>
                          {member.vocalPart.charAt(0) + member.vocalPart.slice(1).toLowerCase()}
                        </span>
                      )}
                      {member.yearJoined && (
                        <span className="text-xs text-gray-500">
                          {member.yearJoined}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No members found in this category.</p>
            </div>
          )}
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
