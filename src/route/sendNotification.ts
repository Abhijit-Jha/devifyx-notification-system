import express, { Request, Response } from "express";
import { renderTemplate } from "../utils/renderTemplates";
import { smsQueue } from "../queue/smsQueue";
import { emailQueue } from "../queue/emailQueue";
import logger from "../utils/logger";

export const notification = express();
notification.use(express.json());

interface NotificationJob {
    type: "sms" | "email";
    to: string;
    subject?: string;
    message?: string;
    isPriority: boolean;
    template?: "welcome";
}

interface NotificationJob2 {
    type: "sms" | "email";
    to: string[];
    subject?: string;
    message?: string;
    isPriority: boolean;
    template?: "welcome";
}

notification.post("/addJob", async (req: Request, res: Response) => {
    const { type, to, subject, message, isPriority, template }: NotificationJob = req.body;

    logger.info(`🔔 Received job request - Type: ${type}, To: ${to}, Priority: ${isPriority}, Template: ${template}`);

    if (!type || !to || (!message && !template) || (type === "email" && !subject)) {
        logger.warn("⚠️ Missing required fields in request body.");
        res.status(400).json({ error: "Missing required fields." });
    } else {
        const name = type === "email" ? to.split("@")[0] : to.slice(-4);

        const jobOptions = {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
            priority: isPriority ? 1 : 5,
        };

        const content = template
            ? renderTemplate(type, { name, to })
            : message!;

        if (type === "sms") {
            const job = await smsQueue.add("send_sms", { to, text: content }, jobOptions);
            logger.info(`📩 SMS job queued for ${to} | Job ID: ${job.id}`);
            res.status(200).json({
                message: "SMS Job added successfully",
                jobId: job.id,
            });
        } else if (type === "email") {
            const job = await emailQueue.add("send_email", { to, subject, text: content }, jobOptions);
            logger.info(`📧 Email job queued for ${to} | Job ID: ${job.id}`);
            res.status(200).json({
                message: "Email Job added successfully",
                jobId: job.id,
            });
        } else {
            logger.error(`❌ Invalid notification type: ${type}`);
            res.status(400).json({ error: "Invalid type. Must be 'sms' or 'email'." });
        }
    }
});


notification.post("/addBulkJobs", async (req: Request, res: Response) => {
    const { type, to, subject, message, isPriority, template }: NotificationJob2 = req.body;

    const jobOptions = {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
        priority: isPriority ? 1 : 5,
    };

    if (!type || !Array.isArray(to) || to.length === 0 || (!message && !template) || (type === "email" && !subject)) {
        logger.warn("⚠️ Missing or invalid fields in bulk request body.");
        res.status(400).json({ error: "Missing or invalid fields." });
    }
    const jobs = to.map((recipient: string) => {
        const name = type === "email" ? recipient.split("@")[0] : recipient.slice(-4);
        const content = template
            ? renderTemplate(type, { name, to: recipient })
            : message!;

        return {
            name: type === "sms" ? "send_sms" : "send_email",
            data: {
                to: recipient,
                text: content,
                ...(type === "email" && { subject }),
            },
            opts: jobOptions,
        };
    });

    if (type === "sms") {
        const result = await smsQueue.addBulk(jobs);
        logger.info(`📩 Bulk SMS jobs queued for ${to.length} recipients`);
        res.status(200).json({
            message: "Bulk SMS jobs added successfully",
            count: result.length,
        });
    } else if (type === "email") {
        const result = await emailQueue.addBulk(jobs);
        logger.info(`📧 Bulk Email jobs queued for ${to.length} recipients`);
        res.status(200).json({
            message: "Bulk Email jobs added successfully",
            count: result.length,
        });
    } else {
        logger.error(`❌ Invalid notification type in bulk: ${type}`);
        res.status(400).json({ error: "Invalid type. Must be 'sms' or 'email'." });
    }

});
