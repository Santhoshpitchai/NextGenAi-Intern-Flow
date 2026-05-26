import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", messageController.createMessage);
router.get("/", messageController.getMessages);
router.delete("/:id", messageController.deleteMessage);

export default router;
