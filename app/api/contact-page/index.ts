import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@/app/middleware/auth";
import { getContactPageHandler, updateContactPageHandler } from "./handlers";

export const contactPageRouter = Router();

contactPageRouter.get("/", getContactPageHandler);
contactPageRouter.patch("/", authMiddleware, adminMiddleware, updateContactPageHandler);
