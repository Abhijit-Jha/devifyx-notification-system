import { NextFunction, Request, Response } from "express";
import { totalRequestCount } from "../clients/counter";

export function getTotalRequest(req : Request,res :Response,next : NextFunction){
    const startTime = Date.now()
    res.on("finish",()=>{
        const endTime = Date.now()
        const duration = endTime - startTime
        totalRequestCount.inc({
            method : req.method,
            route : req.route ? req.route.path : req.path,
            status_code : res.statusCode,
            duration :duration
        })
    })
    next();
}