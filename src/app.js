import express from "express";
//import accountRoutes from "./routes/account.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/user/manager_profile/profile.routes.js";
import meRoutes from "./routes/me.routes.js";
import categoryRouter from "./routes/admin/category.routes.js";
import subCategoryRouter from "./routes/admin/subCategory.routes.js";
import productRouter from "./routes/admin/product.routes.js";
import productVariantRouter from "./routes/admin/productVariant.routes.js";
import newArrivalsRouter from "./routes/user/newArrivals.routes.js";
import cartRouter from "./routes/user/cart.routes.js";
import wishlistRouter from "./routes/user/wishlist.routes.js";
import AddressRouter from "./routes/user/manager_profile/address.routes.js";
import PaymentMethodRoutes from "./routes/admin/paymentMethod.routes.js";
import VoucherRouter from "./routes/admin/voucher.routes.js";
import CouponRouter from "./routes/user/coupon.routes.js";
import OrderRouter from "./routes/user/order/order.routes.js";
import VnpCallbackRouter from "./routes/user/order/vnp-callback.routes.js";
import ManagerOrderRouter from "./routes/admin/manager-order.routes.js";
 

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
app.use("/callback", VnpCallbackRouter);
app.use("/",authMiddleware(["User","Admin"]), meRoutes);
// admin routes
app.use("/category", authMiddleware(["Admin"]), categoryRouter);
app.use("/subcategory", authMiddleware(["Admin"]), subCategoryRouter);
app.use("/product", authMiddleware(["Admin"]), productRouter);
app.use("/product-variant", authMiddleware(["Admin"]), productVariantRouter);
app.use("/payment-method", authMiddleware(["Admin"]), PaymentMethodRoutes);
app.use("/voucher", authMiddleware(["Admin"]), VoucherRouter);
app.use("/manager-order",authMiddleware(["Admin"]), ManagerOrderRouter);

// user routes
app.use("/manager-profile",authMiddleware(["User","Admin"]), profileRoutes);
app.use("/cart",authMiddleware(["User","Admin"]), cartRouter);
app.use("/wishlist",authMiddleware(["User","Admin"]), wishlistRouter);
app.use("/new-arrivals",authMiddleware(["User","Admin"]), newArrivalsRouter);
app.use("/address",authMiddleware(["User","Admin"]), AddressRouter);  
app.use("/coupon",authMiddleware(["User","Admin"]), CouponRouter);
app.use("/order",authMiddleware(["User","Admin"]), OrderRouter);

app.use(errorMiddleware);

export default app;
