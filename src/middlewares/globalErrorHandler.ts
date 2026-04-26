import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

type BetterAuthLikeError = {
  message?: string;
  code?: string;
  statusCode?: number;
  body?: { code?: string; message?: string };
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed. Please check the highlighted fields.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
    });
    return;
  }

  const err = error as BetterAuthLikeError;

  const duplicateCodes = [
    "EMAIL_ALREADY_EXISTS",
    "USER_ALREADY_EXISTS",
    "UNIQUE_CONSTRAINT_FAILED",
  ];

  const duplicateFromCode =
    (err.code && duplicateCodes.includes(err.code)) ||
    (err.body?.code && duplicateCodes.includes(err.body.code));

  const duplicateFromMessage =
    (typeof err.message === "string" &&
      /already\s*exists|already\s*registered|unique\s*constraint/i.test(
        err.message,
      )) ||
    (typeof err.body?.message === "string" &&
      /already\s*exists|already\s*registered|unique\s*constraint/i.test(
        err.body.message,
      ));

  if (duplicateFromCode || duplicateFromMessage || err.statusCode === 409) {
    res.status(409).json({
      success: false,
      message: "This Email already registered",
    });
    return;
  }

  if (err.code === "EMAIL_NOT_FOUND" || err.statusCode === 404) {
    res.status(404).json({
      success: false,
      message: err.message || "No account found with this email address",
    });
    return;
  }

  if (err.statusCode === 401 || err.statusCode === 403) {
    res.status(err.statusCode).json({
      success: false,
      message: err.body?.message || err.message || "Authentication failed",
    });
    return;
  }

  const statusCode =
    typeof err.statusCode === "number" && err.statusCode >= 400
      ? err.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message: err.body?.message || err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { error }),
  });
};
