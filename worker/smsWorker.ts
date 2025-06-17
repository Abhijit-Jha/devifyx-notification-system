import { Worker } from "bullmq";
import { connection } from "../redis/redis";
import { sendTextMessage } from "../utils/smsService";
const smsWorker = new Worker(
    'sms-queue',
    async (job) => {
        //A fnx jo sms send karega
        sendTextMessage("+919321852694", "+19035604074", "Hello");
        console.log("SMS JOb done")
    },
    { connection }
);