import type { Response } from "express";

export const payloadSuccess = (res: Response, data: any) => {
	return res.status(200).json({
		status: "success",
		data,
	});
};

export const payloadError = (res: Response, data?: any) => {
	return res.status(400).json({
		status: "failed",
		data,
	});
};
