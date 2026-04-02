const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/errorHandler");
const notesRouter = require("./routes/notes");
const collectionsRouter = require("./routes/collections");
const tagsRouter = require("./routes/tags");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/notes", notesRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/tags", tagsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: `Route ${req.method} ${req.path} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
