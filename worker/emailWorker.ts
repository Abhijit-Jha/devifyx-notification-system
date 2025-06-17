import { Worker } from "bullmq";
import { connection } from "../redis/redis";
import { sendTextMessage } from "../utils/smsService";
import { sendEmail } from "../utils/emailService";
const emailWorker = new Worker(
    'email-queue',
    async (job) => {
        //A fnx jo email send karega
        sendEmail(
            'soscallfake@gmail.com',
            'abhijeetjha913@gmail.com',
            'Test Subject',
            'Hello from SendGrid using TypeScript!',
            '<strong>Hello from SendGrid using TypeScript!</strong>'
        );

        console.log("Email Job Done")
    },
    { connection }
);