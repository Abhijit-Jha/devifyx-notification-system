import express, { Request, Response } from "express";
import { notification } from "./route/sendNotification";
import logger from "./utils/logger";
import { bullBoardApp } from "./utils/bullBoard";
import client from "prom-client";
import { getTotalRequest } from "./monitoring/getTotalRequest";
import { getTotalActiveUsers } from "./monitoring/getTotalActiveUsers";
import { getCumulativeData } from "./monitoring/getCumulativeData";
const app = express();
app.use(getTotalRequest);
app.use(getTotalActiveUsers);
app.use(getCumulativeData);
app.use('/api', notification);
app.use(bullBoardApp);


app.get("/metrics", async (req: Request, res: Response) => {
    const metrics = await client.register.metrics();
    res.set("Content-Type", client.register.contentType);
    // console.log(metrics);
    res.end(metrics);
})
const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
