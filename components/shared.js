'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Music, Heart, Users, Calendar, ChevronRight, Menu, X, Mail, MapPin, 
  Facebook, Instagram, Youtube, Church
} from 'lucide-react'
import { useState } from 'react'

// TikTok Icon Component
function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

// Shared Navigation Component
export function SharedNavigation({ currentPage = 'home' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/about', label: 'About', key: 'about' },
    { href: '/projects', label: 'Projects', key: 'projects' },
    { href: '/music', label: 'Music', key: 'music' },
    { href: '/news', label: 'News', key: 'news' },
    { href: '/learn', label: 'Learn', key: 'learn' },
    { href: '/contact', label: 'Contact', key: 'contact' },
  ]

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="G2 Melody" className="h-10 w-auto" />
            <span className="text-xl font-bold">G2 Melody</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  currentPage === link.key 
                    ? 'text-amber-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-700">
                Sign In
              </Button>
            </Link>
            <Link href="/join">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                Join Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-2xl p-6 mt-2 mb-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl font-medium transition-colors ${
                    currentPage === link.key 
                      ? 'bg-amber-50 text-amber-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex space-x-3 pt-6 mt-6 border-t">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/join" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">Join Us</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Shared Footer Component
export function SharedFooter() {
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/g2melody', label: 'Facebook' },
    { icon: Youtube, href: 'https://www.youtube.com/@g2melody', label: 'YouTube' },
    { icon: Instagram, href: 'https://www.instagram.com/g2melody/', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@g2melody_official', label: 'TikTok' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img src="/logo.png" alt="G2 Melody" className="h-12 w-auto" />
              <div>
                <span className="text-xl font-bold text-white">G2 Melody</span>
                <p className="text-xs text-gray-500">Gospel Guardians Melody</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Evangelizing through music, uniting voices in worship, and spreading the Gospel across Cameroon and beyond since 2016.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-amber-500 transition-colors" title={social.label}>
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Projects', href: '/projects' },
                { label: 'Music Store', href: '/music' },
                { label: 'Learn Muzik', href: '/learn' },
                { label: 'Contact', href: '/contact' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1 text-amber-500" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Programs</h3>
            <ul className="space-y-3">
              {['Vocal Training', 'Four-Part Harmony', 'Music Theory', 'Choir Leadership', 'Worship Ministry'].map((item) => (
                <li key={item}>
                  <Link href="/learn" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1 text-amber-500" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Bomaka, Buea<br />Cameroon</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-500" />
                <span>g2melodycmr@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Church className="w-5 h-5 text-amber-500" />
                <span>Church of Christ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} G2 Melody (Gospel Guardians Melody). All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Affiliated to Church of Christ Bomaka
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
