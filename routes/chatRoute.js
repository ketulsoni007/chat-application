import { Router } from "express";
import { sendChatController, fetchConversationHistoryController } from "../controller/chatController.js";

const chatRoute = Router();

chatRoute.post("/send-chat", sendChatController);
chatRoute.get("/fetch-conversation/:otherUserId", fetchConversationHistoryController);

export default chatRoute;
