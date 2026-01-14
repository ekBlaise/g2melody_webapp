'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Heart, Target, Clock, CheckCircle2, ArrowRight, Loader2
} from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        await fetch('/api/seed', { method: 'POST' })
        const res = await fetch('/api/projects')
        const data = await res.json()
        setProjects(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  const getProgress = (current, goal) => Math.min((current / goal) * 100, 100)

  const getDaysLeft = (deadline) => {
    if (!deadline) return null
    const diff = new Date(deadline) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const currentProjects = projects.filter(p => p.status === 'CURRENT')
  const pastProjects = projects.filter(p => p.status === 'PAST')
  const meloverse = projects.find(p => p.id === 'proj-meloverse')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="projects" />

      {/* Hero */}
      <section className="relative pt-24 pb-12 mt-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560251445-ba979d304eb9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
            alt="Community Choir"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Support Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Mission</span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Your generous contributions help us spread the Gospel through music and nurture the next generation of worship leaders.
          </p>
        </div>
      </section>

      {/* G2 Meloverse Featured */}
      {meloverse && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden">
              <img src="/g2-meloverse.jpg" alt="G2 Meloverse" className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent" />
              <div className="absolute inset-0 p-8 md:p-16 flex items-center">
                <div className="max-w-2xl">
                  <Badge className="mb-4 bg-amber-500">Vision Project</Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">G2 Meloverse</h2>
                  <p className="text-gray-300 mb-6">Our flagship vision project - a multi-purpose facility housing the Music Academy, Recording Studios, and Radio Station.</p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                      <p className="text-white font-bold">{formatCurrency(meloverse.goalAmount)}</p>
                      <p className="text-xs text-gray-400">Total Goal</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                      <p className="text-white font-bold">{Math.round(getProgress(meloverse.currentAmount, meloverse.goalAmount))}%</p>
                      <p className="text-xs text-gray-400">Funded</p>
                    </div>
                  </div>
                  <Link href={`/projects/${meloverse.id}`}>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="current">Active ({currentProjects.length})</TabsTrigger>
              <TabsTrigger value="past">Completed ({pastProjects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.filter(p => p.id !== 'proj-meloverse').map((project) => (
                  <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all">
                    <div className="relative h-48">
                      <img src={project.image || 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg'} alt={project.title} className="w-full h-full object-cover" />
                      {project.deadline && (
                        <Badge className="absolute top-3 right-3 bg-orange-500">
                          <Clock className="w-3 h-3 mr-1" /> {getDaysLeft(project.deadline)} days
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={getProgress(project.currentAmount, project.goalAmount)} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-amber-600">{formatCurrency(project.currentAmount)}</span>
                        <span className="text-gray-500">of {formatCurrency(project.goalAmount)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Link href={`/projects/${project.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                      <Link href={`/projects/${project.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                          <Heart className="w-4 h-4 mr-1" /> Donate
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img src={project.image || 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg'} alt={project.title} className="w-full h-full object-cover grayscale-[30%]" />
                      <Badge className="absolute top-3 right-3 bg-amber-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <p className="text-amber-600 font-semibold">{formatCurrency(project.goalAmount)} raised</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
