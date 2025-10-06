import express from "express";
import cors from "cors";

//import accountRoutes from "./routes/account.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { responseTimeMiddleware } from "./middlewares/responseTime.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import passport from "passport"; 
import "./config/passport.js";
import {authMiddleware} from "./middlewares/auth.middleware.js";
const app = express();
app.use(express.static("public"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(responseTimeMiddleware);
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use(errorMiddleware);

export default app;
