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

  if (!password) return null

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-600 font-medium">Password Strength</span>
        <span className={`font-semibold ${strength < 40 ? 'text-red-500' : strength < 70 ? 'text-yellow-600' : 'text-green-600'}`}>
          {strength < 40 ? 'Weak' : strength < 70 ? 'Medium' : 'Strong'}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full transition-all duration-300 ${strength < 40 ? 'bg-red-500' : strength < 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {[
          { key: 'length', label: 'At least 8 characters' },
          { key: 'uppercase', label: 'One uppercase letter' },
          { key: 'lowercase', label: 'One lowercase letter' },
          { key: 'number', label: 'One number' },
          { key: 'special', label: 'One special character (!@#$...)' }
        ].map(item => (
          <div key={item.key} className={`flex items-center gap-2 text-sm ${checks[item.key] ? 'text-green-600' : 'text-gray-400'}`}>
            {checks[item.key] ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

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
  
  const [memberForm, setMemberForm] = useState({
    fullName: '', email: '', phone: '', dateOfBirth: '', location: '',
    congregation: '', musicalExperience: '', vocalPart: '', instrument: '',
    canReadMusic: '', whyJoin: '', howHeard: '', commitment: false, agreeToValues: false
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

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="join" />

      {/* Hero Section */}
      <section className="relative py-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1593678820334-91d5f99be314?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
            alt="Join G2 Melody"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-orange-600/90" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join the G2 Melody Family</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Whether you want to support our mission or become an active choir member, there's a place for you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 -mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 p-1.5 bg-white shadow-lg rounded-2xl h-14">
            <TabsTrigger value="supporter" className="rounded-xl text-base font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" /> Become a Supporter
            </TabsTrigger>
            <TabsTrigger value="member" className="rounded-xl text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Mic2 className="w-4 h-4 mr-2" /> Join the Choir
            </TabsTrigger>
          </TabsList>

          {/* SUPPORTER TAB */}
          <TabsContent value="supporter">
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              {/* Left - Info Panel */}
              <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[580px] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1560251445-ba979d304eb9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
                  alt="Community"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full mb-4">
                      Free Account
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-3">Become a Supporter</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                      Join our global community of supporters who help spread the Gospel through music.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold text-lg">What you get:</h3>
                    {[
                      { icon: Heart, text: 'Donate to ministry projects' },
                      { icon: Music, text: 'Purchase & download music' },
                      { icon: GraduationCap, text: 'Access learning resources' },
                      { icon: Users, text: 'Join our global community' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/90">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <Card className="lg:col-span-3 border-0 shadow-xl rounded-3xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Create Your Account</CardTitle>
                  <CardDescription>Quick and easy - start supporting in minutes</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <form onSubmit={handleSupporterSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={supporterForm.name}
                        onChange={(e) => setSupporterForm({...supporterForm, name: e.target.value})}
                        placeholder="John Doe"
                        className="mt-1.5 h-12 rounded-xl"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={supporterForm.email}
                        onChange={(e) => { setSupporterForm({...supporterForm, email: e.target.value}); validateEmail(e.target.value) }}
                        placeholder="john@example.com"
                        className={`mt-1.5 h-12 rounded-xl ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
                        required
                      />
                      {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={supporterForm.password}
                          onChange={(e) => setSupporterForm({...supporterForm, password: e.target.value})}
                          placeholder="Create a strong password"
                          className="h-12 rounded-xl pr-12"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <PasswordStrength password={supporterForm.password} />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={supporterForm.confirmPassword}
                          onChange={(e) => setSupporterForm({...supporterForm, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          className={`h-12 rounded-xl pr-12 ${supporterForm.confirmPassword && supporterForm.password !== supporterForm.confirmPassword ? 'border-red-500' : ''}`}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {supporterForm.confirmPassword && supporterForm.password !== supporterForm.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <X className="w-4 h-4" /> Passwords do not match
                        </p>
                      )}
                      {supporterForm.confirmPassword && supporterForm.password === supporterForm.confirmPassword && supporterForm.password.length >= 8 && (
                        <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Passwords match
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                      Create Account
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="justify-center pt-2 pb-6">
                  <p className="text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-amber-600 font-semibold hover:underline">Sign In</Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* MEMBER TAB */}
          <TabsContent value="member">
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              {/* Left - Info Panel */}
              <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[700px] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1593678820334-91d5f99be314?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
                  alt="Choir"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/80 to-blue-900/60" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full mb-4">
                      Membership Application
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-3">Join Our Choir</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                      Be part of our mission to evangelize through music. Participate in rehearsals, performances, and receive comprehensive training.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold text-lg">Member Benefits:</h3>
                    {[
                      { icon: Mic2, text: 'Participate in performances' },
                      { icon: BookOpen, text: 'Professional music training' },
                      { icon: Church, text: 'Serve in worship ministry' },
                      { icon: Users, text: 'Leadership opportunities' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/90">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white/10 backdrop-blur rounded-xl">
                    <p className="text-white/90 text-sm">
                      <strong>Note:</strong> Membership requires commitment to rehearsals and alignment with our values. Applications are reviewed by leadership.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right - Application Form */}
              <Card className="lg:col-span-3 border-0 shadow-xl rounded-3xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Membership Application</CardTitle>
                  <CardDescription>Tell us about yourself and your musical background</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <form onSubmit={handleMemberSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">1</span>
                        Personal Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input value={memberForm.fullName} onChange={(e) => setMemberForm({...memberForm, fullName: e.target.value})} className="mt-1" required />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input type="email" value={memberForm.email} onChange={(e) => setMemberForm({...memberForm, email: e.target.value})} className="mt-1" required />
                        </div>
                        <div>
                          <Label>Phone *</Label>
                          <Input value={memberForm.phone} onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})} placeholder="+237..." className="mt-1" required />
                        </div>
                        <div>
                          <Label>Location *</Label>
                          <Input value={memberForm.location} onChange={(e) => setMemberForm({...memberForm, location: e.target.value})} placeholder="City, Country" className="mt-1" required />
                        </div>
                      </div>
                    </div>

                    {/* Musical Background */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">2</span>
                        Musical Background
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Vocal Part *</Label>
                          <Select value={memberForm.vocalPart} onValueChange={(v) => setMemberForm({...memberForm, vocalPart: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
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
                          <Label>Can you read music?</Label>
                          <Select value={memberForm.canReadMusic} onValueChange={(v) => setMemberForm({...memberForm, canReadMusic: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="learning">Learning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Musical Experience</Label>
                        <Textarea value={memberForm.musicalExperience} onChange={(e) => setMemberForm({...memberForm, musicalExperience: e.target.value})} placeholder="Describe your choir or musical background..." className="mt-1" rows={3} />
                      </div>
                    </div>

                    {/* Motivation */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">3</span>
                        Your Motivation
                      </h3>
                      <div>
                        <Label>Why do you want to join G2 Melody? *</Label>
                        <Textarea value={memberForm.whyJoin} onChange={(e) => setMemberForm({...memberForm, whyJoin: e.target.value})} placeholder="Tell us about your motivation..." className="mt-1" rows={3} required />
                      </div>
                      <div>
                        <Label>How did you hear about us?</Label>
                        <Select value={memberForm.howHeard} onValueChange={(v) => setMemberForm({...memberForm, howHeard: v})}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="church">Church Event</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="friend">Friend/Family</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Commitments */}
                    <div className="space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="font-medium text-blue-900">Commitments</h4>
                      <div className="flex items-start gap-3">
                        <Checkbox id="commitment" checked={memberForm.commitment} onCheckedChange={(c) => setMemberForm({...memberForm, commitment: c})} className="mt-0.5" />
                        <Label htmlFor="commitment" className="text-sm text-gray-700 leading-relaxed font-normal">
                          I commit to attending rehearsals regularly and participating in G2 Melody activities.
                        </Label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox id="values" checked={memberForm.agreeToValues} onCheckedChange={(c) => setMemberForm({...memberForm, agreeToValues: c})} className="mt-0.5" />
                        <Label htmlFor="values" className="text-sm text-gray-700 leading-relaxed font-normal">
                          I agree with G2 Melody's core values: Holiness, Stewardship, Teamwork, Agape Love, and Discipline.
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
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
