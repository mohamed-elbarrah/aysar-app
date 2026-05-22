import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@/app/middleware/auth";
import { getPlansPageHandler, updatePlansPageHandler } from "./handlers";

export const plansPageRouter = Router();

plansPageRouter.get("/", getPlansPageHandler);
plansPageRouter.patch("/", authMiddleware, adminMiddleware, updatePlansPageHandler);
