import 'dotenv/config'
import express from "express";
import cors from "cors";
import router from "./routes/auth.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});