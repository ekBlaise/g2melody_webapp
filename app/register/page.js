'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Music, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, GraduationCap, Mic2, Heart } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Account created successfully!')
      
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      })

      if (result?.ok) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      toast.error('Google sign in failed')
      setLoading(false)
    }
  }

  const benefits = [
    { icon: GraduationCap, title: 'Learn Muzik', desc: 'Access structured music education programs' },
    { icon: Mic2, title: 'Join the Choir', desc: 'Become part of our worship community' },
    { icon: Heart, title: 'Support Projects', desc: 'Track your donations and impact' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center justify-center space-x-3 mb-8 lg:hidden">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e40af]-500 to-[#0891b2]-500 flex items-center justify-center shadow-lg">
              <Music className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">G2 Melody</span>
              <p className="text-xs text-gray-500">Gospel Guardians</p>
            </div>
          </Link>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold">Join G2 Melody</CardTitle>
              <CardDescription className="text-base">Create an account to get started</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-11 pr-11 h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#1e40af]-500 to-[#0891b2]-500 hover:from-[#1e40af]-600 hover:to-[#0891b2]-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  Create Account
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 font-medium"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[#1e40af]-600 hover:text-[#1e40af]-700 font-semibold">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>

          <Link href="/" className="flex items-center justify-center mt-8 text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1541697367348-dfc31a1611dc"
          alt="Worship Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1e40af]/70 flex items-center justify-center">
          <div className="text-center text-white p-12 max-w-lg">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1e40af]-500 to-[#0891b2]-500 flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Music className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
            <p className="text-gray-300 mb-10">
              Become part of a Christ-centered community dedicated to spreading the Gospel through excellence in worship music.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1e40af]-500/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-[#1e40af]-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

