import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import apiLimiter from "./middleware/rateLimit.js";
import xss from 'xss-clean';

// routes
import authRoutes from "./routes/AuthRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

// Load environment variables
dotenv.config({ path: "./.env" });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
const options = {
  origin: ['http://localhost:5173'],
}
app.use(cors(options));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(xss());
app.use(morgan("dev"));
// app.use("/api", apiLimiter);

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('XSS Protection Enabled');
});

// Routes
app.use("/api", [authRoutes, contentRoutes]);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port: ${PORT}`)
);