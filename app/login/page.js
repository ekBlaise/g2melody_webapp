'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Music, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Church, Heart, Users } from 'lucide-react'

// Wrapper component to handle Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  )
}

// Loading skeleton
function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="w-full max-w-md p-8">
        <div className="animate-pulse">
          <div className="h-14 w-32 bg-gray-200 rounded mx-auto mb-8" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// Main login content
function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      })

      if (result?.error) {
        toast.error('Login failed', { description: 'Invalid email or password' })
      } else {
        toast.success('Welcome back!')
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      toast.error('Google sign in failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593678820334-91d5f99be314?w=1200')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-transparent to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="G2 Melody" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-white">G2 Melody</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome Back to the Family
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Sign in to continue supporting our mission of spreading the Gospel through music.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Heart, text: 'Support ministry projects' },
                { icon: Music, text: 'Access your music library' },
                { icon: Users, text: 'Connect with the community' }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-white/90">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <Church className="w-4 h-4" />
            <span>Affiliated to Church of Christ Bomaka</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <img src="/logo.png" alt="G2 Melody" className="h-14 w-auto" />
            <div>
              <span className="text-2xl font-bold text-gray-900">G2 Melody</span>
              <p className="text-xs text-gray-500">Gospel Guardians Melody</p>
            </div>
          </Link>

          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-2 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-6">
              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl mb-6 font-medium hover:bg-gray-50"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or sign in with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/join" className="text-amber-600 hover:text-amber-700 font-semibold">
                  Join G2 Melody
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
    </div>
  )
}
