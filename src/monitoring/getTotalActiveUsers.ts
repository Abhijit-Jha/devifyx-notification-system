import { NextFunction, Request, Response } from "express";
import { activeRequests } from "../clients/guage";

export function getTotalActiveUsers(req: Request, res: Response, next: NextFunction) {
    activeRequests.inc({
        method: req.method,
        route: req.path
    })

    res.on("finish", () => {
        setTimeout(() => {
            activeRequests.dec({
                method: req.method,
                route: req.path
            })
        }, 10000)

    })
    next();
};