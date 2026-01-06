import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // ==================== ROOT ====================
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'G2 Melody API v1.0', status: 'running' }))
    }

    // ==================== AUTH ====================
    if (route === '/auth/register' && method === 'POST') {
      const body = await request.json()
      const { email, password, name } = body

      if (!email || !password) {
        return handleCORS(NextResponse.json({ error: 'Email and password required' }, { status: 400 }))
      }

      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return handleCORS(NextResponse.json({ error: 'User already exists' }, { status: 400 }))
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: { id: uuidv4(), email, password: hashedPassword, name, role: 'USER' }
      })

      return handleCORS(NextResponse.json({ id: user.id, email: user.email, name: user.name }))
    }

    // ==================== PROJECTS ====================
    if (route === '/projects' && method === 'GET') {
      const url = new URL(request.url)
      const status = url.searchParams.get('status')
      
      const where = status ? { status: status.toUpperCase() } : {}
      const projects = await prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { donations: true } } }
      })
      return handleCORS(NextResponse.json(projects))
    }

    if (route === '/projects' && method === 'POST') {
      const body = await request.json()
      const project = await prisma.project.create({
        data: {
          id: uuidv4(),
          title: body.title,
          description: body.description,
          image: body.image,
          goalAmount: parseFloat(body.goalAmount),
          status: body.status || 'CURRENT',
          deadline: body.deadline ? new Date(body.deadline) : null
        }
      })
      return handleCORS(NextResponse.json(project))
    }

    // Single project
    const projectMatch = route.match(/^\/projects\/([^/]+)$/)
    if (projectMatch && method === 'GET') {
      const project = await prisma.project.findUnique({
        where: { id: projectMatch[1] },
        include: {
          donations: {
            where: { status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: { id: true, amount: true, donorName: true, anonymous: true, createdAt: true, message: true }
          }
        }
      })
      if (!project) {
        return handleCORS(NextResponse.json({ error: 'Project not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(project))
    }

    if (projectMatch && method === 'PUT') {
      const body = await request.json()
      const project = await prisma.project.update({
        where: { id: projectMatch[1] },
        data: {
          title: body.title,
          description: body.description,
          image: body.image,
          goalAmount: body.goalAmount ? parseFloat(body.goalAmount) : undefined,
          status: body.status,
          deadline: body.deadline ? new Date(body.deadline) : undefined
        }
      })
      return handleCORS(NextResponse.json(project))
    }

    if (projectMatch && method === 'DELETE') {
      await prisma.project.delete({ where: { id: projectMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ==================== DONATIONS ====================
    if (route === '/donations' && method === 'POST') {
      const body = await request.json()
      
      const donation = await prisma.donation.create({
        data: {
          id: uuidv4(),
          amount: parseFloat(body.amount),
          currency: body.currency || 'XAF',
          donorName: body.anonymous ? 'Anonymous' : body.donorName,
          donorEmail: body.donorEmail,
          message: body.message,
          anonymous: body.anonymous || false,
          projectId: body.projectId,
          userId: body.userId || null,
          status: 'COMPLETED' // Mock: auto-complete
        }
      })

      // Update project current amount
      await prisma.project.update({
        where: { id: body.projectId },
        data: { currentAmount: { increment: parseFloat(body.amount) } }
      })

      // Create payment record
      await prisma.payment.create({
        data: {
          id: uuidv4(),
          amount: parseFloat(body.amount),
          currency: body.currency || 'XAF',
          type: 'DONATION',
          status: 'COMPLETED',
          paymentMethod: body.paymentMethod || 'mock',
          donationId: donation.id,
          userId: body.userId || null
        }
      })

      return handleCORS(NextResponse.json(donation))
    }

    if (route === '/donations' && method === 'GET') {
      const url = new URL(request.url)
      const projectId = url.searchParams.get('projectId')
      const userId = url.searchParams.get('userId')
      
      const where = {}
      if (projectId) where.projectId = projectId
      if (userId) where.userId = userId
      
      const donations = await prisma.donation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { project: { select: { title: true } } }
      })
      return handleCORS(NextResponse.json(donations))
    }

    // ==================== MUSIC ====================
    if (route === '/music' && method === 'GET') {
      const url = new URL(request.url)
      const genre = url.searchParams.get('genre')
      const artist = url.searchParams.get('artist')
      const search = url.searchParams.get('search')
      
      const where = {}
      if (genre) where.genre = genre
      if (artist) where.artist = { contains: artist, mode: 'insensitive' }
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { artist: { contains: search, mode: 'insensitive' } },
          { album: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      const music = await prisma.music.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })
      return handleCORS(NextResponse.json(music))
    }

    if (route === '/music' && method === 'POST') {
      const body = await request.json()
      const music = await prisma.music.create({
        data: {
          id: uuidv4(),
          title: body.title,
          artist: body.artist,
          album: body.album,
          genre: body.genre,
          duration: body.duration,
          price: parseFloat(body.price),
          currency: body.currency || 'XAF',
          coverImage: body.coverImage,
          audioFile: body.audioFile,
          previewFile: body.previewFile,
          sheetMusic: body.sheetMusic,
          isHymn: body.isHymn || false,
          releaseDate: body.releaseDate ? new Date(body.releaseDate) : null
        }
      })
      return handleCORS(NextResponse.json(music))
    }

    // Single music
    const musicMatch = route.match(/^\/music\/([^/]+)$/)
    if (musicMatch && method === 'GET') {
      const music = await prisma.music.findUnique({ where: { id: musicMatch[1] } })
      if (!music) {
        return handleCORS(NextResponse.json({ error: 'Music not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(music))
    }

    if (musicMatch && method === 'PUT') {
      const body = await request.json()
      const music = await prisma.music.update({
        where: { id: musicMatch[1] },
        data: body
      })
      return handleCORS(NextResponse.json(music))
    }

    if (musicMatch && method === 'DELETE') {
      await prisma.music.delete({ where: { id: musicMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ==================== PURCHASES ====================
    if (route === '/purchases' && method === 'POST') {
      const body = await request.json()
      
      const music = await prisma.music.findUnique({ where: { id: body.musicId } })
      if (!music) {
        return handleCORS(NextResponse.json({ error: 'Music not found' }, { status: 404 }))
      }

      const purchase = await prisma.purchase.create({
        data: {
          id: uuidv4(),
          amount: music.price,
          currency: music.currency,
          musicId: body.musicId,
          userId: body.userId || null,
          guestEmail: body.guestEmail,
          downloadUrl: music.audioFile,
          status: 'COMPLETED' // Mock: auto-complete
        }
      })

      // Create payment record
      await prisma.payment.create({
        data: {
          id: uuidv4(),
          amount: music.price,
          currency: music.currency,
          type: 'PURCHASE',
          status: 'COMPLETED',
          paymentMethod: body.paymentMethod || 'mock',
          purchaseId: purchase.id,
          userId: body.userId || null
        }
      })

      return handleCORS(NextResponse.json(purchase))
    }

    if (route === '/purchases' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      const purchases = await prisma.purchase.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: 'desc' },
        include: { music: true }
      })
      return handleCORS(NextResponse.json(purchases))
    }

    // ==================== STATS (Admin) ====================
    if (route === '/admin/stats' && method === 'GET') {
      const [totalDonations, totalPurchases, totalUsers, projectStats, recentDonations] = await Promise.all([
        prisma.donation.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true }, _count: true }),
        prisma.purchase.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true }, _count: true }),
        prisma.user.count(),
        prisma.project.findMany({ select: { id: true, title: true, goalAmount: true, currentAmount: true, status: true } }),
        prisma.donation.findMany({ where: { status: 'COMPLETED' }, orderBy: { createdAt: 'desc' }, take: 5, include: { project: { select: { title: true } } } })
      ])

      return handleCORS(NextResponse.json({
        donations: { total: totalDonations._sum.amount || 0, count: totalDonations._count },
        purchases: { total: totalPurchases._sum.amount || 0, count: totalPurchases._count },
        users: totalUsers,
        projects: projectStats,
        recentDonations
      }))
    }

    // ==================== USERS (Admin) ====================
    if (route === '/admin/users' && method === 'GET') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, role: true, createdAt: true, image: true }
      })
      return handleCORS(NextResponse.json(users))
    }

    // ==================== PAYMENTS ====================
    if (route === '/payments' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      const payments = await prisma.payment.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: 'desc' },
        include: {
          donation: { include: { project: { select: { title: true } } } },
          purchase: { include: { music: { select: { title: true, artist: true } } } }
        }
      })
      return handleCORS(NextResponse.json(payments))
    }

    // ==================== SEED DATA ====================
    if (route === '/seed' && method === 'POST') {
      // Create sample projects
      const projects = await Promise.all([
        prisma.project.upsert({
          where: { id: 'proj-1' },
          update: {},
          create: {
            id: 'proj-1',
            title: 'New Choir Robes 2025',
            description: 'Help us purchase beautiful new choir robes for our upcoming international tour. These robes will represent G2 Melody at concerts across Africa and Europe.',
            image: 'https://images.pexels.com/photos/444658/pexels-photo-444658.jpeg',
            goalAmount: 5000000,
            currentAmount: 2350000,
            status: 'CURRENT',
            deadline: new Date('2025-08-31')
          }
        }),
        prisma.project.upsert({
          where: { id: 'proj-2' },
          update: {},
          create: {
            id: 'proj-2',
            title: 'Music Studio Equipment',
            description: 'We are raising funds to upgrade our recording studio with professional-grade equipment to produce high-quality gospel music albums.',
            image: 'https://images.pexels.com/photos/9182272/pexels-photo-9182272.jpeg',
            goalAmount: 10000000,
            currentAmount: 4500000,
            status: 'CURRENT',
            deadline: new Date('2025-12-31')
          }
        }),
        prisma.project.upsert({
          where: { id: 'proj-3' },
          update: {},
          create: {
            id: 'proj-3',
            title: 'Youth Music Training Program',
            description: 'Support our initiative to train 100 young musicians in vocal technique, music theory, and worship leadership.',
            image: 'https://images.pexels.com/photos/10206936/pexels-photo-10206936.jpeg',
            goalAmount: 3000000,
            currentAmount: 3000000,
            status: 'PAST'
          }
        })
      ])

      // Create sample music
      const music = await Promise.all([
        prisma.music.upsert({
          where: { id: 'music-1' },
          update: {},
          create: {
            id: 'music-1',
            title: 'Hallelujah Praise',
            artist: 'G2 Melody',
            album: 'Songs of Worship Vol. 1',
            genre: 'Gospel',
            duration: 245,
            price: 500,
            coverImage: 'https://images.unsplash.com/photo-1652626627227-acc5ce198876',
            isHymn: false
          }
        }),
        prisma.music.upsert({
          where: { id: 'music-2' },
          update: {},
          create: {
            id: 'music-2',
            title: 'Amazing Grace (Choir Version)',
            artist: 'G2 Melody',
            album: 'Classic Hymns',
            genre: 'Hymn',
            duration: 312,
            price: 500,
            coverImage: 'https://images.pexels.com/photos/444658/pexels-photo-444658.jpeg',
            isHymn: true
          }
        }),
        prisma.music.upsert({
          where: { id: 'music-3' },
          update: {},
          create: {
            id: 'music-3',
            title: 'Joyful Celebration',
            artist: 'G2 Melody',
            album: 'Songs of Worship Vol. 1',
            genre: 'Gospel',
            duration: 198,
            price: 500,
            coverImage: 'https://images.pexels.com/photos/9182272/pexels-photo-9182272.jpeg',
            isHymn: false
          }
        }),
        prisma.music.upsert({
          where: { id: 'music-4' },
          update: {},
          create: {
            id: 'music-4',
            title: 'How Great Thou Art',
            artist: 'G2 Melody',
            album: 'Classic Hymns',
            genre: 'Hymn',
            duration: 278,
            price: 500,
            coverImage: 'https://images.pexels.com/photos/10206936/pexels-photo-10206936.jpeg',
            isHymn: true
          }
        }),
        prisma.music.upsert({
          where: { id: 'music-5' },
          update: {},
          create: {
            id: 'music-5',
            title: 'African Worship Medley',
            artist: 'G2 Melody',
            album: 'African Roots',
            genre: 'African Gospel',
            duration: 425,
            price: 750,
            coverImage: 'https://images.unsplash.com/photo-1652626627227-acc5ce198876',
            isHymn: false
          }
        })
      ])

      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 12)
      const admin = await prisma.user.upsert({
        where: { email: 'admin@g2melody.com' },
        update: {},
        create: {
          id: 'admin-1',
          email: 'admin@g2melody.com',
          password: adminPassword,
          name: 'G2 Melody Admin',
          role: 'ADMIN'
        }
      })

      return handleCORS(NextResponse.json({ success: true, projects: projects.length, music: music.length, admin: admin.email }))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
