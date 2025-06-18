import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

import { smsQueue } from "../queue/smsQueue";
import { emailQueue } from "../queue/emailQueue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues"); // This is your admin path (UI)

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [
        new BullMQAdapter(smsQueue),
        new BullMQAdapter(emailQueue),
    ],
    serverAdapter,
});

export const bullBoardApp = express();
bullBoardApp.use("/admin/queues", serverAdapter.getRouter());
