import express from "express";
import { notification } from "./route/sendNotification";

const app = express();

app.use('/api', notification);

app.listen(3000, () => {
    console.log('Listening on 3000');
})