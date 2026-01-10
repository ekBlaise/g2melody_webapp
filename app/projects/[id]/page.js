'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
  Music, Heart, ArrowLeft, Calendar, Users, Target, Clock, Share2,
  Facebook, Twitter, Linkedin, Copy, CheckCircle2, Loader2, MapPin
} from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donationDialogOpen, setDonationDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`)
        if (!res.ok) throw new Error('Project not found')
        const data = await res.json()
        setProject(data)
      } catch (error) {
        toast.error('Project not found')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id, router])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount)
  }

  const getProgress = (current, goal) => Math.min((current / goal) * 100, 100)

  const getDaysLeft = (deadline) => {
    if (!deadline) return null
    const diff = new Date(deadline) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async (platform) => {
    const url = window.location.href
    const text = `Support ${project?.title} - G2 Melody`
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
      return
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) return null

  const progress = getProgress(project.currentAmount, project.goalAmount)
  const daysLeft = getDaysLeft(project.deadline)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="G2 Melody" className="h-10 w-auto" />
              <span className="text-xl font-bold hidden sm:block">G2 Melody</span>
            </Link>
            <Link href="/#projects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <img
          src={project.image || 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg'}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Badge className={project.status === 'CURRENT' ? 'bg-green-500' : 'bg-gray-500'}>
              {project.status === 'CURRENT' ? 'Active Project' : 'Completed'}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4">{project.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Card */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-4xl font-bold text-green-600">{formatCurrency(project.currentAmount)}</p>
                    <p className="text-gray-500">raised of {formatCurrency(project.goalAmount)} goal</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-gray-900">{Math.round(progress)}%</p>
                    <p className="text-gray-500">funded</p>
                  </div>
                </div>
                <Progress value={progress} className="h-4 mb-6" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <Users className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{project.donations?.length || 0}</p>
                    <p className="text-sm text-gray-500">Donors</p>
                  </div>
                  {daysLeft !== null && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{daysLeft}</p>
                      <p className="text-sm text-gray-500">Days Left</p>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{formatCurrency(project.goalAmount - project.currentAmount)}</p>
                    <p className="text-sm text-gray-500">Still Needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
                </div>
                
                {project.deadline && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-xl flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Target Completion Date</p>
                      <p className="text-sm text-amber-700">{formatDate(project.deadline)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Donations */}
            {project.donations && project.donations.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Supporters</CardTitle>
                  <CardDescription>Thank you to everyone who has contributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.donations.map((donation) => (
                      <div key={donation.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                        <Avatar>
                          <AvatarFallback className="bg-amber-100 text-amber-700">
                            {donation.anonymous ? '?' : (donation.donorName?.charAt(0) || 'A')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">
                              {donation.anonymous ? 'Anonymous' : donation.donorName || 'Supporter'}
                            </p>
                            <p className="font-bold text-green-600">{formatCurrency(donation.amount)}</p>
                          </div>
                          {donation.message && (
                            <p className="text-sm text-gray-600 mt-1 italic">"{donation.message}"</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{formatDate(donation.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Donate Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Support This Project</CardTitle>
                  <CardDescription>Every contribution brings us closer to our goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                    onClick={() => setDonationDialogOpen(true)}
                    disabled={project.status !== 'CURRENT'}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    {project.status === 'CURRENT' ? 'Donate Now' : 'Project Completed'}
                  </Button>

                  {/* Share Buttons */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-3 text-center">Share this project</p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare('copy')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">Buea, Cameroon</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Music className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Organized by</p>
                        <p className="font-medium">G2 Melody</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Dialog */}
      <DonationDialog 
        project={project}
        open={donationDialogOpen}
        onOpenChange={setDonationDialogOpen}
        onSuccess={() => {
          // Refresh project data
          window.location.reload()
        }}
      />
    </div>
  )
}

// Donation Dialog Component
function DonationDialog({ project, open, onOpenChange, onSuccess }) {
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
      onSuccess?.()
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
            Your donation helps us spread the Gospel through music.
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
                  className={formData.amount === amount.toString() ? 'bg-green-600 hover:bg-green-700' : ''}
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
                  className={`justify-start ${formData.paymentMethod === method.id ? 'bg-green-600 hover:bg-green-700' : ''}`}
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
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Processing...' : 'Complete Donation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
