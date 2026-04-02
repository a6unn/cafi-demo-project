const { ZodError } = require("zod");
const { Prisma } = require("@prisma/client");

function errorHandler(err, req, res, next) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Prisma not found
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({
      error: "Not Found",
      message: "The requested resource was not found",
    });
  }

  // Prisma unique constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(409).json({
      error: "Conflict",
      message: `A record with this ${field} already exists`,
    });
  }

  // Default server error
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
  });
}

module.exports = { errorHandler };
