import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/produtRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();

const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

//Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-greencart.vercel.app",
];
// app.use(cors({ origin: "*", credentials: true }));

app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

//Middelware Config
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "*", credentials: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials to be sent
  })
);

app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/test-cookie", (req, res) => {
  res.cookie("testCookie", "hello", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.json({ message: "Cookie should be set" });
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, (req, res) => {
  console.log(`server is running on http://localhost:${port}`);
});
