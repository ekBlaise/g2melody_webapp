'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, Music, Lock, Mail, Eye, EyeOff, ArrowLeft, Users } from 'lucide-react'

export default function MemberLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  
  // Change password dialog state
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [memberId, setMemberId] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store member data in session storage
      sessionStorage.setItem('memberSession', JSON.stringify(data.member))

      // Check if password change is required
      if (data.member.mustChangePassword) {
        setMemberId(data.member.id)
        setPasswordForm({ ...passwordForm, currentPassword: formData.password })
        setChangePasswordOpen(true)
        toast.info('Please change your password to continue')
      } else {
        toast.success(`Welcome back, ${data.member.name}!`)
        router.push('/members/dashboard')
      }
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setChangingPassword(true)

    try {
      const res = await fetch('/api/members/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      toast.success('Password changed successfully!')
      setChangePasswordOpen(false)
      router.push('/members/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <div className="relative w-full max-w-md">
        {/* Back to Website */}
        <Link href="/" className="inline-flex items-center text-amber-200 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Website
        </Link>

        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Member Portal</CardTitle>
            <CardDescription className="text-amber-200">
              G2 Melody Choir Members Only
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-100">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-amber-300/50 focus:border-amber-400 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-100">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-300" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-amber-300/50 focus:border-amber-400 focus:ring-amber-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Music className="w-5 h-5 mr-2" />
                    Sign In to Member Portal
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-amber-200/70">
                Not a member yet?{' '}
                <Link href="/join" className="text-amber-400 hover:text-amber-300 font-medium">
                  Apply to Join
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-amber-200/60 text-sm mt-8">
          © {new Date().getFullYear()} G2 Melody Choir. Member Access.
        </p>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Your Password</DialogTitle>
            <DialogDescription>
              For security, please set a new password before continuing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={changingPassword} className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
