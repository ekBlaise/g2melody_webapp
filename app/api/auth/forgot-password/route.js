import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account exists, password reset instructions have been sent' 
      })
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() }
    })

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    
    // Create new reset token (expires in 1 hour)
    await prisma.passwordResetToken.create({
      data: {
        id: uuidv4(),
        email: email.toLowerCase(),
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    })

    // In production, you would send an email here
    // For now, we'll log the reset link (MOCKED)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`
    
    console.log('===========================================')
    console.log('PASSWORD RESET REQUEST (MOCKED EMAIL)')
    console.log('===========================================')
    console.log(`To: ${email}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log('===========================================')

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset Your G2 Melody Password',
    //   html: `
    //     <h1>Password Reset</h1>
    //     <p>You requested to reset your password.</p>
    //     <p>Click the link below to reset your password (valid for 1 hour):</p>
    //     <a href="${resetUrl}">Reset Password</a>
    //     <p>If you didn't request this, please ignore this email.</p>
    //   `
    // })

    return NextResponse.json({ 
      success: true, 
      message: 'If an account exists, password reset instructions have been sent',
      // Include token in dev mode for testing (remove in production)
      ...(process.env.NODE_ENV === 'development' && { debug_token: token })
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
