import { Worker, Job } from "bullmq";
import { connection } from "../redis/redis";
import { sendTextMessage } from "../utils/smsService";
import logger from "../utils/logger";

interface SMSJobData {
    to: string;
    from: string;
    text: string;
}

export const smsWorker = new Worker(
    'sms-queue',
    async (job: Job<SMSJobData>) => {
        const { to, text } = job.data;

        try {
            logger.info(`📲 Starting SMS job [ID: ${job.id}] to ${to}`);

            const response = await sendTextMessage(
                to,
                process.env.TWILIO_DEFAULT_FROM!,
                text
            );

            logger.info(`✅ SMS sent to ${to} | Job ID: ${job.id} | SID: ${response.sid}`);
            return {
                status: 'success',
                sid: response.sid,
            };
        } catch (error: any) {
            logger.error(`❌ SMS job failed | Job ID: ${job.id} | Error: ${error.message}`);
            throw error;
        }
    },
    { connection }
);
