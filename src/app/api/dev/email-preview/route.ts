import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')
  const messageId = req.nextUrl.searchParams.get('id')

  const logsDir = path.resolve(process.cwd(), 'logs', 'emails')

  // 1. If a specific messageId is requested, serve that exact HTML file
  if (messageId) {
    const specificPath = path.join(logsDir, `email-${messageId}.html`)
    if (fs.existsSync(specificPath)) {
      const htmlContent = fs.readFileSync(specificPath, 'utf-8')
      return new NextResponse(htmlContent, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }
  }

  // 2. By default, check if a real user submission email exists in logs/emails/latest-email.html
  if (!type && fs.existsSync(path.join(logsDir, 'latest-email.html'))) {
    const latestHtml = fs.readFileSync(path.join(logsDir, 'latest-email.html'), 'utf-8')
    return new NextResponse(latestHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // 3. Daily Digest preview mode
  if (type === 'digest') {
    const sampleSubmissions = [
      {
        name: 'Ilaria Casi',
        company: 'Energy Solutions B.V.',
        email: 'ilaria@example.com',
        phone: '+31 342 987654',
        message: 'We would like to inquire about grid congestion solutions for our manufacturing plant.',
      },
      {
        name: 'Marcus Vance',
        company: 'Nordic Clean Energy',
        email: 'marcus@nordicenergy.co.uk',
        phone: '+44 20 7946 0912',
        message: 'Requesting maintenance schedule for wind turbine installations.',
      },
    ]

    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const count = sampleSubmissions.length
    const subject = `[The Brink] Daily Contact Inquiries Digest – ${dateStr} (${count} new)`

    const tableRows = sampleSubmissions
      .map((sub, idx) => `
        <tr style="border-bottom: 1px solid #27272a; background-color: ${idx % 2 === 0 ? '#121214' : '#18181b'};">
          <td style="padding: 12px 14px; color: #f4f4f5; font-size: 13px; font-weight: 500;">${sub.name}</td>
          <td style="padding: 12px 14px; color: #a1a1aa; font-size: 13px;">${sub.company}</td>
          <td style="padding: 12px 14px; color: #38bdf8; font-size: 13px;"><a href="mailto:${sub.email}" style="color: #38bdf8; text-decoration: none;">${sub.email}</a></td>
          <td style="padding: 12px 14px; color: #a1a1aa; font-size: 13px;">${sub.phone}</td>
          <td style="padding: 12px 14px; color: #d4d4d8; font-size: 13px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sub.message}</td>
        </tr>
      `)
      .join('')

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08080a; color: #ffffff; margin: 0; padding: 24px; }
          .container { max-width: 900px; margin: 0 auto; background-color: #121214; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 18px; font-weight: 700; letter-spacing: 2px; color: #ffffff; }
          .badge { background-color: #1d61ef; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
          h1 { font-size: 22px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0; }
          p { color: #a1a1aa; font-size: 14px; margin: 0 0 20px 0; }
          table { width: 100%; border-collapse: collapse; border: 1px solid #27272a; border-radius: 8px; overflow: hidden; margin-top: 16px; }
          th { background-color: #27272a; color: #f4f4f5; text-align: left; padding: 12px 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
          .footer { margin-top: 32px; border-top: 1px solid #27272a; padding-top: 20px; font-size: 12px; color: #71717a; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">THE BRINK</div>
            <span class="badge">${count} New Submissions</span>
          </div>
          <h1>Daily Contact Inquiries Digest</h1>
          <p>Below is a summary of all new contact form submissions received for <strong>${dateStr}</strong>.</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>Message Excerpt</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            <p>This automated digest is generated daily for <strong>vacancy@example.com</strong>.</p>
            <p style="margin: 0;">The Brink &bull; Inquiries Management System</p>
          </div>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // 4. Sample fallback if no actual submission email has been dispatched yet
  const sampleData = {
    name: 'Ilaria Casi',
    company: 'Energy Solutions B.V.',
    phone: '+31 342 987654',
    email: 'ilaria@example.com',
    message: 'We would like to inquire about grid congestion solutions for our manufacturing plant.',
  }

  const subject = 'Thank you for contacting The Brink – We received your message'
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08080a; color: #ffffff; margin: 0; padding: 24px; }
        .card { max-width: 600px; margin: 0 auto; background-color: #121214; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
        .logo { font-size: 20px; font-weight: 700; letter-spacing: 2px; color: #ffffff; margin-bottom: 24px; }
        h1 { font-size: 24px; font-weight: 600; color: #ffffff; margin-top: 0; margin-bottom: 16px; line-height: 1.3; }
        p { font-size: 15px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px 0; }
        .summary-box { background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .summary-row { margin-bottom: 12px; font-size: 14px; }
        .summary-row:last-child { margin-bottom: 0; }
        .label { color: #71717a; font-weight: 500; }
        .value { color: #f4f4f5; font-weight: 400; margin-left: 8px; }
        .divider { border-top: 1px solid #27272a; margin: 24px 0; }
        .footer { font-size: 13px; color: #71717a; text-align: center; }
        .footer strong { color: #a1a1aa; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">THE BRINK</div>
        <h1>Thank you for reaching out, ${sampleData.name}!</h1>
        <p>We have successfully received your inquiry. A member of our team is reviewing your details and will get back to you promptly.</p>
        
        <div class="summary-box">
          <div class="summary-row"><span class="label">Full Name:</span><span class="value">${sampleData.name}</span></div>
          <div class="summary-row"><span class="label">Company:</span><span class="value">${sampleData.company}</span></div>
          <div class="summary-row"><span class="label">Telephone:</span><span class="value">${sampleData.phone}</span></div>
          <div class="summary-row"><span class="label">Email:</span><span class="value">${sampleData.email}</span></div>
          <div class="summary-row" style="margin-top: 12px;"><span class="label">Message:</span></div>
          <p style="color: #e4e4e7; font-size: 14px; margin-top: 6px; white-space: pre-wrap;">${sampleData.message}</p>
        </div>

        <p>If your inquiry is urgent, you can always reach our emergency team 24/7 at <strong>0900 – 11 22 333</strong>.</p>

        <div class="divider"></div>
        <div class="footer">
          <p style="margin-bottom: 4px;">&copy; ${new Date().getFullYear()} The Brink Agency. All rights reserved.</p>
          <p style="margin: 0;">Emergency line – available 24/7 &bull; 0900 – 11 22 333</p>
        </div>
      </div>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
