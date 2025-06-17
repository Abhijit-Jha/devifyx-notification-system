import express, { Request, Response } from "express";
import { smsQueue } from "../queue/smsQueue";
import { emailQueue } from "../queue/emailQueue";

export const notification = express();
notification.use(express.json());

interface NotificationJob {
    type: "sms" | "email";
    to: string;
    subject?: string;
    message: string;
}

notification.post("/addJob", async (req: Request, res: Response) => {
    const { type, to, subject, message }: NotificationJob = req.body;

    try {
        if (!type || !to || !message || (type === "email" && !subject)) {
            res.status(400).json({ error: "Missing required fields." });
        }

        let job;

        const jobOptions = {
            attempts: 3, // retry 3 times on failure
            backoff: {
                type: "exponential",
                delay: 5000, // initial 5 sec backoff
            },
            removeOnComplete: true, // clean up
            removeOnFail: false, // keep failed jobs for debugging
        };

        if (type === "sms") {
            job = await smsQueue.add("send_sms", { to, message }, jobOptions);
        } else if (type === "email") {
            job = await emailQueue.add("send_email", { to, subject, message }, jobOptions);
        } else {
            res.status(400).json({ error: "Invalid type. Must be 'sms' or 'email'." });
        }

        res.status(200).json({
            message: "Job added successfully",
            jobId: job?.id,
        });
    } catch (error) {
        console.error("❌ Failed to add job:", error);
        res.status(500).json({ error: "Failed to add notification job." });
    }
});
