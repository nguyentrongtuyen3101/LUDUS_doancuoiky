import express from "express";
//import accountRoutes from "./routes/account.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRouter from "./routes/admin/category.routes.js";
import subCategoryRouter from "./routes/admin/subCategory.routes.js";
import router from "./routes/admin/product.routes.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { responseTimeMiddleware } from "./middlewares/responseTime.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import passport from "passport"; 
import "./config/passport.js";
import {authMiddleware} from "./middlewares/auth.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.static("public"));

app.use(cookieParser()); 

const allowedOrigins = [
  process.env.FRONTEND_URL_USER,   
  process.env.FRONTEND_URL_ADMIN,  
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Không được phép truy cập bởi CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(loggerMiddleware);
app.use(responseTimeMiddleware);
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/category", authMiddleware(["Admin"]), categoryRouter);
app.use("/subcategory", authMiddleware(["Admin"]), subCategoryRouter);
app.use("/product", authMiddleware(["Admin"]), router);
app.use(errorMiddleware);

export default app;
