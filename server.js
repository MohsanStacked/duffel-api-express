import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import flightSearcher from "./routes/flightSearcher.js";
import cors from "cors";

const port = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", flightSearcher);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
