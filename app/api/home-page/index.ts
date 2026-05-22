import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@/app/middleware/auth";
import { getHomePageHandler, updateHomePageHandler } from "./handlers";

export const homePageRouter = Router();

homePageRouter.get("/", getHomePageHandler);
homePageRouter.patch("/", authMiddleware, adminMiddleware, updateHomePageHandler);
