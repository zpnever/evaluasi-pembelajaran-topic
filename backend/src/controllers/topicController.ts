import type { Request, Response } from "express";
import { payloadError, payloadSuccess } from "../utils/payload";
import { TopicService } from "../services/topicService";
import type { RequestCreate } from "../models/topicModel";

export class TopicController {
	static async getAll(req: Request, res: Response) {
		try {
			const topic = await TopicService.getAll();

			payloadSuccess(res, topic);
		} catch (error) {
			payloadError(res, error);
		}
	}
	static async getByNIM(req: Request, res: Response) {
		try {
			const { nim } = req.body;

			const topic = await TopicService.getByNIM(nim);

			payloadSuccess(res, topic);
		} catch (error) {
			payloadError(res, error);
		}
	}
	static async create(req: Request, res: Response) {
		try {
			const request: RequestCreate = req.body;

			const topic = await TopicService.create(request);

			payloadSuccess(res, topic);
		} catch (error) {
			payloadError(res, error);
		}
	}
}
