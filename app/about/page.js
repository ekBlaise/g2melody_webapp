'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Music, Heart, Users, Target, Lightbulb, Church, Shield, HandHeart,
  Users2, Mic2, BookOpen, GraduationCap, Globe, Sparkles, Award, Calendar,
  ArrowRight, ChevronRight
} from 'lucide-react'

export default function AboutPage() {
  const coreValues = [
    { icon: Shield, title: 'Holiness', desc: 'Walking in righteousness and spiritual purity' },
    { icon: HandHeart, title: 'Stewardship', desc: 'Faithful management of God-given talents' },
    { icon: Users2, title: 'Teamwork', desc: 'Unity in purpose and collaborative excellence' },
    { icon: Heart, title: 'Agape Love', desc: 'Unconditional Christ-like love for all' },
    { icon: Shield, title: 'Discipline', desc: 'Commitment to growth and accountability' },
  ]

  const objectives = [
    { icon: Mic2, title: 'Evangelism Through Music', desc: 'Using non-instrumental singing to spread the Gospel of Christ' },
    { icon: Sparkles, title: 'Spiritual Devotion', desc: "Serving as a beacon of faith and commitment to God's work" },
    { icon: Users, title: 'Unity in Diversity', desc: 'Bringing together individuals from diverse backgrounds' },
    { icon: Music, title: 'Revitalize Church Music', desc: 'Promoting mastery of four-part harmony and acapella traditions' },
    { icon: GraduationCap, title: 'Music Education', desc: 'Developing talents through structured professional training' },
    { icon: Globe, title: 'Global Outreach', desc: 'Spreading worship across Cameroon and beyond' },
  ]

  const timeline = [
    { year: '2016', title: 'Founded', desc: 'G2 Melody originated from "Melodious Voices" of The Church of Christ Muea' },
    { year: '2019', title: 'Debut Album', desc: 'Released "Unfathomable Love" - our first studio album' },
    { year: '2020', title: 'Growth', desc: 'Expanded membership and established structured training programs' },
    { year: '2024', title: 'Vision', desc: 'Launched G2 Meloverse project for permanent facility' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="G2 Melody" className="h-10 w-auto" />
              <span className="text-xl font-bold">G2 Melody</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-amber-600 font-medium">About</Link>
              <Link href="/projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
              <Link href="/music" className="text-gray-600 hover:text-gray-900">Music</Link>
              <Link href="/learn" className="text-gray-600 hover:text-gray-900">Learn</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
            <Link href="/join">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500">Join Us</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">About Us</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Gospel Guardians Melody</h1>
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
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Target className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  Evangelizing through music, uniting individuals under a shared purpose, revitalizing church music, and exemplifying spiritual devotion rooted in the doctrine of Christ and the musical heritage of the Church.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  A future where the musical landscape of the Church is revitalized, young choirs are nurtured, and music-driven evangelism plays a central role in spreading the Gospel across Cameroon and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all">
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

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                    {item.year.slice(-2)}
                  </div>
                  {index < timeline.length - 1 && <div className="w-0.5 h-full bg-amber-200 mt-2" />}
                </div>
                <div className="pb-8">
                  <p className="text-sm text-amber-600 font-medium">{item.year}</p>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliation */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">
            <Church className="w-5 h-5 inline mr-2" />
            Affiliated with <span className="font-semibold text-gray-700">The Church of Christ Bomaka</span>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-gray-600 mb-8">Become part of our community and help spread the Gospel through music.</p>
          <Link href="/join">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500">
              Join G2 Melody <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
