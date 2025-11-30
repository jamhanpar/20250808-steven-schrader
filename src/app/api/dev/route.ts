import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "../../../lib/rate-limiter";

/**
 * Development-only endpoint to reset rate limiting
 * Only works in development mode
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        success: false,
        message: "Reset endpoint not available in production",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { type, identifier } = body;

    if (type === "all") {
      // Reset all rate limits
      rateLimiter.reset();
      return NextResponse.json({
        success: true,
        message: "All rate limits reset successfully",
        stats: rateLimiter.getStats(),
      });
    } else if (type && identifier) {
      // Reset specific identifier
      rateLimiter.reset(identifier, type as "ip" | "email" | "global");
      return NextResponse.json({
        success: true,
        message: `Rate limit reset for ${type}: ${identifier}`,
        stats: rateLimiter.getStats(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            'Invalid request. Use {type: "all"} or {type: "ip|email|global", identifier: "value"}',
        },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to parse request body",
      },
      { status: 400 }
    );
  }
}

/**
 * Get current rate limiter stats
 */
export async function GET(): Promise<NextResponse> {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        success: false,
        message: "Stats endpoint not available in production",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Current rate limiter statistics",
    stats: rateLimiter.getStats(),
    environment: process.env.NODE_ENV || "development",
  });
}
