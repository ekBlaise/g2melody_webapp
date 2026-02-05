'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SharedNavigation, SharedFooter } from '@/components/shared'
import {
  Image as ImageIcon, Camera, Calendar, Filter, X, Grid3X3, Loader2, Star, ChevronRight
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ years: [], categories: [] })
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, filtersRes] = await Promise.all([
          fetch('/api/gallery'),
          fetch('/api/gallery/filters')
        ])
        const itemsData = await itemsRes.json()
        const filtersData = await filtersRes.json()
        setItems(Array.isArray(itemsData) ? itemsData : [])
        setFilters({
          years: Array.isArray(filtersData?.years) ? filtersData.years : [],
          categories: Array.isArray(filtersData?.categories) ? filtersData.categories : []
        })
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter items based on selection
  const filteredItems = items.filter(item => {
    if (selectedYear !== 'all' && item.year !== parseInt(selectedYear)) return false
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    return true
  })

  // Group by year and category for display
  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = `${item.year}-${item.category}`
    if (!acc[key]) {
      acc[key] = {
        year: item.year,
        category: item.category,
        items: []
      }
    }
    acc[key].items.push(item)
    return acc
  }, {})

  const groups = Object.values(groupedItems).sort((a, b) => b.year - a.year)

  const clearFilters = () => {
    setSelectedYear('all')
    setSelectedCategory('all')
  }

  const hasActiveFilters = selectedYear !== 'all' || selectedCategory !== 'all'

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation currentPage="gallery" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 mt-16 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxjaG9pciUyMGNvbmNlcnR8ZW58MHx8fHwxNzA5NDQyMDAwfDA&ixlib=rb-4.1.0&q=85"
            alt="Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Gallery</span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Relive our memorable moments through concerts, rehearsals, community events, and fellowship gatherings.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by:</span>
            </div>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {filters.years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filters.categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                <X className="w-4 h-4 mr-1" /> Clear filters
              </Button>
            )}

            <div className="ml-auto text-sm text-gray-500">
              {filteredItems.length} {filteredItems.length === 1 ? 'photo' : 'photos'}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500" />
              <p className="mt-4 text-gray-500">Loading gallery...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {hasActiveFilters ? 'No Photos Match Your Filters' : 'Gallery Coming Soon'}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more photos.'
                  : 'We\'re curating our best moments to share with you. Check back soon!'
                }
              </p>
              {hasActiveFilters ? (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              ) : (
                <Link href="/about">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                    Learn About Our Journey
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {groups.map((group) => (
                <div key={`${group.year}-${group.category}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="px-4 py-2 text-base font-semibold border-blue-200 bg-blue-50 text-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        {group.year}
                      </Badge>
                      <Badge className="px-4 py-2 text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {group.category}
                      </Badge>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
                    <span className="text-sm text-gray-500">{group.items.length} photos</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                        onClick={() => setSelectedImage(item)}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                        </div>
                        {item.isFeatured && (
                          <div className="absolute top-2 right-2">
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95">
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                <h3 className="text-xl font-bold mb-1">{selectedImage.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span>{selectedImage.year}</span>
                  <span>•</span>
                  <span>{selectedImage.category}</span>
                  {selectedImage.eventName && (
                    <>
                      <span>•</span>
                      <span>{selectedImage.eventName}</span>
                    </>
                  )}
                </div>
                {selectedImage.description && (
                  <p className="mt-2 text-gray-400">{selectedImage.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Want to Be Part of Our Story?</h2>
          <p className="text-lg text-white/90 mb-8">
            Join G2 Melody and create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Join G2 Melody
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
