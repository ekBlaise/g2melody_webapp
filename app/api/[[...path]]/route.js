import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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
          currentAmount: body.currentAmount ? parseFloat(body.currentAmount) : undefined,
          status: body.status,
          deadline: body.deadline ? new Date(body.deadline) : null
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

    // ==================== SITE SETTINGS ====================
    if (route === '/settings' && method === 'GET') {
      // Get site settings (public)
      let settings = await prisma.siteSettings.findFirst()
      
      if (!settings) {
        // Create default settings if not exists
        settings = await prisma.siteSettings.create({
          data: {
            id: 'site-settings',
            memberCount: 50,
            studentsCount: 100,
            programsCount: 6,
            yearsActive: 8,
            albumDescription: 'Our debut album featuring original compositions that showcase the beauty of four-part harmony and acapella worship.'
          }
        })
      }
      
      return handleCORS(NextResponse.json(settings))
    }

    if (route === '/admin/settings' && method === 'PUT') {
      // Update site settings (admin only - should be protected in production)
      const body = await request.json()
      
      let settings = await prisma.siteSettings.findFirst()
      
      if (!settings) {
        settings = await prisma.siteSettings.create({
          data: {
            id: 'site-settings',
            memberCount: body.memberCount || 50,
            studentsCount: body.studentsCount || 100,
            programsCount: body.programsCount || 6,
            yearsActive: body.yearsActive || 8,
            albumDescription: body.albumDescription || ''
          }
        })
      } else {
        settings = await prisma.siteSettings.update({
          where: { id: 'site-settings' },
          data: {
            memberCount: body.memberCount !== undefined ? body.memberCount : settings.memberCount,
            studentsCount: body.studentsCount !== undefined ? body.studentsCount : settings.studentsCount,
            programsCount: body.programsCount !== undefined ? body.programsCount : settings.programsCount,
            yearsActive: body.yearsActive !== undefined ? body.yearsActive : settings.yearsActive,
            albumDescription: body.albumDescription !== undefined ? body.albumDescription : settings.albumDescription
          }
        })
      }
      
      return handleCORS(NextResponse.json(settings))
    }

    // ==================== FOUNDERS ====================
    if (route === '/founders' && method === 'GET') {
      const founders = await prisma.founder.findMany({
        orderBy: { order: 'asc' }
      })
      return handleCORS(NextResponse.json(founders))
    }

    if (route === '/admin/founders' && method === 'POST') {
      const body = await request.json()
      const founder = await prisma.founder.create({
        data: {
          id: uuidv4(),
          name: body.name,
          role: body.role,
          bio: body.bio,
          image: body.image,
          order: body.order || 0
        }
      })
      return handleCORS(NextResponse.json(founder))
    }

    const founderMatch = route.match(/^\/admin\/founders\/([^/]+)$/)
    if (founderMatch && method === 'PUT') {
      const body = await request.json()
      const founder = await prisma.founder.update({
        where: { id: founderMatch[1] },
        data: {
          name: body.name,
          role: body.role,
          bio: body.bio,
          image: body.image,
          order: body.order
        }
      })
      return handleCORS(NextResponse.json(founder))
    }

    if (founderMatch && method === 'DELETE') {
      await prisma.founder.delete({ where: { id: founderMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ==================== CHOIR MEMBERS ====================
    if (route === '/choir-members' && method === 'GET') {
      const url = new URL(request.url)
      const status = url.searchParams.get('status')
      
      const where = {}
      if (status && status !== 'all') {
        where.status = status.toUpperCase()
      }
      
      const members = await prisma.choirMember.findMany({
        where,
        orderBy: [{ order: 'asc' }, { name: 'asc' }]
      })
      return handleCORS(NextResponse.json(members))
    }

    if (route === '/admin/choir-members' && method === 'POST') {
      const body = await request.json()
      const member = await prisma.choirMember.create({
        data: {
          id: uuidv4(),
          name: body.name,
          image: body.image,
          vocalPart: body.vocalPart || 'NONE',
          yearJoined: body.yearJoined ? parseInt(body.yearJoined) : null,
          status: body.status || 'ACTIVE',
          role: body.role,
          isFounding: body.isFounding || false,
          order: body.order || 0
        }
      })
      return handleCORS(NextResponse.json(member))
    }

    const choirMemberMatch = route.match(/^\/admin\/choir-members\/([^/]+)$/)
    if (choirMemberMatch && method === 'PUT') {
      const body = await request.json()
      const member = await prisma.choirMember.update({
        where: { id: choirMemberMatch[1] },
        data: {
          name: body.name,
          image: body.image,
          vocalPart: body.vocalPart,
          yearJoined: body.yearJoined ? parseInt(body.yearJoined) : null,
          status: body.status,
          role: body.role,
          isFounding: body.isFounding,
          order: body.order
        }
      })
      return handleCORS(NextResponse.json(member))
    }

    if (choirMemberMatch && method === 'DELETE') {
      await prisma.choirMember.delete({ where: { id: choirMemberMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ==================== HISTORY EVENTS ====================
    if (route === '/history' && method === 'GET') {
      const events = await prisma.historyEvent.findMany({
        orderBy: { order: 'asc' }
      })
      return handleCORS(NextResponse.json(events))
    }

    if (route === '/admin/history' && method === 'POST') {
      const body = await request.json()
      const event = await prisma.historyEvent.create({
        data: {
          id: uuidv4(),
          year: body.year,
          title: body.title,
          description: body.description,
          colorVariant: body.colorVariant || 'amber',
          order: body.order || 0
        }
      })
      return handleCORS(NextResponse.json(event))
    }

    const historyMatch = route.match(/^\/admin\/history\/([^/]+)$/)
    if (historyMatch && method === 'PUT') {
      const body = await request.json()
      const event = await prisma.historyEvent.update({
        where: { id: historyMatch[1] },
        data: {
          year: body.year,
          title: body.title,
          description: body.description,
          colorVariant: body.colorVariant,
          order: body.order
        }
      })
      return handleCORS(NextResponse.json(event))
    }

    if (historyMatch && method === 'DELETE') {
      await prisma.historyEvent.delete({ where: { id: historyMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ==================== LEARNING PLATFORM APIs ====================
    
    // COURSES
    if (route === '/courses' && method === 'GET') {
      const url = new URL(request.url)
      const published = url.searchParams.get('published')
      
      const where = {}
      if (published === 'true') where.isPublished = true
      
      const courses = await prisma.course.findMany({
        where,
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { lessons: true, enrollments: true } }
        }
      })
      return handleCORS(NextResponse.json(courses))
    }

    if (route === '/courses' && method === 'POST') {
      const body = await request.json()
      const course = await prisma.course.create({
        data: {
          id: uuidv4(),
          title: body.title,
          description: body.description,
          image: body.image,
          emoji: body.emoji || '🎵',
          duration: body.duration,
          level: body.level || 'Beginner',
          totalLessons: body.totalLessons || 0,
          isPublished: body.isPublished ?? true,
          order: body.order || 0
        }
      })
      return handleCORS(NextResponse.json(course))
    }

    const courseMatch = route.match(/^\/courses\/([^/]+)$/)
    if (courseMatch && method === 'GET') {
      const course = await prisma.course.findUnique({
        where: { id: courseMatch[1] },
        include: {
          lessons: { orderBy: { order: 'asc' } },
          _count: { select: { enrollments: true } }
        }
      })
      if (!course) {
        return handleCORS(NextResponse.json({ error: 'Course not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(course))
    }

    if (courseMatch && method === 'PUT') {
      const body = await request.json()
      const course = await prisma.course.update({
        where: { id: courseMatch[1] },
        data: body
      })
      return handleCORS(NextResponse.json(course))
    }

    if (courseMatch && method === 'DELETE') {
      await prisma.course.delete({ where: { id: courseMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // LESSONS
    if (route === '/lessons' && method === 'GET') {
      const url = new URL(request.url)
      const courseId = url.searchParams.get('courseId')
      
      const where = {}
      if (courseId) where.courseId = courseId
      
      const lessons = await prisma.lesson.findMany({
        where,
        orderBy: { order: 'asc' },
        include: { course: { select: { title: true } } }
      })
      return handleCORS(NextResponse.json(lessons))
    }

    if (route === '/lessons' && method === 'POST') {
      const body = await request.json()
      const lesson = await prisma.lesson.create({
        data: {
          id: uuidv4(),
          courseId: body.courseId,
          title: body.title,
          description: body.description,
          content: body.content,
          videoUrl: body.videoUrl,
          audioUrl: body.audioUrl,
          duration: body.duration,
          order: body.order || 0,
          isPublished: body.isPublished ?? true
        }
      })
      
      // Update course totalLessons count
      await prisma.course.update({
        where: { id: body.courseId },
        data: { totalLessons: { increment: 1 } }
      })
      
      return handleCORS(NextResponse.json(lesson))
    }

    const lessonMatch = route.match(/^\/lessons\/([^/]+)$/)
    if (lessonMatch && method === 'GET') {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonMatch[1] },
        include: { course: true }
      })
      if (!lesson) {
        return handleCORS(NextResponse.json({ error: 'Lesson not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(lesson))
    }

    if (lessonMatch && method === 'PUT') {
      const body = await request.json()
      const lesson = await prisma.lesson.update({
        where: { id: lessonMatch[1] },
        data: body
      })
      return handleCORS(NextResponse.json(lesson))
    }

    if (lessonMatch && method === 'DELETE') {
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonMatch[1] } })
      if (lesson) {
        await prisma.lesson.delete({ where: { id: lessonMatch[1] } })
        // Update course totalLessons count
        await prisma.course.update({
          where: { id: lesson.courseId },
          data: { totalLessons: { decrement: 1 } }
        })
      }
      return handleCORS(NextResponse.json({ success: true }))
    }

    // USER ENROLLMENTS
    if (route === '/enrollments' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: { lessons: { orderBy: { order: 'asc' } } }
          }
        },
        orderBy: { lastAccessedAt: 'desc' }
      })
      return handleCORS(NextResponse.json(enrollments))
    }

    if (route === '/enrollments' && method === 'POST') {
      const body = await request.json()
      
      // Check if already enrolled
      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: body.userId, courseId: body.courseId } }
      })
      if (existing) {
        return handleCORS(NextResponse.json(existing))
      }
      
      const enrollment = await prisma.enrollment.create({
        data: {
          id: uuidv4(),
          userId: body.userId,
          courseId: body.courseId
        },
        include: { course: true }
      })
      return handleCORS(NextResponse.json(enrollment))
    }

    const enrollmentMatch = route.match(/^\/enrollments\/([^/]+)$/)
    if (enrollmentMatch && method === 'PUT') {
      const body = await request.json()
      const enrollment = await prisma.enrollment.update({
        where: { id: enrollmentMatch[1] },
        data: {
          progress: body.progress,
          completedLessons: body.completedLessons,
          lastAccessedAt: new Date(),
          completedAt: body.progress >= 100 ? new Date() : null
        }
      })
      return handleCORS(NextResponse.json(enrollment))
    }

    // LESSON PROGRESS
    if (route === '/lesson-progress' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      const lessonId = url.searchParams.get('lessonId')
      
      const where = {}
      if (userId) where.userId = userId
      if (lessonId) where.lessonId = lessonId
      
      const progress = await prisma.lessonProgress.findMany({
        where,
        include: { lesson: { select: { title: true, courseId: true } } }
      })
      return handleCORS(NextResponse.json(progress))
    }

    if (route === '/lesson-progress' && method === 'POST') {
      const body = await request.json()
      
      const progress = await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId: body.userId, lessonId: body.lessonId } },
        update: {
          completed: body.completed ?? false,
          watchTime: body.watchTime ? { increment: body.watchTime } : undefined,
          completedAt: body.completed ? new Date() : null
        },
        create: {
          id: uuidv4(),
          userId: body.userId,
          lessonId: body.lessonId,
          completed: body.completed ?? false,
          watchTime: body.watchTime || 0,
          completedAt: body.completed ? new Date() : null
        }
      })
      
      // Update enrollment progress if lesson completed
      if (body.completed) {
        const lesson = await prisma.lesson.findUnique({ where: { id: body.lessonId } })
        if (lesson) {
          const course = await prisma.course.findUnique({ where: { id: lesson.courseId } })
          const completedCount = await prisma.lessonProgress.count({
            where: { userId: body.userId, completed: true, lesson: { courseId: lesson.courseId } }
          })
          const progressPercent = course.totalLessons > 0 
            ? Math.round((completedCount / course.totalLessons) * 100) 
            : 0
          
          await prisma.enrollment.updateMany({
            where: { userId: body.userId, courseId: lesson.courseId },
            data: { 
              progress: progressPercent, 
              completedLessons: completedCount,
              lastAccessedAt: new Date(),
              completedAt: progressPercent >= 100 ? new Date() : null
            }
          })
        }
      }
      
      return handleCORS(NextResponse.json(progress))
    }

    // PRACTICE TRACKS
    if (route === '/practice-tracks' && method === 'GET') {
      const url = new URL(request.url)
      const type = url.searchParams.get('type')
      const vocalPart = url.searchParams.get('vocalPart')
      
      const where = { isPublished: true }
      if (type) where.type = type
      if (vocalPart) where.vocalPart = vocalPart.toUpperCase()
      
      const tracks = await prisma.practiceTrack.findMany({
        where,
        orderBy: { order: 'asc' }
      })
      return handleCORS(NextResponse.json(tracks))
    }

    if (route === '/practice-tracks' && method === 'POST') {
      const body = await request.json()
      const track = await prisma.practiceTrack.create({
        data: {
          id: uuidv4(),
          title: body.title,
          description: body.description,
          audioUrl: body.audioUrl,
          duration: body.duration,
          type: body.type || 'Exercise',
          vocalPart: body.vocalPart || 'NONE',
          difficulty: body.difficulty || 'Beginner',
          isPublished: body.isPublished ?? true,
          order: body.order || 0
        }
      })
      return handleCORS(NextResponse.json(track))
    }

    const practiceTrackMatch = route.match(/^\/practice-tracks\/([^/]+)$/)
    if (practiceTrackMatch && method === 'PUT') {
      const body = await request.json()
      const track = await prisma.practiceTrack.update({
        where: { id: practiceTrackMatch[1] },
        data: body
      })
      return handleCORS(NextResponse.json(track))
    }

    if (practiceTrackMatch && method === 'DELETE') {
      await prisma.practiceTrack.delete({ where: { id: practiceTrackMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // PRACTICE SESSIONS (User logging practice)
    if (route === '/practice-sessions' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      const sessions = await prisma.practiceSession.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      })
      return handleCORS(NextResponse.json(sessions))
    }

    if (route === '/practice-sessions' && method === 'POST') {
      const body = await request.json()
      
      const session = await prisma.practiceSession.create({
        data: {
          id: uuidv4(),
          userId: body.userId,
          trackId: body.trackId,
          duration: body.duration,
          notes: body.notes
        }
      })
      
      // Update user stats
      await prisma.userStats.upsert({
        where: { userId: body.userId },
        update: {
          totalPracticeMinutes: { increment: body.duration },
          lastPracticeDate: new Date(),
          currentStreak: { increment: 1 }
        },
        create: {
          id: uuidv4(),
          userId: body.userId,
          totalPracticeMinutes: body.duration,
          lastPracticeDate: new Date(),
          currentStreak: 1
        }
      })
      
      return handleCORS(NextResponse.json(session))
    }

    // USER STATS
    if (route === '/user-stats' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      let stats = await prisma.userStats.findUnique({ where: { userId } })
      
      if (!stats) {
        // Create default stats
        stats = await prisma.userStats.create({
          data: {
            id: uuidv4(),
            userId
          }
        })
      }
      
      // Also get lesson completion count
      const completedLessons = await prisma.lessonProgress.count({
        where: { userId, completed: true }
      })
      
      return handleCORS(NextResponse.json({ ...stats, totalLessonsCompleted: completedLessons }))
    }

    if (route === '/user-stats' && method === 'PUT') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      const body = await request.json()
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      const stats = await prisma.userStats.upsert({
        where: { userId },
        update: body,
        create: {
          id: uuidv4(),
          userId,
          ...body
        }
      })
      return handleCORS(NextResponse.json(stats))
    }

    // ACHIEVEMENTS
    if (route === '/achievements' && method === 'GET') {
      const achievements = await prisma.achievement.findMany({
        orderBy: { createdAt: 'asc' }
      })
      return handleCORS(NextResponse.json(achievements))
    }

    if (route === '/achievements' && method === 'POST') {
      const body = await request.json()
      const achievement = await prisma.achievement.create({
        data: {
          id: uuidv4(),
          name: body.name,
          description: body.description,
          icon: body.icon,
          type: body.type || 'milestone',
          requirement: body.requirement
        }
      })
      return handleCORS(NextResponse.json(achievement))
    }

    // USER ACHIEVEMENTS
    if (route === '/user-achievements' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { earnedAt: 'desc' }
      })
      
      // Map to just return achievements with earnedAt
      const result = userAchievements.map(ua => ({
        ...ua.achievement,
        earnedAt: ua.earnedAt
      }))
      
      return handleCORS(NextResponse.json(result))
    }

    if (route === '/user-achievements' && method === 'POST') {
      const body = await request.json()
      
      // Check if already earned
      const existing = await prisma.userAchievement.findUnique({
        where: { userId_achievementId: { userId: body.userId, achievementId: body.achievementId } }
      })
      if (existing) {
        return handleCORS(NextResponse.json({ message: 'Achievement already earned' }))
      }
      
      const userAchievement = await prisma.userAchievement.create({
        data: {
          id: uuidv4(),
          userId: body.userId,
          achievementId: body.achievementId
        },
        include: { achievement: true }
      })
      return handleCORS(NextResponse.json(userAchievement))
    }

    // NOTIFICATIONS
    if (route === '/notifications' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      const unreadOnly = url.searchParams.get('unreadOnly')
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      const where = { userId }
      if (unreadOnly === 'true') where.isRead = false
      
      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 20
      })
      return handleCORS(NextResponse.json(notifications))
    }

    if (route === '/notifications' && method === 'POST') {
      const body = await request.json()
      const notification = await prisma.notification.create({
        data: {
          id: uuidv4(),
          userId: body.userId,
          title: body.title,
          message: body.message,
          type: body.type || 'info',
          link: body.link
        }
      })
      return handleCORS(NextResponse.json(notification))
    }

    const notificationMatch = route.match(/^\/notifications\/([^/]+)\/read$/)
    if (notificationMatch && method === 'PUT') {
      const notification = await prisma.notification.update({
        where: { id: notificationMatch[1] },
        data: { isRead: true }
      })
      return handleCORS(NextResponse.json(notification))
    }

    if (route === '/notifications/mark-all-read' && method === 'PUT') {
      const body = await request.json()
      await prisma.notification.updateMany({
        where: { userId: body.userId, isRead: false },
        data: { isRead: true }
      })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // SCHEDULE ITEMS
    if (route === '/schedule' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      const fromDate = url.searchParams.get('from')
      
      // Get both public events and user-specific events
      const where = {
        OR: [
          { isPublic: true },
          { userId: userId || '' }
        ],
        date: fromDate ? { gte: new Date(fromDate) } : { gte: new Date() }
      }
      
      const schedule = await prisma.scheduleItem.findMany({
        where,
        orderBy: { date: 'asc' },
        take: 10
      })
      return handleCORS(NextResponse.json(schedule))
    }

    if (route === '/schedule' && method === 'POST') {
      const body = await request.json()
      const item = await prisma.scheduleItem.create({
        data: {
          id: uuidv4(),
          title: body.title,
          description: body.description,
          date: new Date(body.date),
          time: body.time,
          type: body.type || 'event',
          isPublic: body.isPublic ?? true,
          userId: body.userId
        }
      })
      return handleCORS(NextResponse.json(item))
    }

    const scheduleMatch = route.match(/^\/schedule\/([^/]+)$/)
    if (scheduleMatch && method === 'PUT') {
      const body = await request.json()
      const item = await prisma.scheduleItem.update({
        where: { id: scheduleMatch[1] },
        data: {
          title: body.title,
          description: body.description,
          date: body.date ? new Date(body.date) : undefined,
          time: body.time,
          type: body.type,
          isPublic: body.isPublic
        }
      })
      return handleCORS(NextResponse.json(item))
    }

    if (scheduleMatch && method === 'DELETE') {
      await prisma.scheduleItem.delete({ where: { id: scheduleMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // DASHBOARD SUMMARY (aggregated data for dashboard)
    if (route === '/dashboard/learner' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      // Get all data in parallel
      const [
        enrollments,
        userStats,
        practiceSessions,
        userAchievements,
        notifications,
        schedule,
        practiceTracks
      ] = await Promise.all([
        prisma.enrollment.findMany({
          where: { userId },
          include: { course: { include: { lessons: true } } },
          orderBy: { lastAccessedAt: 'desc' }
        }),
        prisma.userStats.findUnique({ where: { userId } }),
        prisma.practiceSession.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 10
        }),
        prisma.userAchievement.findMany({
          where: { userId },
          include: { achievement: true }
        }),
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5
        }),
        prisma.scheduleItem.findMany({
          where: {
            OR: [{ isPublic: true }, { userId }],
            date: { gte: new Date() }
          },
          orderBy: { date: 'asc' },
          take: 5
        }),
        prisma.practiceTrack.findMany({
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          take: 10
        })
      ])
      
      // Calculate overall progress
      const totalLessons = enrollments.reduce((sum, e) => sum + (e.course?.totalLessons || 0), 0)
      const completedLessons = enrollments.reduce((sum, e) => sum + (e.completedLessons || 0), 0)
      const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      
      return handleCORS(NextResponse.json({
        progress: {
          overallProgress,
          totalLessons,
          completedLessons,
          practiceHours: userStats ? Math.round(userStats.totalPracticeMinutes / 60 * 10) / 10 : 0,
          currentStreak: userStats?.currentStreak || 0,
          nextMilestone: completedLessons < 10 ? 'Complete 10 lessons' : 
                         completedLessons < 25 ? 'Complete 25 lessons' : 'Complete 50 lessons'
        },
        courses: enrollments.map(e => ({
          id: e.course.id,
          title: e.course.title,
          emoji: e.course.emoji,
          progress: e.progress,
          totalLessons: e.course.totalLessons,
          completedLessons: e.completedLessons
        })),
        practiceTracks,
        achievements: userAchievements.map(ua => ({
          ...ua.achievement,
          earnedAt: ua.earnedAt
        })),
        notifications,
        schedule,
        stats: userStats || { currentStreak: 0, totalPracticeMinutes: 0, vocalPart: 'NONE' }
      }))
    }

    // SUPPORTER DASHBOARD
    if (route === '/dashboard/supporter' && method === 'GET') {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      
      if (!userId) {
        return handleCORS(NextResponse.json({ error: 'userId required' }, { status: 400 }))
      }
      
      const [userDonations, topDonors] = await Promise.all([
        prisma.donation.findMany({
          where: { userId, status: 'COMPLETED' },
          include: { project: { select: { title: true } } },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.donation.groupBy({
          by: ['donorName'],
          where: { status: 'COMPLETED', anonymous: false },
          _sum: { amount: true },
          orderBy: { _sum: { amount: 'desc' } },
          take: 10
        })
      ])
      
      const totalDonations = userDonations.reduce((sum, d) => sum + d.amount, 0)
      
      return handleCORS(NextResponse.json({
        stats: {
          totalDonations,
          donationCount: userDonations.length,
          studentsSupported: Math.floor(totalDonations / 50000), // Estimate
          badgesEarned: totalDonations >= 100000 ? 3 : totalDonations >= 50000 ? 2 : totalDonations > 0 ? 1 : 0
        },
        donations: userDonations,
        leaderboard: topDonors.map((d, i) => ({
          rank: i + 1,
          name: d.donorName || 'Anonymous',
          amount: d._sum.amount,
          badge: d._sum.amount >= 500000 ? 'Gold Patron' : 
                 d._sum.amount >= 250000 ? 'Silver Patron' : 'Bronze Patron'
        })),
        impact: {
          learnersSupported: Math.floor(totalDonations / 50000),
          lessonsEnabled: Math.floor(totalDonations / 5000),
          songsRecorded: Math.floor(totalDonations / 100000)
        }
      }))
    }

    // ==================== IMAGE UPLOAD ====================
    if (route === '/upload' && method === 'POST') {
      try {
        const formData = await request.formData()
        const file = formData.get('file')
        
        if (!file) {
          return handleCORS(NextResponse.json({ error: 'No file provided' }, { status: 400 }))
        }

        // Check file size (2MB limit)
        const MAX_SIZE = 2 * 1024 * 1024 // 2MB in bytes
        if (file.size > MAX_SIZE) {
          return handleCORS(NextResponse.json({ 
            error: 'File too large. Maximum size is 2MB.' 
          }, { status: 400 }))
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          return handleCORS(NextResponse.json({ 
            error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
          }, { status: 400 }))
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        console.log('File name:', file.name)
        const ext = file.name ? file.name.split('.').pop()?.toLowerCase() || 'jpg' : 'jpg'
        const filename = `${uuidv4()}.${ext}`
        console.log('Generated filename:', filename)
        
        // Ensure uploads directory exists
        console.log('Current working directory:', process.cwd())
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        console.log('Upload directory:', uploadDir)
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true })
        }

        // Write file
        const filepath = path.join(uploadDir, filename)
        console.log('File path:', filepath)
        await writeFile(filepath, buffer)

        // Return the public URL
        const url = `/uploads/${filename}`
        return handleCORS(NextResponse.json({ url, filename, size: file.size }))
      } catch (error) {
        console.error('Upload error:', error)
        return handleCORS(NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 }))
      }
    }

    // ==================== NEWS & EVENTS ====================
    
    // Get all news/events
    if (route === '/news' && method === 'GET') {
      const url = new URL(request.url)
      const type = url.searchParams.get('type') // news, event, announcement
      const featured = url.searchParams.get('featured')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      
      const where = { isPublished: true }
      if (type) where.type = type
      if (featured === 'true') where.isFeatured = true
      
      const news = await prisma.newsEvent.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: limit
      })
      return handleCORS(NextResponse.json(news))
    }

    // Get single news/event
    const newsDetailMatch = route.match(/^\/news\/([^/]+)$/)
    if (newsDetailMatch && method === 'GET') {
      const news = await prisma.newsEvent.findUnique({
        where: { id: newsDetailMatch[1] }
      })
      if (!news) {
        return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
      }
      return handleCORS(NextResponse.json(news))
    }

    // Admin: Create news/event
    if (route === '/admin/news' && method === 'POST') {
      const body = await request.json()
      const news = await prisma.newsEvent.create({
        data: {
          id: uuidv4(),
          title: body.title,
          slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          summary: body.summary,
          content: body.content,
          image: body.image,
          type: body.type || 'news',
          eventDate: body.eventDate ? new Date(body.eventDate) : null,
          eventTime: body.eventTime,
          eventLocation: body.eventLocation,
          isFeatured: body.isFeatured ?? false,
          isPublished: body.isPublished ?? true,
          publishedAt: body.isPublished ? new Date() : null,
          author: body.author
        }
      })
      return handleCORS(NextResponse.json(news))
    }

    // Admin: Update news/event
    const adminNewsMatch = route.match(/^\/admin\/news\/([^/]+)$/)
    if (adminNewsMatch && method === 'PUT') {
      const body = await request.json()
      const news = await prisma.newsEvent.update({
        where: { id: adminNewsMatch[1] },
        data: {
          title: body.title,
          slug: body.slug,
          summary: body.summary,
          content: body.content,
          image: body.image,
          type: body.type,
          eventDate: body.eventDate ? new Date(body.eventDate) : null,
          eventTime: body.eventTime,
          eventLocation: body.eventLocation,
          isFeatured: body.isFeatured,
          isPublished: body.isPublished,
          publishedAt: body.isPublished && !body.publishedAt ? new Date() : body.publishedAt,
          author: body.author,
          updatedAt: new Date()
        }
      })
      return handleCORS(NextResponse.json(news))
    }

    // Admin: Delete news/event
    if (adminNewsMatch && method === 'DELETE') {
      await prisma.newsEvent.delete({ where: { id: adminNewsMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ==================== AWARDS ====================
    
    // Get all awards (public)
    if (route === '/awards' && method === 'GET') {
      const awards = await prisma.award.findMany({
        orderBy: [{ year: 'desc' }, { order: 'asc' }]
      })
      return handleCORS(NextResponse.json(awards))
    }

    // Admin: Create award
    if (route === '/admin/awards' && method === 'POST') {
      const body = await request.json()
      const award = await prisma.award.create({
        data: {
          id: uuidv4(),
          title: body.title,
          description: body.description,
          year: parseInt(body.year),
          image: body.image,
          awardingOrganization: body.awardingOrganization,
          category: body.category,
          order: body.order || 0
        }
      })
      return handleCORS(NextResponse.json(award))
    }

    // Admin: Update award
    const awardMatch = route.match(/^\/admin\/awards\/([^/]+)$/)
    if (awardMatch && method === 'PUT') {
      const body = await request.json()
      const award = await prisma.award.update({
        where: { id: awardMatch[1] },
        data: {
          title: body.title,
          description: body.description,
          year: body.year ? parseInt(body.year) : undefined,
          image: body.image,
          awardingOrganization: body.awardingOrganization,
          category: body.category,
          order: body.order
        }
      })
      return handleCORS(NextResponse.json(award))
    }

    // Admin: Delete award
    if (awardMatch && method === 'DELETE') {
      await prisma.award.delete({ where: { id: awardMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ==================== GALLERY ====================
    
    // Get gallery items (public) - supports filtering by year and category
    if (route === '/gallery' && method === 'GET') {
      const url = new URL(request.url)
      const year = url.searchParams.get('year')
      const category = url.searchParams.get('category')
      const featured = url.searchParams.get('featured')
      
      const where = {}
      if (year) where.year = parseInt(year)
      if (category) where.category = category
      if (featured === 'true') where.isFeatured = true
      
      const items = await prisma.galleryItem.findMany({
        where,
        orderBy: [{ year: 'desc' }, { order: 'asc' }]
      })
      return handleCORS(NextResponse.json(items))
    }

    // Get unique years and categories for filters
    if (route === '/gallery/filters' && method === 'GET') {
      const [years, categories] = await Promise.all([
        prisma.galleryItem.findMany({
          select: { year: true },
          distinct: ['year'],
          orderBy: { year: 'desc' }
        }),
        prisma.galleryItem.findMany({
          select: { category: true },
          distinct: ['category'],
          orderBy: { category: 'asc' }
        })
      ])
      return handleCORS(NextResponse.json({
        years: years.map(y => y.year),
        categories: categories.map(c => c.category)
      }))
    }

    // Admin: Create gallery item
    if (route === '/admin/gallery' && method === 'POST') {
      const body = await request.json()
      const item = await prisma.galleryItem.create({
        data: {
          id: uuidv4(),
          title: body.title,
          description: body.description,
          imageUrl: body.imageUrl,
          year: parseInt(body.year),
          category: body.category,
          eventName: body.eventName,
          order: body.order || 0,
          isFeatured: body.isFeatured || false
        }
      })
      return handleCORS(NextResponse.json(item))
    }

    // Admin: Update gallery item
    const galleryMatch = route.match(/^\/admin\/gallery\/([^/]+)$/)
    if (galleryMatch && method === 'PUT') {
      const body = await request.json()
      const item = await prisma.galleryItem.update({
        where: { id: galleryMatch[1] },
        data: {
          title: body.title,
          description: body.description,
          imageUrl: body.imageUrl,
          year: body.year ? parseInt(body.year) : undefined,
          category: body.category,
          eventName: body.eventName,
          order: body.order,
          isFeatured: body.isFeatured
        }
      })
      return handleCORS(NextResponse.json(item))
    }

    // Admin: Delete gallery item
    if (galleryMatch && method === 'DELETE') {
      await prisma.galleryItem.delete({ where: { id: galleryMatch[1] } })
      return handleCORS(NextResponse.json({ success: true }))
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

      // Create founders
      const founders = await Promise.all([
        prisma.founder.upsert({
          where: { id: 'founder-1' },
          update: {},
          create: {
            id: 'founder-1',
            name: 'Minister Andy Leroy',
            role: 'Co-Founder & Visionary',
            bio: 'Minister Andy Leroy conceived the idea of a unified choir dedicated to the TV program "Gospel Guardians" in a conversation with Ekwoge Blaise in late 2016. His vision for musical evangelism laid the foundation for what G2 Melody has become today.',
            image: null,
            order: 1
          }
        }),
        prisma.founder.upsert({
          where: { id: 'founder-2' },
          update: {},
          create: {
            id: 'founder-2',
            name: 'Ekwoge Blaise',
            role: 'Co-Founder & Director',
            bio: 'Ekwoge Blaise co-conceived the idea of G2 Melody and has been instrumental in its growth. He persevered through the early challenges when membership dwindled to just 2-3 members, and continues to serve as a founding member and leader of the choir.',
            image: null,
            order: 2
          }
        })
      ])

      // Create choir members from the documents
      const choirMembers = await Promise.all([
        // Founding members still serving
        prisma.choirMember.upsert({
          where: { id: 'member-1' },
          update: {},
          create: { id: 'member-1', name: 'Ngeh Canisia', vocalPart: 'SOPRANO', yearJoined: 2016, status: 'ACTIVE', isFounding: true, order: 1 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-2' },
          update: {},
          create: { id: 'member-2', name: 'Tambe Faith', vocalPart: 'SOPRANO', yearJoined: 2016, status: 'ACTIVE', isFounding: true, order: 2 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-3' },
          update: {},
          create: { id: 'member-3', name: 'Abeh Nadia', vocalPart: 'ALTO', yearJoined: 2016, status: 'ACTIVE', isFounding: true, order: 3 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-4' },
          update: {},
          create: { id: 'member-4', name: 'Ekwoge Blaise', vocalPart: 'TENOR', yearJoined: 2016, status: 'ACTIVE', isFounding: true, role: 'Director', order: 4 }
        }),
        // Sopranos
        prisma.choirMember.upsert({
          where: { id: 'member-5' },
          update: {},
          create: { id: 'member-5', name: 'Ngobiri Falyne', vocalPart: 'SOPRANO', yearJoined: 2016, status: 'ALUMNI', isFounding: true, order: 5 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-6' },
          update: {},
          create: { id: 'member-6', name: 'Mokwe Vanel', vocalPart: 'SOPRANO', yearJoined: 2019, status: 'ACTIVE', order: 6 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-7' },
          update: {},
          create: { id: 'member-7', name: 'Ojage Naomi', vocalPart: 'SOPRANO', yearJoined: 2020, status: 'ACTIVE', order: 7 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-8' },
          update: {},
          create: { id: 'member-8', name: 'Tambe Marie', vocalPart: 'SOPRANO', yearJoined: 2018, status: 'ACTIVE', order: 8 }
        }),
        // Altos
        prisma.choirMember.upsert({
          where: { id: 'member-9' },
          update: {},
          create: { id: 'member-9', name: 'Abuarah Karein', vocalPart: 'ALTO', yearJoined: 2019, status: 'ACTIVE', order: 9 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-10' },
          update: {},
          create: { id: 'member-10', name: 'Babanema Diane', vocalPart: 'ALTO', yearJoined: 2020, status: 'ACTIVE', order: 10 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-11' },
          update: {},
          create: { id: 'member-11', name: 'Tifang Susan', vocalPart: 'ALTO', yearJoined: 2018, status: 'ACTIVE', order: 11 }
        }),
        // Tenors
        prisma.choirMember.upsert({
          where: { id: 'member-12' },
          update: {},
          create: { id: 'member-12', name: 'Etta Brandon', vocalPart: 'TENOR', yearJoined: 2019, status: 'ACTIVE', order: 12 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-13' },
          update: {},
          create: { id: 'member-13', name: 'Leku Eric', vocalPart: 'TENOR', yearJoined: 2020, status: 'ACTIVE', order: 13 }
        }),
        // Bass
        prisma.choirMember.upsert({
          where: { id: 'member-14' },
          update: {},
          create: { id: 'member-14', name: 'Eweh Ivo', vocalPart: 'BASS', yearJoined: 2016, status: 'ALUMNI', isFounding: true, order: 14 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-15' },
          update: {},
          create: { id: 'member-15', name: 'Desmon Kappie', vocalPart: 'BASS', yearJoined: 2019, status: 'ACTIVE', order: 15 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-16' },
          update: {},
          create: { id: 'member-16', name: 'Ayuk Salathiel', vocalPart: 'BASS', yearJoined: 2020, status: 'ACTIVE', order: 16 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-17' },
          update: {},
          create: { id: 'member-17', name: 'Akumtoh Derick', vocalPart: 'BASS', yearJoined: 2020, status: 'ACTIVE', order: 17 }
        }),
        // Theosortians
        prisma.choirMember.upsert({
          where: { id: 'member-18' },
          update: {},
          create: { id: 'member-18', name: 'Ndenge Gerald', vocalPart: 'NONE', yearJoined: 2020, status: 'THEOSORTIAN', role: 'Theosortian', order: 18 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-19' },
          update: {},
          create: { id: 'member-19', name: 'Oliver Peyele', vocalPart: 'NONE', yearJoined: 2020, status: 'THEOSORTIAN', role: 'Theosortian', order: 19 }
        }),
        prisma.choirMember.upsert({
          where: { id: 'member-20' },
          update: {},
          create: { id: 'member-20', name: 'Bechem Manfred', vocalPart: 'NONE', yearJoined: 2020, status: 'THEOSORTIAN', role: 'Theosortian', order: 20 }
        }),
        // Sponsor example
        prisma.choirMember.upsert({
          where: { id: 'member-21' },
          update: {},
          create: { id: 'member-21', name: 'Sister Mafani Patricia', vocalPart: 'NONE', yearJoined: 2020, status: 'SPONSOR', role: 'Matron & Sponsor', order: 21 }
        })
      ])

      // ==================== LEARNING PLATFORM SEED DATA ====================
      
      // Create courses
      const courses = await Promise.all([
        prisma.course.upsert({
          where: { id: 'course-1' },
          update: {},
          create: {
            id: 'course-1',
            title: 'Vocal Fundamentals',
            description: 'Learn the basics of vocal technique, breathing, and voice control. Perfect for beginners starting their musical journey.',
            emoji: '🎤',
            duration: '8 weeks',
            level: 'Beginner',
            totalLessons: 12,
            isPublished: true,
            order: 1
          }
        }),
        prisma.course.upsert({
          where: { id: 'course-2' },
          update: {},
          create: {
            id: 'course-2',
            title: 'Four-Part Harmony',
            description: 'Master the art of four-part harmony singing. Learn how Soprano, Alto, Tenor, and Bass voices blend together.',
            emoji: '🎵',
            duration: '10 weeks',
            level: 'Intermediate',
            totalLessons: 8,
            isPublished: true,
            order: 2
          }
        }),
        prisma.course.upsert({
          where: { id: 'course-3' },
          update: {},
          create: {
            id: 'course-3',
            title: 'Sight Reading Basics',
            description: 'Learn to read music notation and develop your sight-reading skills. Essential for any serious musician.',
            emoji: '📖',
            duration: '6 weeks',
            level: 'Beginner',
            totalLessons: 10,
            isPublished: true,
            order: 3
          }
        }),
        prisma.course.upsert({
          where: { id: 'course-4' },
          update: {},
          create: {
            id: 'course-4',
            title: 'Gospel Music Mastery',
            description: 'Dive deep into gospel music styles, techniques, and performance. Learn from the G2 Melody tradition.',
            emoji: '🙏',
            duration: '12 weeks',
            level: 'Advanced',
            totalLessons: 15,
            isPublished: true,
            order: 4
          }
        })
      ])

      // Create lessons for Vocal Fundamentals course
      const vocalLessons = await Promise.all([
        prisma.lesson.upsert({
          where: { id: 'lesson-1-1' },
          update: {},
          create: { id: 'lesson-1-1', courseId: 'course-1', title: 'Introduction to Singing', description: 'Welcome to vocal training! Learn about your voice and what to expect.', duration: 15, order: 1 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-2' },
          update: {},
          create: { id: 'lesson-1-2', courseId: 'course-1', title: 'Breathing Techniques', description: 'Learn proper diaphragmatic breathing for powerful singing.', duration: 20, order: 2 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-3' },
          update: {},
          create: { id: 'lesson-1-3', courseId: 'course-1', title: 'Posture and Stance', description: 'Correct posture is essential for optimal vocal performance.', duration: 15, order: 3 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-4' },
          update: {},
          create: { id: 'lesson-1-4', courseId: 'course-1', title: 'Warm-up Exercises', description: 'Essential warm-up routines to prepare your voice.', duration: 20, order: 4 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-5' },
          update: {},
          create: { id: 'lesson-1-5', courseId: 'course-1', title: 'Finding Your Range', description: 'Discover your vocal range and comfortable singing zones.', duration: 25, order: 5 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-6' },
          update: {},
          create: { id: 'lesson-1-6', courseId: 'course-1', title: 'Pitch Control', description: 'Develop accurate pitch and intonation skills.', duration: 20, order: 6 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-7' },
          update: {},
          create: { id: 'lesson-1-7', courseId: 'course-1', title: 'Vowel Shapes', description: 'Master vowel formation for clear, resonant singing.', duration: 20, order: 7 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-8' },
          update: {},
          create: { id: 'lesson-1-8', courseId: 'course-1', title: 'Consonant Articulation', description: 'Clear consonants for better diction and understanding.', duration: 20, order: 8 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-9' },
          update: {},
          create: { id: 'lesson-1-9', courseId: 'course-1', title: 'Dynamics and Expression', description: 'Add emotion and dynamics to your singing.', duration: 25, order: 9 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-10' },
          update: {},
          create: { id: 'lesson-1-10', courseId: 'course-1', title: 'Practice Song #1', description: 'Apply your skills to your first practice song.', duration: 30, order: 10 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-11' },
          update: {},
          create: { id: 'lesson-1-11', courseId: 'course-1', title: 'Cool-down Exercises', description: 'Important vocal cool-down routines after singing.', duration: 15, order: 11 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-1-12' },
          update: {},
          create: { id: 'lesson-1-12', courseId: 'course-1', title: 'Course Recap & Next Steps', description: 'Review what you learned and plan your continued journey.', duration: 20, order: 12 }
        })
      ])

      // Create lessons for Four-Part Harmony course
      const harmonyLessons = await Promise.all([
        prisma.lesson.upsert({
          where: { id: 'lesson-2-1' },
          update: {},
          create: { id: 'lesson-2-1', courseId: 'course-2', title: 'Introduction to Harmony', description: 'Understanding how voices combine to create harmony.', duration: 20, order: 1 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-2-2' },
          update: {},
          create: { id: 'lesson-2-2', courseId: 'course-2', title: 'Soprano Voice Role', description: 'The melody line and its importance in four-part harmony.', duration: 25, order: 2 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-2-3' },
          update: {},
          create: { id: 'lesson-2-3', courseId: 'course-2', title: 'Alto Voice Role', description: 'Supporting harmonies from the alto section.', duration: 25, order: 3 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-2-4' },
          update: {},
          create: { id: 'lesson-2-4', courseId: 'course-2', title: 'Tenor Voice Role', description: 'The middle ground of male voices in harmony.', duration: 25, order: 4 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-2-5' },
          update: {},
          create: { id: 'lesson-2-5', courseId: 'course-2', title: 'Bass Voice Role', description: 'The foundation of four-part harmony.', duration: 25, order: 5 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-2-6' },
          update: {},
          create: { id: 'lesson-2-6', courseId: 'course-2', title: 'Blending Voices', description: 'Techniques for achieving perfect vocal blend.', duration: 30, order: 6 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-2-7' },
          update: {},
          create: { id: 'lesson-2-7', courseId: 'course-2', title: 'Harmony Practice Song', description: 'Practice all four parts together on a classic hymn.', duration: 35, order: 7 }
        }),
        prisma.lesson.upsert({
          where: { id: 'lesson-2-8' },
          update: {},
          create: { id: 'lesson-2-8', courseId: 'course-2', title: 'Advanced Harmony Techniques', description: 'Take your harmony skills to the next level.', duration: 30, order: 8 }
        })
      ])

      // Create practice tracks
      const practiceTracks = await Promise.all([
        prisma.practiceTrack.upsert({
          where: { id: 'track-1' },
          update: {},
          create: { id: 'track-1', title: 'Soprano Scale Practice', description: 'Major and minor scales for soprano voices', duration: '5:30', type: 'Exercise', vocalPart: 'SOPRANO', difficulty: 'Beginner', order: 1 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-2' },
          update: {},
          create: { id: 'track-2', title: 'Alto Harmony Drills', description: 'Practice harmony lines for alto section', duration: '6:15', type: 'Exercise', vocalPart: 'ALTO', difficulty: 'Intermediate', order: 2 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-3' },
          update: {},
          create: { id: 'track-3', title: 'Tenor Range Exercises', description: 'Expand your tenor range with these exercises', duration: '4:45', type: 'Exercise', vocalPart: 'TENOR', difficulty: 'Beginner', order: 3 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-4' },
          update: {},
          create: { id: 'track-4', title: 'Bass Foundation Drills', description: 'Strengthen your bass voice fundamentals', duration: '5:00', type: 'Exercise', vocalPart: 'BASS', difficulty: 'Beginner', order: 4 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-5' },
          update: {},
          create: { id: 'track-5', title: 'Breathing Exercises', description: 'Diaphragmatic breathing for all voice types', duration: '3:00', type: 'Warm-up', vocalPart: 'NONE', difficulty: 'Beginner', order: 5 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-6' },
          update: {},
          create: { id: 'track-6', title: 'Unfathomable Love - Soprano Part', description: 'Practice track for G2 Melody original', duration: '4:15', type: 'Song', vocalPart: 'SOPRANO', difficulty: 'Intermediate', order: 6 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-7' },
          update: {},
          create: { id: 'track-7', title: 'Unfathomable Love - Alto Part', description: 'Practice track for G2 Melody original', duration: '4:15', type: 'Song', vocalPart: 'ALTO', difficulty: 'Intermediate', order: 7 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-8' },
          update: {},
          create: { id: 'track-8', title: 'Unfathomable Love - Tenor Part', description: 'Practice track for G2 Melody original', duration: '4:15', type: 'Song', vocalPart: 'TENOR', difficulty: 'Intermediate', order: 8 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-9' },
          update: {},
          create: { id: 'track-9', title: 'Unfathomable Love - Bass Part', description: 'Practice track for G2 Melody original', duration: '4:15', type: 'Song', vocalPart: 'BASS', difficulty: 'Intermediate', order: 9 }
        }),
        prisma.practiceTrack.upsert({
          where: { id: 'track-10' },
          update: {},
          create: { id: 'track-10', title: 'Harmony Drill #3', description: 'Four-part harmony practice exercise', duration: '6:45', type: 'Exercise', vocalPart: 'NONE', difficulty: 'Advanced', order: 10 }
        })
      ])

      // Create achievements
      const achievements = await Promise.all([
        prisma.achievement.upsert({
          where: { id: 'achieve-1' },
          update: {},
          create: { id: 'achieve-1', name: '7 Day Streak', description: 'Practice for 7 days in a row', icon: '🔥', type: 'streak' }
        }),
        prisma.achievement.upsert({
          where: { id: 'achieve-2' },
          update: {},
          create: { id: 'achieve-2', name: 'First Song', description: 'Complete your first song lesson', icon: '🎵', type: 'milestone' }
        }),
        prisma.achievement.upsert({
          where: { id: 'achieve-3' },
          update: {},
          create: { id: 'achieve-3', name: 'Quick Learner', description: 'Complete 5 lessons in a week', icon: '⭐', type: 'milestone' }
        }),
        prisma.achievement.upsert({
          where: { id: 'achieve-4' },
          update: {},
          create: { id: 'achieve-4', name: 'Dedicated Student', description: 'Complete 10 lessons total', icon: '📚', type: 'milestone' }
        }),
        prisma.achievement.upsert({
          where: { id: 'achieve-5' },
          update: {},
          create: { id: 'achieve-5', name: 'Practice Champion', description: 'Log 10 hours of practice', icon: '🏆', type: 'milestone' }
        }),
        prisma.achievement.upsert({
          where: { id: 'achieve-6' },
          update: {},
          create: { id: 'achieve-6', name: 'Course Graduate', description: 'Complete your first course', icon: '🎓', type: 'course' }
        }),
        prisma.achievement.upsert({
          where: { id: 'achieve-7' },
          update: {},
          create: { id: 'achieve-7', name: 'Early Bird', description: 'Practice before 8 AM', icon: '🌅', type: 'special' }
        }),
        prisma.achievement.upsert({
          where: { id: 'achieve-8' },
          update: {},
          create: { id: 'achieve-8', name: 'Night Owl', description: 'Practice after 10 PM', icon: '🦉', type: 'special' }
        })
      ])

      // Create schedule items
      const scheduleItems = await Promise.all([
        prisma.scheduleItem.upsert({
          where: { id: 'schedule-1' },
          update: { date: new Date(Date.now() + 1000 * 60 * 60 * 6) }, // 6 hours from now
          create: { id: 'schedule-1', title: 'Online Rehearsal', description: 'Weekly choir rehearsal via Zoom', date: new Date(Date.now() + 1000 * 60 * 60 * 6), time: '6:00 PM', type: 'rehearsal', isPublic: true }
        }),
        prisma.scheduleItem.upsert({
          where: { id: 'schedule-2' },
          update: { date: new Date(Date.now() + 1000 * 60 * 60 * 24) }, // 1 day from now
          create: { id: 'schedule-2', title: 'Vocal Training Session', description: 'Weekly vocal training with Bro. Blaise', date: new Date(Date.now() + 1000 * 60 * 60 * 24), time: '4:00 PM', type: 'lesson', isPublic: true }
        }),
        prisma.scheduleItem.upsert({
          where: { id: 'schedule-3' },
          update: { date: new Date(Date.now() + 1000 * 60 * 60 * 72) }, // 3 days from now
          create: { id: 'schedule-3', title: 'Assignment Due: Harmony Exercise', description: 'Submit your four-part harmony assignment', date: new Date(Date.now() + 1000 * 60 * 60 * 72), time: '11:59 PM', type: 'deadline', isPublic: true }
        }),
        prisma.scheduleItem.upsert({
          where: { id: 'schedule-4' },
          update: { date: new Date(Date.now() + 1000 * 60 * 60 * 168) }, // 7 days from now
          create: { id: 'schedule-4', title: 'Sunday Service Performance', description: 'G2 Melody leading worship at Church of Christ, Buea', date: new Date(Date.now() + 1000 * 60 * 60 * 168), time: '10:00 AM', type: 'event', isPublic: true }
        })
      ])

      return handleCORS(NextResponse.json({ 
        success: true, 
        projects: projects.length, 
        music: music.length, 
        admin: admin.email,
        founders: founders.length,
        choirMembers: choirMembers.length,
        // Learning platform data
        courses: courses.length,
        lessons: vocalLessons.length + harmonyLessons.length,
        practiceTracks: practiceTracks.length,
        achievements: achievements.length,
        scheduleItems: scheduleItems.length
      }))
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
