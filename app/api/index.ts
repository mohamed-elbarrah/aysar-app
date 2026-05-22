import { Router } from "express";
import { authRouter } from "./auth";
import { homePageRouter } from "./home-page";
import { plansPageRouter } from "./plans-page";
import { contactPageRouter } from "./contact-page";
import { contactMessagesRouter } from "./contact-messages";
import { policiesRouter } from "./policies";
import { settingsRouter } from "./settings";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/home-page", homePageRouter);
apiRouter.use("/plans-page", plansPageRouter);
apiRouter.use("/contact-page", contactPageRouter);
apiRouter.use("/contact-messages", contactMessagesRouter);
apiRouter.use("/policies", policiesRouter);
apiRouter.use("/settings", settingsRouter);
