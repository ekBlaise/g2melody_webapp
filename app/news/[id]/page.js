'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Loader2, Megaphone, User, Facebook, Twitter } from 'lucide-react'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedNews, setRelatedNews] = useState([])

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/news/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setArticle(data)
          
          // Fetch related news
          const relatedRes = await fetch(`/api/news?limit=3`)
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json()
            setRelatedNews(relatedData.filter(n => n.id !== params.id).slice(0, 3))
          }
        } else {
          router.push('/news')
        }
      } catch (err) {
        console.error('Error fetching article:', err)
        router.push('/news')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchArticle()
    }
  }, [params.id, router])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SharedNavigation currentPage="news" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
        <SharedFooter />
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 sm:pt-32 pb-12 sm:pb-20">
        {article.image && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news" className="inline-flex items-center text-gray-400 hover:text-white mb-4 sm:mb-6 transition-colors text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={`${
              article.type === 'event' ? 'bg-blue-500' : 
              article.type === 'announcement' ? 'bg-amber-500' : 'bg-gray-700'
            } text-white`}>
              {article.type}
            </Badge>
            {article.isFeatured && (
              <Badge className="bg-purple-500 text-white">Featured</Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base">
            {article.author && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Event Details */}
              {article.type === 'event' && article.eventDate && (
                <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                  <h3 className="font-semibold text-blue-900 mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-blue-800">
                      <Calendar className="w-5 h-5 flex-shrink-0" />
                      <span>{formatDate(article.eventDate)}</span>
                    </div>
                    {article.eventTime && (
                      <div className="flex items-center gap-3 text-blue-800">
                        <Clock className="w-5 h-5 flex-shrink-0" />
                        <span>{article.eventTime}</span>
                      </div>
                    )}
                    {article.eventLocation && (
                      <div className="flex items-center gap-3 text-blue-800">
                        <MapPin className="w-5 h-5 flex-shrink-0" />
                        <span>{article.eventLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {article.summary && (
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 border-l-4 border-amber-500 pl-4 sm:pl-6 italic">
                  {article.summary}
                </p>
              )}

              {/* Main Image */}
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full rounded-xl shadow-lg mb-6 sm:mb-8"
                />
              )}

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: article.content || '<p>No content available.</p>' }}
              />

              {/* Share Section */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Share this article</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                  >
                    <Facebook className="w-4 h-4" /> <span className="hidden sm:inline">Facebook</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                  >
                    <Twitter className="w-4 h-4" /> <span className="hidden sm:inline">Twitter</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      alert('Link copied to clipboard!')
                    }}
                  >
                    <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Copy Link</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Articles */}
              {relatedNews.length > 0 && (
                <div className="sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedNews.map((news) => (
                      <Link key={news.id} href={`/news/${news.id}`}>
                        <div className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          {news.image && (
                            <img 
                              src={news.image} 
                              alt={news.title}
                              className="w-full h-24 object-cover rounded-lg mb-3"
                            />
                          )}
                          <Badge className={`text-xs mb-2 ${
                            news.type === 'event' ? 'bg-blue-100 text-blue-700' : 
                            news.type === 'announcement' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {news.type}
                          </Badge>
                          <h4 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(news.publishedAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
