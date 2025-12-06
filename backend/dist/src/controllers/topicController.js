import { payloadError, payloadSuccess } from "../utils/payload";
import { TopicService } from "../services/topicService";
export class TopicController {
    static async getAll(req, res) {
        try {
            const topic = TopicService.getAll();
            payloadSuccess(res, topic);
        }
        catch (error) {
            payloadError(res, error);
        }
    }
    static async getByNIM(req, res) {
        try {
            const { nim } = req.body;
            const topic = TopicService.getByNIM(nim);
            payloadSuccess(res, topic);
        }
        catch (error) {
            payloadError(res, error);
        }
    }
    static async create(req, res) {
        try {
            const request = req.body;
            const topic = TopicService.create(request);
            payloadSuccess(res, topic);
        }
        catch (error) {
            payloadError(res, error);
        }
    }
}
//# sourceMappingURL=topicController.js.map