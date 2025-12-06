import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import rateLimit from "express-rate-limit";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./routes/router";

const app = express();

const allowedOrigins = ["http://localhost:3000"];

const corsOptions: cors.CorsOptions = {
	origin: allowedOrigins,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
	credentials: true, // Allow sending cookies, if applicable
	optionsSuccessStatus: 204, // For preflight requests
};

const limiter = rateLimit({
	windowMs: 1000, // 1 second
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 429,
		error: "Too many requests. Please slow down.",
	},
});

// Security headers
app.use(helmet());

// Logger
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (customizable)
app.use(cors(corsOptions));

// Rate limiter (3 requests per 1 second)
app.use(limiter);

// Routes
// app.use("/health", healthRoutes);
app.use("/", router);

// 404 & error handler
app.use(notFound);
app.use(errorHandler);

export default app;
