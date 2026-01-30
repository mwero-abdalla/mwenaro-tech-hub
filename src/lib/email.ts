'use server'

/**
 * A standard utility for sending emails.
 * In a real production app, you would use Resend, SendGrid, or Postmark here.
 */
export async function sendEmail(data: {
    to: string
    subject: string
    html: string
}) {
    console.log(`[EMAIL SENDING SIMULATION]
    To: ${data.to}
    Subject: ${data.subject}
    Content: ${data.html.substring(0, 50)}...
    `)

    // To facilitate direct testing for the user, we'll log it clearly.
    // In a real environment, you'd integrate an API here.
    return { success: true, message: 'Email sent successfully (simulated)' }
}

export async function sendNotificationEmail(userEmail: string, title: string, content: string, link?: string) {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #E85D3B;">Mwenaro Tech Academy</h2>
            <h3>${title}</h3>
            <p>${content}</p>
            ${link ? `<a href="${process.env.NEXT_PUBLIC_APP_URL || ''}${link}" style="display: inline-block; padding: 10px 20px; background-color: #E85D3B; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Details</a>` : ''}
            <hr style="margin-top: 20px; border: 0; border-top: 1px solid #e2e8f0;" />
            <p style="font-size: 12px; color: #64748b;">You are receiving this because you have notifications enabled at Mwenaro Tech Academy.</p>
        </div>
    `
    return sendEmail({ to: userEmail, subject: title, html })
}
