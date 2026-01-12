'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  MessageCircle, MapPin, Mail, Church, Send, Facebook,
  Twitter, Instagram, Youtube, Calendar
} from 'lucide-react'

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      toast.success('Message sent!', { description: "We'll get back to you soon." })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="contact" />

      {/* Hero with Background Image */}
      <section className="relative py-24 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519937754318-2462db1c429d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBjaG9pcnxlbnwwfHx8fDE3NjgyNDgxMTF8MA&ixlib=rb-4.1.0&q=85"
            alt="Worship Connection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/90 via-pink-900/80 to-pink-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <MessageCircle className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-white/90">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Touch</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions about our ministry, music, or how to join? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="bg-gray-900 text-white">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription className="text-gray-400">Reach out through any channel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Location</h4>
                      <p className="text-gray-400">Bomaka, Buea<br />South West Region, Cameroon</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-gray-400">g2melodycmr@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Church className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Affiliated Church</h4>
                      <p className="text-gray-400">Church of Christ</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-3">
                      {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                        <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-pink-500 transition-colors">
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                    Book the Choir
                  </CardTitle>
                  <CardDescription>Want G2 Melody to perform at your event?</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    We're available for weddings, church programs, concerts, and special events.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                    Request Booking
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>Fill out the form and we'll respond soon</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="mt-1" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="membership">Membership</SelectItem>
                        <SelectItem value="booking">Event Booking</SelectItem>
                        <SelectItem value="music">Music Purchase</SelectItem>
                        <SelectItem value="donation">Donations</SelectItem>
                        <SelectItem value="learning">Learn Muzik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="How can we help?" rows={5} className="mt-1" required />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500" disabled={sending}>
                    {sending ? 'Sending...' : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
