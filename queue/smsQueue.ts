import { Queue } from "bullmq";
import { connection } from "../redis/redis";
const smsQueue = new Queue('sms-queue', { connection });

export { smsQueue };