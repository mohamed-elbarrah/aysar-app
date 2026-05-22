import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@/app/middleware/auth";
import { getSettingsHandler, updateSettingsHandler } from "./handlers";

export const settingsRouter = Router();

settingsRouter.get("/", getSettingsHandler);
settingsRouter.patch("/", authMiddleware, adminMiddleware, updateSettingsHandler);
