import { Router } from "express";
import { authMiddleware } from "@/app/middleware/auth";
import { submitContactMessageHandler, getContactMessagesHandler } from "./handlers";

export const contactMessagesRouter = Router();

contactMessagesRouter.post("/", submitContactMessageHandler);
contactMessagesRouter.get("/", authMiddleware, getContactMessagesHandler);
