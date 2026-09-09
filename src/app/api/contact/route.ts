import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendSubmitterConfirmationEmail } from '@/utilities/email'

// In-memory rate limiting store: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps)
    return false
  }

  validTimestamps.push(now)
  rateLimitMap.set(ip, validTimestamps)
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1'

    // 1. Anti-Spam: IP Rate Limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Too many submissions from your network. Please wait a few minutes before trying again.',
        },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
    }

    const {
      name,
      company,
      phone,
      email,
      message,
      website_url, // Honeypot trap field
      timestamp, // Time-to-submit verification token
    } = body

    // 2. Anti-Spam: Honeypot Check
    // If the hidden honeypot field is filled, it is an automated bot.
    // Return a fake success response to prevent bots from retrying/probing.
    if (website_url && String(website_url).trim().length > 0) {
      console.warn(`[Anti-Spam] Bot detected via honeypot trap from IP: ${ip}`)
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! We will be in touch shortly.',
      })
    }

    // 3. Anti-Spam: Timing Check
    // Normal users take at least 2.5 seconds to fill out the form.
    // If submitted faster than 2500ms, flag as automated bot.
    if (timestamp) {
      const parsedTime = Number(timestamp)
      if (!isNaN(parsedTime) && Date.now() - parsedTime < 2500) {
        console.warn(`[Anti-Spam] Fast automated submission detected (< 2.5s) from IP: ${ip}`)
        return NextResponse.json({
          success: true,
          message: 'Thank you for your message! We will be in touch shortly.',
        })
      }
    }

    // 4. Server-Side Validation: Required fields & formats
    const errors: Record<string, string> = {}

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid e-mail address.'
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      errors.message = 'Message must be at least 5 characters long.'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 })
    }

    // 5. Store Submission in Payload CMS with access override
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const newDoc = await payload.create({
      collection: 'contact-submissions',
      data: {
        name: name.trim(),
        company: company ? String(company).trim() : '',
        phone: phone ? String(phone).trim() : '',
        email: email.trim().toLowerCase(),
        message: message.trim(),
        ipAddress: ip,
        isRead: false,
        confirmationEmailSent: false,
        dailyDigestSent: false,
      },
      overrideAccess: true,
    })

    // 6. Send Automated Confirmation Email to the individual
    try {
      await sendSubmitterConfirmationEmail({
        name: name.trim(),
        company: company ? String(company).trim() : undefined,
        phone: phone ? String(phone).trim() : undefined,
        email: email.trim().toLowerCase(),
        message: message.trim(),
      })

      // Update confirmation email sent status
      if (newDoc?.id) {
        await payload.update({
          collection: 'contact-submissions',
          id: newDoc.id,
          data: {
            confirmationEmailSent: true,
          },
          overrideAccess: true,
        })
      }
    } catch (emailErr) {
      console.error('Error sending confirmation email to submitter:', emailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! We have received your message and sent a confirmation email.',
      id: newDoc.id,
    })
  } catch (error: any) {
    console.error('Contact form submission server error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request. Please try again later.' },
      { status: 500 }
    )
  }
}
