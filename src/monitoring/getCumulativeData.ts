import { NextFunction, Request, Response } from "express";
import { averageTimeUserSpent } from "../clients/histogram";

export function getCumulativeData(req:Request,res : Response,next : NextFunction){
    const startTime = Date.now();
    res.on("finish",()=>{
        const endTime = Date.now()
        averageTimeUserSpent.observe({
            method : req.method,
            route : req.path
        },endTime - startTime)
    })
    next();
}