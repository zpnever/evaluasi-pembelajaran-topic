import { Request, Response, NextFunction } from "express";
export function notFound(req, res, next) {
    res.status(404).json({ error: "Not Found" });
}
//# sourceMappingURL=notFound.js.map