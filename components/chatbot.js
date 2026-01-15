'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Music } from 'lucide-react'

const quickReplies = [
  'How can I join G2 Melody?',
  'Where can I buy your music?',
  'Tell me about your projects',
  'How can I donate?',
  'What events are coming up?'
]

// Simple rule-based responses
const getBotResponse = (message) => {
  const lower = message.toLowerCase()
  
  if (lower.includes('join') || lower.includes('member') || lower.includes('apply')) {
    return {
      text: "We'd love to have you! You can join G2 Melody in two ways:\n\n1️⃣ **Join our Community** - Create a free account to donate, purchase music, and access learning resources.\n\n2️⃣ **Join the Choir** - Apply to become an active choir member and participate in rehearsals and performances.\n\nVisit our Join page to get started!",
      link: { url: '/join', label: 'Join Us' }
    }
  }
  
  if (lower.includes('music') || lower.includes('album') || lower.includes('song') || lower.includes('buy')) {
    return {
      text: "Our music collection features original acapella worship songs and hymn arrangements. You can:\n\n🎵 Stream songs for free on our website\n💿 Purchase individual tracks or full albums\n📥 Download high-quality files after purchase\n\nCheck out our debut album 'Unfathomable Love'!",
      link: { url: '/music', label: 'Browse Music' }
    }
  }
  
  if (lower.includes('donate') || lower.includes('support') || lower.includes('give') || lower.includes('contribution')) {
    return {
      text: "Thank you for your interest in supporting our ministry! Your donations help us:\n\n🎓 Train young musicians\n🎤 Produce worship music\n🏗️ Build the G2 Meloverse facility\n🌍 Spread the Gospel through music\n\nYou can donate to specific projects or give a general contribution.",
      link: { url: '/projects', label: 'View Projects' }
    }
  }
  
  if (lower.includes('project') || lower.includes('meloverse')) {
    return {
      text: "Our flagship project is the G2 Meloverse - a multipurpose facility that will house:\n\n🎓 Music Academy\n🎙️ Recording Studio\n📻 Radio Station\n🏛️ Event Hall\n\nWe also have various other community and ministry projects. Check them out!",
      link: { url: '/projects', label: 'Our Projects' }
    }
  }
  
  if (lower.includes('event') || lower.includes('concert') || lower.includes('performance') || lower.includes('activity')) {
    return {
      text: "We regularly host concerts, workshops, and community outreach events. Our annual Christmas Cantata is a highlight!\n\nVisit our News & Events page to see what's coming up and photos from past events.",
      link: { url: '/news', label: 'News & Events' }
    }
  }
  
  if (lower.includes('learn') || lower.includes('training') || lower.includes('course') || lower.includes('teach')) {
    return {
      text: "G2 Melody offers music education through our Learn Muzik program:\n\n🎤 Vocal Training\n🎼 Four-Part Harmony\n📖 Music Theory\n👥 Choir Leadership\n\nOur dream is to establish a full music academy in Cameroon!",
      link: { url: '/learn', label: 'Learn Muzik' }
    }
  }
  
  if (lower.includes('contact') || lower.includes('reach') || lower.includes('email') || lower.includes('phone')) {
    return {
      text: "You can reach us through:\n\n📧 Email: g2melodycmr@gmail.com\n📍 Location: Buea, Cameroon\n\nOr send us a message through our contact form!",
      link: { url: '/contact', label: 'Contact Us' }
    }
  }
  
  if (lower.includes('about') || lower.includes('who') || lower.includes('what is g2') || lower.includes('history')) {
    return {
      text: "G2 Melody (Gospel Guardians Melody) is an acapella choir founded in late 2016 in Buea, Cameroon. We originated from 'Melodious Voices' of The Church of Christ Muea.\n\nOur mission is evangelizing through music, nurturing talents, and revitalizing church music through four-part harmony.",
      link: { url: '/about', label: 'About Us' }
    }
  }
  
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good')) {
    return {
      text: "Hello! 👋 Welcome to G2 Melody! I'm here to help you learn about our choir, music, projects, and how you can get involved.\n\nWhat would you like to know?",
      link: null
    }
  }
  
  if (lower.includes('thank')) {
    return {
      text: "You're welcome! 🙏 Is there anything else I can help you with?",
      link: null
    }
  }
  
  // Default response
  return {
    text: "I'd be happy to help! I can tell you about:\n\n• Joining G2 Melody\n• Our music and albums\n• Current projects\n• Upcoming events\n• Learning programs\n• How to donate\n\nWhat interests you?",
    link: null
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! 👋 Welcome to G2 Melody! I'm your virtual assistant. How can I help you today?",
      link: null
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const messagesEndRef = useRef(null)
  const pathname = usePathname()

  // Don't show chatbot on admin/dashboard pages
  const hiddenPaths = ['/admin', '/dashboard', '/member-dashboard']
  const shouldHide = hiddenPaths.some(path => pathname?.startsWith(path))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Wait for page to fully load before showing chatbot
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text = input) => {
    if (!text.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = getBotResponse(text)
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: response.text,
      link: response.link
    }

    setIsTyping(false)
    setMessages(prev => [...prev, botMessage])
  }

  const handleQuickReply = (reply) => {
    handleSend(reply)
  }

  // Don't render if page not loaded or on hidden paths
  if (!isPageLoaded || shouldHide) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group animate-in fade-in slide-in-from-bottom-4"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96'}`}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">G2 Melody Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-amber-500' : 'bg-gray-200'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        message.type === 'user' 
                          ? 'bg-amber-500 text-white rounded-tr-sm' 
                          : 'bg-white shadow-sm rounded-tl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      {message.link && (
                        <a 
                          href={message.link.url}
                          className="inline-flex items-center gap-1 mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                          {message.link.label} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-white shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-3 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 3).map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-3 py-1.5 bg-white border rounded-full hover:bg-amber-50 hover:border-amber-300 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
