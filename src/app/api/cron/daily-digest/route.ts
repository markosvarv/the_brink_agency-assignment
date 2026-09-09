import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendDailyDigestEmail } from '@/utilities/email'

export async function GET(req: NextRequest) {
  return handleDailyDigest(req)
}

export async function POST(req: NextRequest) {
  return handleDailyDigest(req)
}

async function handleDailyDigest(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const secretQuery = req.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.CRON_SECRET

    // Optional secret check if configured in production
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}` && secretQuery !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recipient = process.env.DAILY_DIGEST_EMAIL || 'vacancy@example.com'
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Find all submissions that haven't been included in the daily digest yet
    const pendingSubmissions = await payload.find({
      collection: 'contact-submissions',
      where: {
        dailyDigestSent: {
          equals: false,
        },
      },
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
    })

    const docs = pendingSubmissions.docs || []
    console.log(`[Daily Digest] Found ${docs.length} pending submissions to digest.`)

    if (docs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new submissions to digest at this time.',
        count: 0,
      })
    }

    // Prepare data for email
    const emailData = docs.map((doc: any) => ({
      name: doc.name,
      company: doc.company,
      phone: doc.phone,
      email: doc.email,
      message: doc.message,
      createdAt: doc.createdAt,
    }))

    // Dispatch email to vacancy@example.com
    await sendDailyDigestEmail(emailData, recipient)

    // Mark docs as included in daily digest
    for (const doc of docs) {
      try {
        await payload.update({
          collection: 'contact-submissions',
          id: doc.id,
          data: {
            dailyDigestSent: true,
          },
          overrideAccess: true,
        })
      } catch (updateErr) {
        console.warn(`Failed to update dailyDigestSent for doc ${doc.id}:`, updateErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Daily digest successfully sent to ${recipient}`,
      count: docs.length,
      recipient,
    })
  } catch (error: any) {
    console.error('Error generating daily digest email:', error)
    return NextResponse.json(
      { error: 'Failed to generate daily digest email', details: error.message },
      { status: 500 }
    )
  }
}
