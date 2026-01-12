'use client'

import { useState, useEffect } from 'react'
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
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Music, GraduationCap, Heart, Users, Mic2, BookOpen,
  CheckCircle2, Loader2, ArrowRight, Church, Eye, EyeOff, Check, X
} from 'lucide-react'

// Password Strength Component
function PasswordStrength({ password }) {
  const [strength, setStrength] = useState(0)
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  useEffect(() => {
    const newChecks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    setChecks(newChecks)
    
    const passedChecks = Object.values(newChecks).filter(Boolean).length
    setStrength((passedChecks / 5) * 100)
  }, [password])

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-red-500'
    if (strength < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength < 40) return 'Weak'
    if (strength < 70) return 'Medium'
    return 'Strong'
  }

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Password Strength</span>
        <span className={`font-medium ${strength < 40 ? 'text-red-500' : strength < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
          {getStrengthText()}
        </span>
      </div>
      <Progress value={strength} className={`h-1 ${getStrengthColor()}`} />
      <div className="grid grid-cols-2 gap-1 text-xs">
        {[
          { key: 'length', label: 'At least 8 characters' },
          { key: 'uppercase', label: 'Uppercase letter' },
          { key: 'lowercase', label: 'Lowercase letter' },
          { key: 'number', label: 'Number' },
          { key: 'special', label: 'Special character' }
        ].map(item => (
          <div key={item.key} className={`flex items-center space-x-1 ${checks[item.key] ? 'text-green-600' : 'text-gray-400'}`}>
            {checks[item.key] ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function JoinPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('supporter')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  
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

  // Supporter registration form
  const [supporterForm, setSupporterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: []
  })

  const validateEmail = (email) => {
    if (!email) {
      setEmailError('')
      return true
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const handleMemberSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail(memberForm.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
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
    
    if (!validateEmail(supporterForm.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (supporterForm.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
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
      <SharedNavigation currentPage="join" />

      {/* Hero Section with Image */}
      <section className="relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1593678820334-91d5f99be314?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
            alt="Join G2 Melody"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 via-orange-600/85 to-amber-600/90" />
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
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Left Side - Image with Text Overlay */}
              <div className="relative rounded-2xl overflow-hidden min-h-[500px]">
                <img
                  src="https://images.unsplash.com/photo-1560251445-ba979d304eb9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
                  alt="Community"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/40" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h2 className="text-3xl font-bold text-white mb-4">Become a Supporter</h2>
                  <p className="text-white/90 mb-6 text-lg leading-relaxed">
                    Join our community of supporters who help us spread the Gospel through music. 
                    As a supporter, you can donate to projects, purchase music, and access learning resources.
                  </p>
                  <div className="space-y-3">
                    {benefits.supporter.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3 text-white/90">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-4 h-4" />
                        </div>
                        <span>{benefit.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
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
                        onChange={(e) => {
                          setSupporterForm({...supporterForm, email: e.target.value})
                          validateEmail(e.target.value)
                        }}
                        placeholder="john@example.com"
                        className={emailError ? 'border-red-500' : ''}
                        required
                      />
                      {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                    <div>
                      <Label htmlFor="supporterPassword">Password</Label>
                      <div className="relative">
                        <Input
                          id="supporterPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={supporterForm.password}
                          onChange={(e) => setSupporterForm({...supporterForm, password: e.target.value})}
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <PasswordStrength password={supporterForm.password} />
                    </div>
                    <div>
                      <Label htmlFor="supporterConfirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="supporterConfirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={supporterForm.confirmPassword}
                          onChange={(e) => setSupporterForm({...supporterForm, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          className={supporterForm.confirmPassword && supporterForm.password !== supporterForm.confirmPassword ? 'border-red-500' : ''}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {supporterForm.confirmPassword && supporterForm.password !== supporterForm.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={loading || !isValidEmail(supporterForm.email) || supporterForm.password.length < 8}
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
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left Side - Image with Text */}
              <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[600px]">
                <img
                  src="https://images.unsplash.com/photo-1593678820334-91d5f99be314?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
                  alt="Choir Members"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/70 to-blue-900/40" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h2 className="text-3xl font-bold text-white mb-4">Become a Choir Member</h2>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Join our choir and be part of our mission to evangelize through music. 
                    Members participate in rehearsals, performances, and receive comprehensive musical training.
                  </p>
                  <div className="space-y-3 mb-6">
                    {benefits.member.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3 text-white/90">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-4 h-4" />
                        </div>
                        <span>{benefit.title}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur rounded-xl">
                    <p className="text-white/90 text-sm">
                      <strong>Note:</strong> Choir membership requires commitment to rehearsals and alignment with our values. 
                      Your application will be reviewed by our leadership team.
                    </p>
                  </div>
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
                          <Label htmlFor="memberEmail">Email *</Label>
                          <Input
                            id="memberEmail"
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

      <SharedFooter />
    </div>
  )
}
