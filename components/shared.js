'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Music, Heart, Users, Calendar, ChevronRight, Menu, X, Mail, MapPin, 
  Facebook, Instagram, Youtube, Church, ChevronDown, Award, Image
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// TikTok Icon Component
function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

// Shared Navigation Component - Matches Homepage Navigation
export function SharedNavigation({ currentPage = 'home' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(currentPage !== 'home') // Only transparent on homepage
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (currentPage === 'home') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [currentPage])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAboutDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/projects', label: 'Projects', key: 'projects' },
    { href: '/music', label: 'Music', key: 'music' },
    { href: '/news', label: 'News', key: 'news' },
    { href: '/learn', label: 'Learn Muzik', key: 'learn' },
    { href: '/contact', label: 'Contact', key: 'contact' },
  ]

  const aboutSubLinks = [
    { href: '/about', label: 'About Us', icon: Users, key: 'about' },
    { href: '/awards', label: 'Awards & Recognition', icon: Award, key: 'awards' },
    { href: '/gallery', label: 'Gallery', icon: Image, key: 'gallery' },
  ]

  const isAboutActive = ['about', 'awards', 'gallery'].includes(currentPage)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="G2 Melody" 
              className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
            />
            <span className={`hidden sm:block text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>G2 Melody</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                currentPage === 'home' 
                  ? (isScrolled ? 'text-amber-600 bg-amber-50' : 'text-amber-400 bg-white/10')
                  : (isScrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10')
              }`}
            >
              Home
            </Link>

            {/* About Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-1 ${
                  isAboutActive 
                    ? (isScrolled ? 'text-amber-600 bg-amber-50' : 'text-amber-400 bg-white/10')
                    : (isScrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10')
                }`}
              >
                About
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {aboutSubLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAboutDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        currentPage === link.key 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <link.icon className="h-4 w-4 text-amber-500" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.filter(link => link.key !== 'home').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  currentPage === link.key 
                    ? (isScrolled ? 'text-amber-600 bg-amber-50' : 'text-amber-400 bg-white/10')
                    : (isScrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10')
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className={isScrolled ? 'text-gray-700' : 'text-white hover:bg-white/10'}>
                Sign In
              </Button>
            </Link>
            <Link href="/join">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Join G2 Melody
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-2xl p-6 mt-2 mb-4 animate-in slide-in-from-top-5">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-xl font-medium transition-colors ${
                  currentPage === 'home' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>

              {/* About Section in Mobile */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">About</p>
                {aboutSubLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-colors ${
                      currentPage === link.key 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <link.icon className="h-4 w-4 text-amber-500" />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-2 mt-2">
                {navLinks.filter(link => link.key !== 'home').map((link) => (
                  <Link
                    key={link.href}
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
