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
import { toast } from 'sonner'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Music, GraduationCap, Heart, Users, Mic2, BookOpen,
  CheckCircle2, Loader2, ArrowRight, Church, Eye, EyeOff, Check, X,
  User, Calendar, MapPin, Briefcase, Home
} from 'lucide-react'

// Password Strength Component
function PasswordStrength({ password }) {
  const [strength, setStrength] = useState(0)
  const [checks, setChecks] = useState({
    length: false, uppercase: false, lowercase: false, number: false, special: false
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
    setStrength((Object.values(newChecks).filter(Boolean).length / 5) * 100)
  }, [password])

  if (!password) return null

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-600 font-medium">Password Strength</span>
        <span className={`font-semibold ${strength < 40 ? 'text-gray-500' : strength < 70 ? 'text-orange-500' : 'text-amber-600'}`}>
          {strength < 40 ? 'Weak' : strength < 70 ? 'Medium' : 'Strong'}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full transition-all duration-300 ${strength < 40 ? 'bg-gray-400' : strength < 70 ? 'bg-orange-400' : 'bg-amber-500'}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {[
          { key: 'length', label: 'At least 8 characters' },
          { key: 'uppercase', label: 'One uppercase letter' },
          { key: 'lowercase', label: 'One lowercase letter' },
          { key: 'number', label: 'One number' },
          { key: 'special', label: 'One special character' }
        ].map(item => (
          <div key={item.key} className={`flex items-center gap-2 text-sm ${checks[item.key] ? 'text-amber-600' : 'text-gray-400'}`}>
            {checks[item.key] ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function JoinPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('supporter')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  
  // Extended member form with all survey fields
  const [memberForm, setMemberForm] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: 'Cameroon',
    // Church/Worship Info
    congregation: '',
    churchBranch: '',
    memberOfChurchOfChrist: '',
    // Current Status
    currentCommitment: '',
    occupation: '',
    // Musical Background
    musicalExperience: '',
    vocalPart: '',
    instrument: '',
    canReadMusic: '',
    previousChoirs: '',
    // Availability & Motivation
    availability: '',
    whyJoin: '',
    howHeard: '',
    // Agreements
    commitment: false,
    agreeToValues: false
  })

  const [supporterForm, setSupporterForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  })

  const validateEmail = (email) => {
    if (!email) { setEmailError(''); return true }
    if (!isValidEmail(email)) { setEmailError('Please enter a valid email address'); return false }
    setEmailError('')
    return true
  }

  const handleSupporterSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail(supporterForm.email)) { toast.error('Please enter a valid email'); return }
    if (supporterForm.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (supporterForm.password !== supporterForm.confirmPassword) { toast.error('Passwords do not match'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: supporterForm.name, email: supporterForm.email, password: supporterForm.password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      toast.success('Welcome to G2 Melody!', { description: 'Your account has been created.' })
      router.push('/login')
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMemberSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail(memberForm.email)) { toast.error('Please enter a valid email'); return }
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
      if (!res.ok) throw new Error(data.error || 'Application failed')
      toast.success('Application Submitted!', { description: 'We will review and contact you soon.' })
      setMemberForm({
        fullName: '', email: '', phone: '', gender: '', dateOfBirth: '', address: '', city: '', country: 'Cameroon',
        congregation: '', churchBranch: '', memberOfChurchOfChrist: '', currentCommitment: '', occupation: '',
        musicalExperience: '', vocalPart: '', instrument: '', canReadMusic: '', previousChoirs: '',
        availability: '', whyJoin: '', howHeard: '', commitment: false, agreeToValues: false
      })
    } catch (error) {
      toast.error(error.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="join" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 mt-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1593678820334-91d5f99be314?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
            alt="Join G2 Melody"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Join the G2 Melody <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Family</span></h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">Whether you want to sing or support, there's a place for you in our ministry.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-14 rounded-xl bg-gray-100 p-1">
              <TabsTrigger value="supporter" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white h-full">
                <Heart className="w-4 h-4 mr-2" /> Supporter
              </TabsTrigger>
              <TabsTrigger value="member" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white h-full">
                <Music className="w-4 h-4 mr-2" /> Choir Member
              </TabsTrigger>
            </TabsList>

            {/* SUPPORTER TAB */}
            <TabsContent value="supporter">
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                {/* Left Info Panel */}
                <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[500px] shadow-xl hidden lg:block">
                  <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" alt="Support" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-amber-900/80 to-amber-900/60" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full mb-4 w-fit">Become a Supporter</span>
                    <h2 className="text-3xl font-bold text-white mb-3">Support Our Ministry</h2>
                    <p className="text-white/80 text-lg leading-relaxed">Create an account to donate, access exclusive content, and follow our journey.</p>
                  </div>
                </div>

                {/* Form */}
                <Card className="lg:col-span-3 border-0 shadow-xl rounded-3xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">Create Supporter Account</CardTitle>
                    <CardDescription>Join our community of supporters and stay connected</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form onSubmit={handleSupporterSubmit} className="space-y-5">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" value={supporterForm.name} onChange={(e) => setSupporterForm({...supporterForm, name: e.target.value})} className="mt-1.5 h-12 rounded-xl" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" value={supporterForm.email} onChange={(e) => { setSupporterForm({...supporterForm, email: e.target.value}); validateEmail(e.target.value) }} className="mt-1.5 h-12 rounded-xl" required />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative mt-1.5">
                          <Input id="password" type={showPassword ? 'text' : 'password'} value={supporterForm.password} onChange={(e) => setSupporterForm({...supporterForm, password: e.target.value})} className="h-12 rounded-xl pr-12" required />
                          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <PasswordStrength password={supporterForm.password} />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative mt-1.5">
                          <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={supporterForm.confirmPassword} onChange={(e) => setSupporterForm({...supporterForm, confirmPassword: e.target.value})} className={`h-12 rounded-xl pr-12 ${supporterForm.confirmPassword && supporterForm.password !== supporterForm.confirmPassword ? 'border-red-500' : ''}`} required />
                          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {supporterForm.confirmPassword && supporterForm.password !== supporterForm.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><X className="w-4 h-4" /> Passwords do not match</p>
                        )}
                        {supporterForm.confirmPassword && supporterForm.password === supporterForm.confirmPassword && supporterForm.password.length >= 8 && (
                          <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Passwords match</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null} Create Account
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="justify-center pt-2 pb-6">
                    <p className="text-gray-500">Already have an account? <Link href="/login" className="text-amber-600 font-semibold hover:underline">Sign In</Link></p>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* MEMBER TAB - Extended Form */}
            <TabsContent value="member">
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                {/* Left Info Panel */}
                <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[500px] shadow-xl hidden lg:block">
                  <img src="https://images.unsplash.com/photo-1541697367348-dfc31a1611dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85" alt="Join Choir" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/80 to-blue-900/60" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full mb-4 w-fit">Join Our Choir</span>
                    <h2 className="text-3xl font-bold text-white mb-3">Become a Member</h2>
                    <p className="text-white/80 text-lg leading-relaxed">Join G2 Melody and use your voice to spread the Gospel through music.</p>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 text-white/90">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        <span>Weekly rehearsals</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        <span>Performance opportunities</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        <span>Music training & growth</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <Card className="lg:col-span-3 border-0 shadow-xl rounded-3xl">
                <CardHeader className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Music className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Choir Membership Application</CardTitle>
                      <CardDescription>Complete this form to apply for G2 Melody choir membership</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleMemberSubmit} className="space-y-8">
                    
                    {/* Section 1: Personal Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">1</span>
                        <h3 className="font-semibold text-gray-900 text-lg">Personal Information</h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input value={memberForm.fullName} onChange={(e) => setMemberForm({...memberForm, fullName: e.target.value})} placeholder="Enter your full name" className="mt-1" required />
                        </div>
                        <div>
                          <Label>Gender *</Label>
                          <Select value={memberForm.gender} onValueChange={(v) => setMemberForm({...memberForm, gender: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select gender" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Date of Birth *</Label>
                          <Input type="date" value={memberForm.dateOfBirth} onChange={(e) => setMemberForm({...memberForm, dateOfBirth: e.target.value})} className="mt-1" required />
                        </div>
                        <div>
                          <Label>Email Address *</Label>
                          <Input type="email" value={memberForm.email} onChange={(e) => setMemberForm({...memberForm, email: e.target.value})} placeholder="your@email.com" className="mt-1" required />
                        </div>
                        <div>
                          <Label>Phone Number *</Label>
                          <Input value={memberForm.phone} onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})} placeholder="+237 6XX XXX XXX" className="mt-1" required />
                        </div>
                        <div>
                          <Label>City/Town *</Label>
                          <Input value={memberForm.city} onChange={(e) => setMemberForm({...memberForm, city: e.target.value})} placeholder="e.g., Buea, Douala, Yaoundé" className="mt-1" required />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Church / Place of Worship */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">2</span>
                        <h3 className="font-semibold text-gray-900 text-lg">Church / Place of Worship</h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label>Which church do you attend? *</Label>
                          <Input value={memberForm.congregation} onChange={(e) => setMemberForm({...memberForm, congregation: e.target.value})} placeholder="e.g., Church of Christ Molyko, Baptist Church Buea" className="mt-1" required />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Current Commitment */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">3</span>
                        <h3 className="font-semibold text-gray-900 text-lg">Current Commitment / Status</h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>What is your current commitment? *</Label>
                          <Select value={memberForm.currentCommitment} onValueChange={(v) => setMemberForm({...memberForm, currentCommitment: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select your status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="employed">Employed / Working</SelectItem>
                              <SelectItem value="self-employed">Self-Employed / Business</SelectItem>
                              <SelectItem value="unemployed">Unemployed / Job Seeking</SelectItem>
                              <SelectItem value="national-service">National Service</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Occupation / Course of Study</Label>
                          <Input value={memberForm.occupation} onChange={(e) => setMemberForm({...memberForm, occupation: e.target.value})} placeholder="e.g., Software Engineer, Medical Student" className="mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Musical Background */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">4</span>
                        <h3 className="font-semibold text-gray-900 text-lg">Musical Background</h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Vocal Part *</Label>
                          <Select value={memberForm.vocalPart} onValueChange={(v) => setMemberForm({...memberForm, vocalPart: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select your part" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="soprano">Soprano (High Female)</SelectItem>
                              <SelectItem value="alto">Alto (Low Female)</SelectItem>
                              <SelectItem value="tenor">Tenor (High Male)</SelectItem>
                              <SelectItem value="bass">Bass (Low Male)</SelectItem>
                              <SelectItem value="unsure">Not Sure Yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Can you read music notation?</Label>
                          <Select value={memberForm.canReadMusic} onValueChange={(v) => setMemberForm({...memberForm, canReadMusic: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes-fluent">Yes, fluently</SelectItem>
                              <SelectItem value="yes-basic">Yes, basic level</SelectItem>
                              <SelectItem value="learning">Currently learning</SelectItem>
                              <SelectItem value="no">No, but willing to learn</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Tell us about your musical experience</Label>
                          <Textarea value={memberForm.musicalExperience} onChange={(e) => setMemberForm({...memberForm, musicalExperience: e.target.value})} placeholder="Describe your musical background, training, performances, etc." className="mt-1" rows={3} />
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Motivation */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">5</span>
                        <h3 className="font-semibold text-gray-900 text-lg">Your Motivation</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Why do you want to join G2 Melody? *</Label>
                          <Textarea value={memberForm.whyJoin} onChange={(e) => setMemberForm({...memberForm, whyJoin: e.target.value})} placeholder="Tell us about your motivation for joining the choir..." className="mt-1" rows={4} required />
                        </div>
                        <div>
                          <Label>How did you hear about G2 Melody?</Label>
                          <Select value={memberForm.howHeard} onValueChange={(v) => setMemberForm({...memberForm, howHeard: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="church">Church Service/Event</SelectItem>
                              <SelectItem value="social">Social Media (Facebook, Instagram, etc.)</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="friend">Friend or Family Member</SelectItem>
                              <SelectItem value="member">Current G2 Member</SelectItem>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Commitments */}
                    <div className="space-y-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <h4 className="font-semibold text-blue-900 text-lg">Commitments & Agreements</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Checkbox id="commitment" checked={memberForm.commitment} onCheckedChange={(c) => setMemberForm({...memberForm, commitment: c})} className="mt-0.5" />
                          <Label htmlFor="commitment" className="text-sm text-gray-700 leading-relaxed font-normal cursor-pointer">
                            I commit to attending rehearsals regularly and participating in G2 Melody activities. I understand that consistent participation is essential for the choir's success.
                          </Label>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox id="values" checked={memberForm.agreeToValues} onCheckedChange={(c) => setMemberForm({...memberForm, agreeToValues: c})} className="mt-0.5" />
                          <Label htmlFor="values" className="text-sm text-gray-700 leading-relaxed font-normal cursor-pointer">
                            I agree to uphold the values of G2 Melody, including respect, dedication, and the mission to spread the gospel through music. I will conduct myself in a manner befitting a member of this ministry.
                          </Label>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 mt-4 bg-blue-100 p-3 rounded-lg">
                        <strong>Note:</strong> Membership requires commitment to rehearsals and alignment with our values. All applications are reviewed by the G2 Melody leadership team.
                      </p>
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
