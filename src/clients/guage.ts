import client from "prom-client"
export const activeRequests = new client.Gauge({
    name : "TOTAL_ACTIVE_USERS",
    help : "To get the total no of users,whose requests are not resolved yet.",
    labelNames : ["method","route"]
});