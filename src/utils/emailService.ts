import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API!);

/**
 * Sends an email using SendGrid
 * @param to - Recipient email
 * @param from - Verified sender email
 * @param subject - Subject line
 * @param text - Plain text content
 * @param html - Optional HTML content
 * @returns Promise with SendGrid response
 */
export async function sendEmail(
    to: string,
    from: string,
    subject: string,
    text: string,
    html?: string
): Promise<any> {
    const msg = {
        to,
        from,
        subject,
        text,
        html: html || text,
    };

    try {
        const response = await sgMail.send(msg);
        logger.info(`✅ Email sent to ${to}`);
        return response;
    } catch (error: any) {
        logger.error(`❌ Error sending email to ${to}: ${error.response?.body || error.message}`);
        throw error;
    }
}
