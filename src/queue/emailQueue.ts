import { Queue } from "bullmq";
import { connection } from "../redis/redis";
const emailQueue = new Queue('email-queue', { connection });

export { emailQueue };