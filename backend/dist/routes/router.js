import { Router } from "express";
import { TopicController } from "../controllers/topicController";
const router = Router();
router.get("/topic", TopicController.getAll);
router.post("/topic", TopicController.create);
router.get("/topic-nim", TopicController.getByNIM);
export default router;
//# sourceMappingURL=router.js.map