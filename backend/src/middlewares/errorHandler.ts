import { Request, Response, NextFunction } from "express";

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";
	// eslint-disable-next-line no-console
	console.error(err);
	res.status(status).json({ error: message });
}
