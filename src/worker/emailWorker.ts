import { Worker, Job } from "bullmq";
import { connection } from "../redis/redis";
import { sendEmail } from "../utils/emailService";
import logger from "../utils/logger";
import dotenv from 'dotenv'
interface EmailJobData {
    to: string;
    from?: string;
    subject: string;
    text: string;
    html?: string;
}

export const emailWorker = new Worker(
    'email-queue',
    async (job: Job<EmailJobData>) => {
        const { to, from, subject, text, html } = job.data;

        try {
            logger.info(`📧 Starting email job [ID: ${job.id}] to ${to}`);

            const response = await sendEmail(
                to,
                from || process.env.SENDGRID_FROM!,
                subject,
                text,
                html
            );

            const messageId = response[0]?.headers?.['x-message-id'] || 'unknown';
            logger.info(`✅ Email sent to ${to} | Job ID: ${job.id} | Message ID: ${messageId}`);
        } catch (error: any) {
            const errorMsg = error.response?.body || error.message;
            logger.error(`❌ Email job failed | Job ID: ${job.id} | Error: ${errorMsg}`);
            throw error;
        }
    },
    { connection }
);
