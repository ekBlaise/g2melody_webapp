'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Award, Trophy, Star, Calendar, Building, ChevronRight, Loader2, Medal
} from 'lucide-react'

export default function AwardsPage() {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await fetch('/api/awards')
        const data = await res.json()
        setAwards(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching awards:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAwards()
  }, [])

  // Group awards by year
  const awardsByYear = awards.reduce((acc, award) => {
    const year = award.year
    if (!acc[year]) acc[year] = []
    acc[year].push(award)
    return acc
  }, {})

  const years = Object.keys(awardsByYear).sort((a, b) => b - a)

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="awards" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 mt-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBhd2FyZHxlbnwwfHx8fDE3MDk0NDIwMDB8MA&ixlib=rb-4.1.0&q=85"
            alt="Awards and Recognition"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-orange-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Awards & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">Recognition</span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Celebrating our achievements and the recognition we've received for our dedication to spreading the Gospel through music.
          </p>
        </div>
      </section>

      {/* Awards Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-amber-500" />
              <p className="mt-4 text-gray-500">Loading awards...</p>
            </div>
          ) : awards.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Awards Coming Soon</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                We're working hard and making an impact. Our awards and recognition will be showcased here soon.
              </p>
              <Link href="/about">
                <Button className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500">
                  Learn About Our Journey
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {years.map((year) => (
                <div key={year}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg">
                      <Calendar className="w-5 h-5" />
                      <span className="text-xl font-bold">{year}</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {awardsByYear[year].map((award) => (
                      <Card key={award.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100">
                          {award.image ? (
                            <img
                              src={award.image}
                              alt={award.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Medal className="w-20 h-20 text-amber-400" />
                            </div>
                          )}
                          {award.category && (
                            <Badge className="absolute top-4 right-4 bg-white/90 text-amber-700">
                              {award.category}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{award.title}</h3>
                              {award.awardingOrganization && (
                                <p className="text-sm text-amber-600 flex items-center gap-1 mb-2">
                                  <Building className="w-4 h-4" />
                                  {award.awardingOrganization}
                                </p>
                              )}
                              {award.description && (
                                <p className="text-sm text-gray-600 line-clamp-3">{award.description}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Award-Winning Choir</h2>
          <p className="text-lg text-white/90 mb-8">
            Be part of a choir that's making a difference through music ministry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                Join G2 Melody
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
