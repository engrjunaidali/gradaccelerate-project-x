import mail from '@adonisjs/mail/services/main'
import env from '#start/env'

export class EmailService {
  /**
   * Send a reminder email notification
   */
  static async sendReminderNotification(
    to: string,
    userFirstName: string,
    reminderTitle: string,
    reminderDescription: string | null,
    reminderDateTime: string
  ) {
    try {
      await mail.send((message) => {
        message
          .to(to)
          .from(`${env.get('APP_NAME')} <${env.get('SMTP_USERNAME')}>`)
          .subject(`⏰ Reminder: ${reminderTitle}`)
          .htmlView('emails/reminder_notification', {
            userFirstName,
            reminderTitle,
            reminderDescription,
            reminderDateTime,
            appName: env.get('APP_NAME'),
            appUrl: env.get('APP_URL')
          })
      })

      console.log(`📧 Reminder email sent successfully to: ${to}`)
      return true
    } catch (error) {
      console.error('❌ Error sending reminder email:', error)
      return false
    }
  }

  /**
   * Send a test email to verify email configuration
   */
  static async sendTestEmail(to: string, subject: string = 'Test Email') {
    try {
      await mail.send((message) => {
        message
          .to(to)
          .from(`${env.get('APP_NAME')} <${env.get('SMTP_USERNAME')}>`)
          .subject(subject)
          .html(`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">🧪 Test Email</h2>
              <p>This is a test email from <strong>${env.get('APP_NAME')}</strong>.</p>
              <p>If you received this email, your email configuration is working correctly!</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                <p style="margin: 0;"><strong>App Name:</strong> ${env.get('APP_NAME')}</p>
                <p style="margin: 0;"><strong>App URL:</strong> ${env.get('APP_URL')}</p>
                <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              </div>
              <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
            </div>
          `)
      })

      console.log(`✅ Test email sent successfully to: ${to}`)
      return true
    } catch (error) {
      console.error('❌ Error sending test email:', error)
      return false
    }
  }
}
