import { Router } from "express";
import { authMiddleware } from "@/app/middleware/auth";
import { loginHandler, logoutHandler, meHandler } from "./handlers";

export const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", authMiddleware, meHandler);
