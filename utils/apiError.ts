// Utility to standardize API error responses for Next.js API routes
// This helps ensure all errors are consistent, debuggable, and easy to handle on the client side.

import type { NextApiResponse } from 'next';

// Standard error response interface
export interface ApiError {
  error: true;
  message: string;
  code: string;
  timestamp: string;
  location: string;
  [key: string]: any; // For optional extra info
}

/**
 * Sends a standardized error response to the client.
 * @param res - Next.js API response object
 * @param message - Human-readable error message
 * @param code - Application-specific error code
 * @param status - HTTP status code (default: 500)
 * @param location - API route or handler location string
 * @param extra - Optional extra fields to include in the error response
 */
export function handleApiError(
  res: NextApiResponse,
  message: string,
  code: string,
  status: number = 500,
  location: string,
  extra?: object
) {
  res.status(status).json({
    error: true,
    message,
    code,
    timestamp: new Date().toISOString(),
    location,
    ...(extra || {}),
  });
}

/**
 * Wraps an API handler to catch and format unhandled errors in a standardized way.
 * @param handler - The original API handler function
 * @param location - The API route or handler location string
 * @returns A new handler function with error handling
 */
export function wrapApiHandler(
  handler: (req: any, res: any) => Promise<void> | void,
  location: string
) {
  return async (req: any, res: any) => {
    try {
      await handler(req, res);
    } catch (err: any) {
      // Log the error for server-side debugging
      console.error(`[${location}] Unhandled error:`, err && err.stack ? err.stack : err);
      handleApiError(
        res,
        err?.message || err?.toString() || 'Internal Server Error',
        err?.code || 'INTERNAL_ERROR',
        err?.status || 500,
        location
      );
    }
  };
} 