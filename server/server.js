import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import faqRoutes from "./src/routes/faqRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import webhookRoutes from "./src/routes/webhookRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://campus-copilot-liard.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/api/notices", noticeRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/webhooks", webhookRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusCopilot Backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`CampusCopilot server running on port ${PORT}`);
  });
};

startServer();
