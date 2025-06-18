import client from "prom-client"

export const totalRequestCount = new client.Counter({
    name : "Total_Request_Count", //This should not have spaces
    help : "To get the total no of request that come to our endpoint",
    labelNames : ['method','route','status_code','duration']
});