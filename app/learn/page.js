'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Music, GraduationCap, Mic2, BookOpen, FileText, Users, Church, ArrowRight
} from 'lucide-react'

export default function LearnPage() {
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
    <div className="min-h-screen bg-white">
      <SharedNavigation currentPage="learn" />

      {/* Hero */}
      <section className="relative py-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1604560733003-bae94041bf33?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxtdXNpYyUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3NjgyNDgxMTd8MA&ixlib=rb-4.1.0&q=85"
            alt="Music Education"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white/90">Learn Muzik</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Develop Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Musical Gift</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Our structured music education program is designed to nurture your talents and equip you for worship leadership.
          </p>
        </div>
      </section>

      {/* Academy Banner */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">G2 Melody Music Academy</h3>
                <p className="text-white/90 mb-6 text-lg">
                  Our vision is to establish a full-fledged music academy in Cameroon that confers degrees in music studies.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/join">
                    <Button className="bg-white text-amber-600 hover:bg-white/90">
                      <GraduationCap className="mr-2 h-4 w-4" /> Enroll Now
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button className="bg-white/20 text-white hover:bg-white/30 border border-white/30">
                      View Curriculum
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold">100+</div>
                  <div className="text-white/80">Students</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold">6</div>
                  <div className="text-white/80">Programs</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold">4-Part</div>
                  <div className="text-white/80">Harmony</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold">Pro</div>
                  <div className="text-white/80">Training</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-xl transition-all group">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                    <program.icon className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>{program.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <Badge variant="outline">{program.level}</Badge>
                    <span className="text-gray-500">{program.duration}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/join" className="w-full">
                    <Button variant="outline" className="w-full group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-colors">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mb-8">Join G2 Melody and develop your musical gifts under expert guidance.</p>
          <Link href="/join">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              Join G2 Melody <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
