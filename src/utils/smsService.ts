import twilio from 'twilio';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const defaultFrom = process.env.TWILIO_DEFAULT_FROM!;

const client = twilio(accountSid, authToken);

/**
 * Sends a text message using Twilio API.
 * 
 * @param to - The recipient's phone number (in E.164 format, e.g., +91...)
 * @param from - Optional: The sender's number. Falls back to TWILIO_DEFAULT_FROM
 * @param body - The SMS message body
 * @returns Twilio message object or error
 */
export async function sendTextMessage(
    to: string,
    from: string = defaultFrom,
    body: string,
): Promise<any> {
    try {
        const message = await client.messages.create({
            body,
            from,
            to,
        });

        logger.info(`✅ SMS sent to ${to} | SID: ${message.sid}`);
        return message;
    } catch (error: any) {
        logger.error(`❌ Failed to send SMS to ${to}: ${error.message || error}`);
        throw error;
    }
}
