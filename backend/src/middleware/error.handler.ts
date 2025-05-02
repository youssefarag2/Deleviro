import { Request, Response, NextFunction } from "express";

// HINT: Create a basic error handling middleware.
// It should accept four arguments: error, req, res, next.
export const errorHandler = (
  error: Error | any, // Use 'any' or a specific Error type/interface
  req: Request,
  res: Response,
  next: NextFunction // Must include next even if unused for Express to recognize it as error handler
): void => {
  // HINT: Log the error (using a proper logger later is better).
  console.error("🔴 ERROR:", error.message || error);
  // console.error(error.stack); // Uncomment for detailed stack trace during dev

  // HINT: Determine status code. Default to 500 if not specified on the error.
  // You might create custom Error classes that have a .statusCode property.
  const statusCode = error.statusCode || 500;

  // HINT: Send a generic JSON error response. Avoid sending sensitive stack traces in production.
  res.status(statusCode).json({
    message: error.message || "An unexpected error occurred",
    // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Only show stack in dev
    error: error.name || "InternalServerError",
  });
};
