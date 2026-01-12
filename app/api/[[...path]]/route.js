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

    // ==================== AUTH - User Registration ====================
    if (route === '/register' && method === 'POST') {
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

      return handleCORS(NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }))
    }

    // ==================== FORGOT PASSWORD ====================
    if (route === '/forgot-password' && method === 'POST') {
      const body = await request.json()
      const { email } = body

      if (!email) {
        return handleCORS(NextResponse.json({ error: 'Email is required' }, { status: 400 }))
      }

      const user = await prisma.user.findUnique({ where: { email } })
      
      // Always return success to prevent email enumeration attacks
      if (!user) {
        return handleCORS(NextResponse.json({ 
          success: true, 
          message: 'If an account with this email exists, a password reset link has been sent.' 
        }))
      }

      // In production, you would:
      // 1. Generate a secure reset token
      // 2. Store the token with expiration in the database
      // 3. Send an email with the reset link
      // For now, we'll mock this behavior
      
      const resetToken = uuidv4()
      // In production: await sendEmail({ to: email, subject: 'Password Reset', ... })
      
      console.log(`[MOCK] Password reset requested for ${email}. Token: ${resetToken}`)
      
      return handleCORS(NextResponse.json({ 
        success: true, 
        message: 'If an account with this email exists, a password reset link has been sent.' 
      }))
    }

    // ==================== CONTACT FORM ====================
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      const { name, email, subject, message } = body

      // In production, send email or store in database
      console.log(`[CONTACT] From: ${name} <${email}>, Subject: ${subject}`)
      
      return handleCORS(NextResponse.json({ 
        success: true, 
        message: 'Your message has been received. We will get back to you soon.' 
      }))
    }

    // ==================== MEMBERSHIP APPLICATION ====================
    if (route === '/membership-application' && method === 'POST') {
      const body = await request.json()
      
      // Store membership application (could be a separate table, using metadata in user for now)
      const application = {
        id: uuidv4(),
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth,
        location: body.location,
        congregation: body.congregation,
        musicalExperience: body.musicalExperience,
        vocalPart: body.vocalPart,
        instrument: body.instrument,
        whyJoin: body.whyJoin,
        howHeard: body.howHeard,
        commitment: body.commitment,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
      
      // For now, we'll store in a simple way - in production this would be a separate table
      // Creating a user with pending status
      const existingUser = await prisma.user.findUnique({ where: { email: body.email } })
      if (existingUser) {
        return handleCORS(NextResponse.json({ error: 'An application with this email already exists' }, { status: 400 }))
      }
      
      // Store application as a pending user with metadata
      const user = await prisma.user.create({
        data: {
          id: application.id,
          email: body.email,
          name: body.fullName,
          role: 'USER', // Will be upgraded to MEMBER by admin
        }
      })

      return handleCORS(NextResponse.json({ 
        success: true, 
        message: 'Your membership application has been submitted. We will review it and get back to you soon.',
        applicationId: application.id 
      }))
    }

    // ==================== ADMIN - Create Member ====================
    if (route === '/admin/members' && method === 'POST') {
      const body = await request.json()
      const { email, name, password, vocalPart } = body

      if (!email || !name) {
        return handleCORS(NextResponse.json({ error: 'Email and name required' }, { status: 400 }))
      }

      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        // Upgrade to member
        const member = await prisma.user.update({
          where: { email },
          data: { role: 'MEMBER' }
        })
        return handleCORS(NextResponse.json(member))
      }

      const hashedPassword = password ? await bcrypt.hash(password, 12) : await bcrypt.hash('g2melody2024', 12)
      const member = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          name,
          password: hashedPassword,
          role: 'MEMBER'
        }
      })

      return handleCORS(NextResponse.json(member))
    }

    if (route === '/admin/members' && method === 'GET') {
      const members = await prisma.user.findMany({
        where: { role: { in: ['MEMBER', 'ADMIN'] } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, role: true, createdAt: true, image: true }
      })
      return handleCORS(NextResponse.json(members))
    }

    // ==================== PROJECTS ====================
    if (route === '/projects' && method === 'GET') {
      const url = new URL(request.url)
      const status = url.searchParams.get('status')
      const category = url.searchParams.get('category')
      
      const where = {}
      if (status) where.status = status.toUpperCase()
      
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
            take: 20,
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
      // Increment play count
      await prisma.music.update({
        where: { id: musicMatch[1] },
        data: { plays: { increment: 1 } }
      })
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
      const [totalDonations, totalPurchases, totalUsers, totalMembers, projectStats, recentDonations] = await Promise.all([
        prisma.donation.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true }, _count: true }),
        prisma.purchase.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true }, _count: true }),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: { in: ['MEMBER', 'ADMIN'] } } }),
        prisma.project.findMany({ select: { id: true, title: true, goalAmount: true, currentAmount: true, status: true } }),
        prisma.donation.findMany({ where: { status: 'COMPLETED' }, orderBy: { createdAt: 'desc' }, take: 5, include: { project: { select: { title: true } } } })
      ])

      return handleCORS(NextResponse.json({
        donations: { total: totalDonations._sum.amount || 0, count: totalDonations._count },
        purchases: { total: totalPurchases._sum.amount || 0, count: totalPurchases._count },
        users: totalUsers,
        members: totalMembers,
        projects: projectStats,
        recentDonations
      }))
    }

    // ==================== USERS (Admin) ====================
    if (route === '/admin/users' && method === 'GET') {
      const url = new URL(request.url)
      const role = url.searchParams.get('role')
      
      const where = role ? { role } : {}
      const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, role: true, createdAt: true, image: true }
      })
      return handleCORS(NextResponse.json(users))
    }

    // Update user role
    const userRoleMatch = route.match(/^\/admin\/users\/([^/]+)\/role$/)
    if (userRoleMatch && method === 'PUT') {
      const body = await request.json()
      const user = await prisma.user.update({
        where: { id: userRoleMatch[1] },
        data: { role: body.role }
      })
      return handleCORS(NextResponse.json(user))
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

    // ==================== CONTACT ====================
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      // In production, this would send an email or store in database
      console.log('Contact form submission:', body)
      return handleCORS(NextResponse.json({ 
        success: true, 
        message: 'Your message has been sent. We will get back to you soon.' 
      }))
    }

    // ==================== SEED DATA ====================
    if (route === '/seed' && method === 'POST') {
      // Create G2 Meloverse sub-projects
      const meloverseBuildingImage = '/g2-meloverse.jpg'
      
      const projects = await Promise.all([
        // G2 Meloverse - Main Project
        prisma.project.upsert({
          where: { id: 'proj-meloverse' },
          update: {},
          create: {
            id: 'proj-meloverse',
            title: 'G2 Meloverse - Multi-purpose Facility',
            description: 'Our vision project to establish a state-of-the-art multi-purpose facility in Buea, Cameroon. This facility will house the G2 Music Academy, Recording Studios, Radio Station, and community spaces. Total project cost: 267,766,773 FCFA over 5 years (2027-2032).',
            image: meloverseBuildingImage,
            goalAmount: 267766773,
            currentAmount: 15000000,
            status: 'CURRENT',
            deadline: new Date('2032-06-30')
          }
        }),
        // Sub-project: Land Acquisition
        prisma.project.upsert({
          where: { id: 'proj-land' },
          update: {},
          create: {
            id: 'proj-land',
            title: 'G2 Land Acquisition',
            description: 'Acquire 0.5 to 1 hectare of land in the vicinity of Buea for the G2 Meloverse facility. This is the foundational step for all our building projects.',
            image: 'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg',
            goalAmount: 20000000,
            currentAmount: 5000000,
            status: 'CURRENT',
            deadline: new Date('2027-12-31')
          }
        }),
        // Sub-project: Recording Studio
        prisma.project.upsert({
          where: { id: 'proj-studio' },
          update: {},
          create: {
            id: 'proj-studio',
            title: 'G2 Recording Studio',
            description: 'Build a professional recording studio with state-of-the-art audio equipment including microphones, preamps, mixing consoles, and acoustic treatment. This studio will serve both commercial purposes and G2 productions.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            goalAmount: 33000000,
            currentAmount: 2500000,
            status: 'CURRENT',
            deadline: new Date('2030-12-31')
          }
        }),
        // Sub-project: Radio Station
        prisma.project.upsert({
          where: { id: 'proj-radio' },
          update: {},
          create: {
            id: 'proj-radio',
            title: 'Church of Christ Radio Station',
            description: 'Establish a radio station to broadcast church-related content, music, and choir programs. This will serve as a powerful platform for evangelism and reaching communities across Cameroon.',
            image: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg',
            goalAmount: 36200000,
            currentAmount: 1500000,
            status: 'CURRENT',
            deadline: new Date('2030-06-30')
          }
        }),
        // Sub-project: Music Academy
        prisma.project.upsert({
          where: { id: 'proj-academy' },
          update: {},
          create: {
            id: 'proj-academy',
            title: 'G2 Music Academy',
            description: 'Establish a music academy in Cameroon that can confer degrees in music studies. Includes classrooms, practice rooms, musical instruments, and partnerships with international institutions.',
            image: 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg',
            goalAmount: 15000000,
            currentAmount: 500000,
            status: 'CURRENT',
            deadline: new Date('2030-12-31')
          }
        }),
        // Sub-project: Community Water (Forage)
        prisma.project.upsert({
          where: { id: 'proj-water' },
          update: {},
          create: {
            id: 'proj-water',
            title: 'Community Water Project (Forage)',
            description: 'Provide free, clean water to the local community through a borehole project. This serves as a means of local evangelism and demonstrating Christ\'s love through service.',
            image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
            goalAmount: 2500000,
            currentAmount: 500000,
            status: 'CURRENT',
            deadline: new Date('2028-12-31')
          }
        }),
        // Completed project example
        prisma.project.upsert({
          where: { id: 'proj-album' },
          update: {},
          create: {
            id: 'proj-album',
            title: 'Unfathomable Love Album (2019)',
            description: 'Our debut album project that was successfully funded and produced. The album showcases the beauty of four-part harmony and acapella worship.',
            image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
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
            album: 'Unfathomable Love',
            genre: 'Gospel',
            duration: 245,
            price: 500,
            coverImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
            isHymn: false
          }
        }),
        prisma.music.upsert({
          where: { id: 'music-2' },
          update: {},
          create: {
            id: 'music-2',
            title: 'Amazing Grace (Acapella)',
            artist: 'G2 Melody',
            album: 'Classic Hymns Collection',
            genre: 'Hymn',
            duration: 312,
            price: 500,
            coverImage: 'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg',
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
            album: 'Unfathomable Love',
            genre: 'Gospel',
            duration: 198,
            price: 500,
            coverImage: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
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
            album: 'Classic Hymns Collection',
            genre: 'Hymn',
            duration: 278,
            price: 500,
            coverImage: 'https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg',
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
            coverImage: 'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg',
            isHymn: false
          }
        }),
        prisma.music.upsert({
          where: { id: 'music-6' },
          update: {},
          create: {
            id: 'music-6',
            title: 'Unfathomable Love',
            artist: 'G2 Melody',
            album: 'Unfathomable Love',
            genre: 'Gospel',
            duration: 356,
            price: 750,
            coverImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
            isHymn: false
          }
        })
      ])

      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 12)
      const admin = await prisma.user.upsert({
        where: { email: 'admin@g2melody.com' },
        update: { role: 'ADMIN' },
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
