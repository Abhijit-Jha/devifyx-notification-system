import express from "express";
import { notification } from "./route/sendNotification";
import logger from "./utils/logger"; 

const app = express();

app.use('/api', notification);

const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
