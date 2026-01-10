'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Music, ArrowLeft, GraduationCap, Heart, Users, Mic2, BookOpen,
  CheckCircle2, Loader2, ArrowRight, Church, Calendar, Phone, Mail, MapPin
} from 'lucide-react'

export default function JoinPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('supporter')
  const [loading, setLoading] = useState(false)
  
  // Membership application form
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    congregation: '',
    musicalExperience: '',
    vocalPart: '',
    instrument: '',
    canReadMusic: '',
    whyJoin: '',
    howHeard: '',
    commitment: false,
    agreeToValues: false
  })

  // Supporter registration (simpler form)
  const [supporterForm, setSupporterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: []
  })

  const handleMemberSubmit = async (e) => {
    e.preventDefault()
    
    if (!memberForm.commitment || !memberForm.agreeToValues) {
      toast.error('Please confirm your commitment and agreement to our values')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/membership-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm)
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Application submission failed')
      }

      toast.success('Application Submitted!', {
        description: 'We will review your application and contact you soon.'
      })
      
      // Reset form
      setMemberForm({
        fullName: '', email: '', phone: '', dateOfBirth: '', location: '',
        congregation: '', musicalExperience: '', vocalPart: '', instrument: '',
        canReadMusic: '', whyJoin: '', howHeard: '', commitment: false, agreeToValues: false
      })
    } catch (error) {
      toast.error(error.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSupporterSubmit = async (e) => {
    e.preventDefault()
    
    if (supporterForm.password !== supporterForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: supporterForm.name,
          email: supporterForm.email,
          password: supporterForm.password
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Welcome to G2 Melody!', {
        description: 'Your account has been created. You can now sign in.'
      })
      router.push('/login')
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const benefits = {
    supporter: [
      { icon: Heart, title: 'Support Projects', desc: 'Contribute to our mission and track your impact' },
      { icon: Music, title: 'Access Music', desc: 'Purchase and download our worship music collection' },
      { icon: GraduationCap, title: 'Learn Online', desc: 'Access basic music learning resources' },
      { icon: Users, title: 'Community', desc: 'Be part of the G2 Melody family worldwide' }
    ],
    member: [
      { icon: Mic2, title: 'Choir Participation', desc: 'Sing with us at rehearsals and events' },
      { icon: BookOpen, title: 'Full Training', desc: 'Comprehensive music education and vocal training' },
      { icon: Church, title: 'Ministry', desc: 'Serve in evangelism through music' },
      { icon: Users, title: 'Leadership', desc: 'Grow into worship leadership roles' }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="G2 Melody" className="h-10 w-auto" />
              <span className="text-xl font-bold hidden sm:block">G2 Melody</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join the G2 Melody Family</h1>
          <p className="text-xl text-white/90">
            Whether you want to support our mission or become an active choir member, 
            there's a place for you in our community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-12 p-1 bg-gray-100 rounded-xl h-14">
            <TabsTrigger value="supporter" className="rounded-lg text-base data-[state=active]:bg-white data-[state=active]:shadow">
              <Heart className="w-4 h-4 mr-2" /> Supporter
            </TabsTrigger>
            <TabsTrigger value="member" className="rounded-lg text-base data-[state=active]:bg-white data-[state=active]:shadow">
              <Mic2 className="w-4 h-4 mr-2" /> Choir Member
            </TabsTrigger>
          </TabsList>

          {/* Supporter Tab */}
          <TabsContent value="supporter">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Become a Supporter</h2>
                <p className="text-gray-600 mb-8">
                  Join our community of supporters who help us spread the Gospel through music. 
                  As a supporter, you can donate to projects, purchase music, and access learning resources.
                </p>
                <div className="space-y-4">
                  {benefits.supporter.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Form */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Create Supporter Account</CardTitle>
                  <CardDescription>Quick and easy - start supporting in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSupporterSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="supporterName">Full Name</Label>
                      <Input
                        id="supporterName"
                        value={supporterForm.name}
                        onChange={(e) => setSupporterForm({...supporterForm, name: e.target.value})}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supporterEmail">Email</Label>
                      <Input
                        id="supporterEmail"
                        type="email"
                        value={supporterForm.email}
                        onChange={(e) => setSupporterForm({...supporterForm, email: e.target.value})}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supporterPassword">Password</Label>
                      <Input
                        id="supporterPassword"
                        type="password"
                        value={supporterForm.password}
                        onChange={(e) => setSupporterForm({...supporterForm, password: e.target.value})}
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supporterConfirmPassword">Confirm Password</Label>
                      <Input
                        id="supporterConfirmPassword"
                        type="password"
                        value={supporterForm.confirmPassword}
                        onChange={(e) => setSupporterForm({...supporterForm, confirmPassword: e.target.value})}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Create Account
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500">
                  Already have an account? <Link href="/login" className="text-amber-600 font-medium">Sign In</Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Member Tab */}
          <TabsContent value="member">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Benefits - Smaller */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Become a Choir Member</h2>
                <p className="text-gray-600 mb-8">
                  Join our choir and be part of our mission to evangelize through music. 
                  Members participate in rehearsals, performances, and receive comprehensive musical training.
                </p>
                <div className="space-y-4">
                  {benefits.member.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-amber-50 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-2">Note</h4>
                  <p className="text-sm text-amber-700">
                    Choir membership requires commitment to rehearsals and alignment with our values. 
                    Your application will be reviewed by our leadership team.
                  </p>
                </div>
              </div>

              {/* Application Form */}
              <Card className="lg:col-span-3 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Membership Application</CardTitle>
                  <CardDescription>Tell us about yourself and your musical background</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMemberSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="font-semibold mb-4 text-gray-900">Personal Information</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={memberForm.fullName}
                            onChange={(e) => setMemberForm({...memberForm, fullName: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={memberForm.email}
                            onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={memberForm.phone}
                            onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})}
                            placeholder="+237..."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={memberForm.dateOfBirth}
                            onChange={(e) => setMemberForm({...memberForm, dateOfBirth: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Current Location *</Label>
                          <Input
                            id="location"
                            value={memberForm.location}
                            onChange={(e) => setMemberForm({...memberForm, location: e.target.value})}
                            placeholder="City, Country"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="congregation">Home Congregation</Label>
                          <Input
                            id="congregation"
                            value={memberForm.congregation}
                            onChange={(e) => setMemberForm({...memberForm, congregation: e.target.value})}
                            placeholder="Church of Christ..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Musical Background */}
                    <div>
                      <h3 className="font-semibold mb-4 text-gray-900">Musical Background</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="experience">Musical Experience</Label>
                          <Textarea
                            id="experience"
                            value={memberForm.musicalExperience}
                            onChange={(e) => setMemberForm({...memberForm, musicalExperience: e.target.value})}
                            placeholder="Describe your musical background, training, choir experience..."
                            rows={3}
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="vocalPart">Vocal Part *</Label>
                            <Select 
                              value={memberForm.vocalPart} 
                              onValueChange={(value) => setMemberForm({...memberForm, vocalPart: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your vocal part" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="soprano">Soprano</SelectItem>
                                <SelectItem value="alto">Alto</SelectItem>
                                <SelectItem value="tenor">Tenor</SelectItem>
                                <SelectItem value="bass">Bass</SelectItem>
                                <SelectItem value="unsure">Not Sure</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="instrument">Instruments (if any)</Label>
                            <Input
                              id="instrument"
                              value={memberForm.instrument}
                              onChange={(e) => setMemberForm({...memberForm, instrument: e.target.value})}
                              placeholder="Piano, Guitar, etc."
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Can you read music?</Label>
                          <RadioGroup 
                            value={memberForm.canReadMusic}
                            onValueChange={(value) => setMemberForm({...memberForm, canReadMusic: value})}
                            className="flex space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="readYes" />
                              <Label htmlFor="readYes" className="font-normal">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="readNo" />
                              <Label htmlFor="readNo" className="font-normal">No</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="learning" id="readLearning" />
                              <Label htmlFor="readLearning" className="font-normal">Learning</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* Motivation */}
                    <div>
                      <h3 className="font-semibold mb-4 text-gray-900">Motivation</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="whyJoin">Why do you want to join G2 Melody? *</Label>
                          <Textarea
                            id="whyJoin"
                            value={memberForm.whyJoin}
                            onChange={(e) => setMemberForm({...memberForm, whyJoin: e.target.value})}
                            placeholder="Tell us about your motivation..."
                            rows={3}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="howHeard">How did you hear about us?</Label>
                          <Select 
                            value={memberForm.howHeard} 
                            onValueChange={(value) => setMemberForm({...memberForm, howHeard: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="church">Church Event</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="friend">Friend/Family</SelectItem>
                              <SelectItem value="concert">Concert/Performance</SelectItem>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Commitments */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="commitment"
                          checked={memberForm.commitment}
                          onCheckedChange={(checked) => setMemberForm({...memberForm, commitment: checked})}
                        />
                        <Label htmlFor="commitment" className="text-sm text-gray-700 leading-relaxed">
                          I commit to attending rehearsals regularly and participating actively in G2 Melody's activities.
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeToValues"
                          checked={memberForm.agreeToValues}
                          onCheckedChange={(checked) => setMemberForm({...memberForm, agreeToValues: checked})}
                        />
                        <Label htmlFor="agreeToValues" className="text-sm text-gray-700 leading-relaxed">
                          I agree with G2 Melody's core values of Holiness, Stewardship, Teamwork, Agape Love, and Discipline.
                        </Label>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
