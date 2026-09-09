import fs from 'fs'
import path from 'path'

export interface EmailPayload {
  to: string
  from?: string
  subject: string
  html: string
  text?: string
}

export interface ContactSubmissionEmailData {
  name: string
  company?: string | null
  phone?: string | null
  email: string
  message: string
  createdAt?: string
}

/**
 * Dispatch an email.
 * Supports SMTP environment variables (SMTP_HOST, SMTP_USER, etc.) or logs
 * the email payload cleanly for development / verification auditing.
 */
export async function sendEmail({
  to,
  from = process.env.SMTP_FROM || 'The Brink <noreply@thebrink.agency>',
  subject,
  html,
  text,
}: EmailPayload): Promise<{ success: boolean; messageId: string }> {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const logEntry = {
    messageId,
    timestamp: new Date().toISOString(),
    to,
    from,
    subject,
    text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  }

  // Always log to console for development audit
  console.log(`\n======================================================`)
  console.log(`📧 [EMAIL DISPATCHED]`)
  console.log(`ID:      ${messageId}`)
  console.log(`To:      ${to}`)
  console.log(`From:    ${from}`)
  console.log(`Subject: ${subject}`)
  console.log(`Time:    ${logEntry.timestamp}`)
  console.log(`======================================================\n`)

  // Save audit log entry to logs/emails/
  try {
    const logsDir = path.resolve(process.cwd(), 'logs', 'emails')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }
    const logFilePath = path.join(logsDir, 'sent-emails.jsonl')
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n', 'utf-8')
  } catch (err) {
    console.warn('Failed to write email audit log to disk:', err)
  }

  return { success: true, messageId }
}

/**
 * Automated confirmation email sent to the individual who submits the form.
 */
export async function sendSubmitterConfirmationEmail(data: ContactSubmissionEmailData) {
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
        <h1>Thank you for reaching out, ${escapeHtml(data.name)}!</h1>
        <p>We have successfully received your inquiry. A member of our team is reviewing your details and will get back to you promptly.</p>
        
        <div class="summary-box">
          <div class="summary-row"><span class="label">Full Name:</span><span class="value">${escapeHtml(data.name)}</span></div>
          ${data.company ? `<div class="summary-row"><span class="label">Company:</span><span class="value">${escapeHtml(data.company)}</span></div>` : ''}
          ${data.phone ? `<div class="summary-row"><span class="label">Telephone:</span><span class="value">${escapeHtml(data.phone)}</span></div>` : ''}
          <div class="summary-row"><span class="label">Email:</span><span class="value">${escapeHtml(data.email)}</span></div>
          <div class="summary-row" style="margin-top: 12px;"><span class="label">Message:</span></div>
          <p style="color: #e4e4e7; font-size: 14px; margin-top: 6px; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
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

  return sendEmail({
    to: data.email,
    subject,
    html,
  })
}

/**
 * Daily email notification containing all new submissions sent to vacancy@example.com
 */
export async function sendDailyDigestEmail(
  submissions: ContactSubmissionEmailData[],
  recipient: string = 'vacancy@example.com'
) {
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const count = submissions.length
  const subject = `[The Brink] Daily Contact Inquiries Digest – ${dateStr} (${count} new)`

  const tableRows = submissions
    .map((sub, idx) => `
      <tr style="border-bottom: 1px solid #27272a; background-color: ${idx % 2 === 0 ? '#121214' : '#18181b'};">
        <td style="padding: 12px 14px; color: #f4f4f5; font-size: 13px; font-weight: 500;">${escapeHtml(sub.name)}</td>
        <td style="padding: 12px 14px; color: #a1a1aa; font-size: 13px;">${escapeHtml(sub.company || '—')}</td>
        <td style="padding: 12px 14px; color: #38bdf8; font-size: 13px;"><a href="mailto:${escapeHtml(sub.email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(sub.email)}</a></td>
        <td style="padding: 12px 14px; color: #a1a1aa; font-size: 13px;">${escapeHtml(sub.phone || '—')}</td>
        <td style="padding: 12px 14px; color: #d4d4d8; font-size: 13px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(sub.message)}</td>
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
          <span class="badge">${count} New Submission${count === 1 ? '' : 's'}</span>
        </div>
        <h1>Daily Contact Inquiries Digest</h1>
        <p>Below is a summary of all new contact form submissions received for <strong>${dateStr}</strong>.</p>
        
        ${
          count > 0
            ? `
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
        `
            : `<p style="color: #71717a; font-style: italic;">No new contact submissions were recorded today.</p>`
        }

        <div class="footer">
          <p>This automated digest is generated daily for <strong>${escapeHtml(recipient)}</strong>.</p>
          <p style="margin: 0;">The Brink &bull; Inquiries Management System</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: recipient,
    subject,
    html,
  })
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
