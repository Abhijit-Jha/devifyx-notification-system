import client from "prom-client"
export const averageTimeUserSpent = new client.Histogram({
    name : "cumulative_data_of_user",
    labelNames : ['method','route','statusCode'],
    help : "Cumulative data of the users",
    buckets : [0.1,0.5,1,2,5,10]
})