import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@/app/middleware/auth";
import { getPolicyHandler, updatePolicyHandler } from "./handlers";

export const policiesRouter = Router();

policiesRouter.get("/:type", getPolicyHandler);
policiesRouter.patch("/:type", authMiddleware, adminMiddleware, updatePolicyHandler);
