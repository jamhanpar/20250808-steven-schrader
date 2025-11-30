import { NextRequest, NextResponse } from "next/server";
import {
  validateContactForm,
  performSecurityChecks,
  checkValidationRateLimit,
} from "../../../lib/validation";
import {
  checkContactFormRateLimit,
  getClientIP,
} from "../../../lib/rate-limiter";
import { sendContactFormEmail } from "../../../lib/email-mailgun";
import type { ContactApiResponse, ContactApiError } from "../../../types/api";

/**
 * Security headers for all responses
 */
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none';",
} as const;

/**
 * Create error response with security headers
 */
function createErrorResponse(
  error: ContactApiError,
  status: number = 400
): NextResponse<ContactApiError> {
  const response = NextResponse.json(error, { status });

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Create success response with security headers
 */
function createSuccessResponse(
  data: ContactApiResponse,
  status: number = 200
): NextResponse<ContactApiResponse> {
  const response = NextResponse.json(data, { status });

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Handle POST requests to contact form
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Extract client information
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Rate limiting: Check validation rate limit first
    if (!checkValidationRateLimit(clientIP)) {
      return createErrorResponse(
        {
          success: false,
          message: "Too many requests. Please slow down.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        429
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(
        {
          success: false,
          message: "Invalid JSON in request body",
          code: "VALIDATION_ERROR",
        },
        400
      );
    }

    // Validate form data
    const validation = validateContactForm(body);
    if (!validation.isValid) {
      return createErrorResponse(
        {
          success: false,
          message: "Form validation failed",
          code: "VALIDATION_ERROR",
          details: { errors: validation.errors },
        },
        400
      );
    }

    const formData = validation.sanitizedData!;

    // Additional security checks
    const securityCheck = performSecurityChecks(formData);
    if (!securityCheck.passed) {
      console.warn(
        `🚨 Security check failed for IP ${clientIP}: ${securityCheck.reason}`
      );
      return createErrorResponse(
        {
          success: false,
          message: "Message cannot be processed due to security restrictions",
          code: "VALIDATION_ERROR",
        },
        400
      );
    }

    // Rate limiting: Check contact form specific limits
    const rateLimitResult = checkContactFormRateLimit(clientIP, formData.email);
    if (!rateLimitResult.isAllowed) {
      console.warn(
        `🚨 Rate limit exceeded for IP ${clientIP}, Email ${formData.email}: ${rateLimitResult.reason}`
      );

      const response = createErrorResponse(
        {
          success: false,
          message: rateLimitResult.reason || "Rate limit exceeded",
          code: "RATE_LIMIT_EXCEEDED",
        },
        429
      );

      // Add rate limiting headers
      if (rateLimitResult.resetTime) {
        response.headers.set(
          "Retry-After",
          Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          Math.ceil(rateLimitResult.resetTime / 1000).toString()
        );
      }
      if (rateLimitResult.remainingRequests !== undefined) {
        response.headers.set(
          "X-RateLimit-Remaining",
          rateLimitResult.remainingRequests.toString()
        );
      }

      return response;
    }

    // Send email
    console.log(
      `📧 Sending contact email from ${formData.email} (IP: ${clientIP})`
    );
    const emailResult = await sendContactFormEmail(formData, {
      userIP: clientIP,
      userAgent,
    });

    if (!emailResult.success) {
      console.error(`❌ Email sending failed: ${emailResult.error}`);

      // Provide more specific error messages based on the error type
      let userMessage = "Failed to send message. Please try again later.";
      const errorCode: ContactApiError["code"] = "EMAIL_FAILED";

      if (emailResult.error) {
        if (emailResult.error.includes("authentication")) {
          userMessage =
            "Email service configuration error. Please contact support.";
          console.error(
            "🚨 SMTP Authentication failed - check SMTP_USER and SMTP_PASS"
          );
        } else if (
          emailResult.error.includes("ENOTFOUND") ||
          emailResult.error.includes("EHOSTUNREACH")
        ) {
          userMessage =
            "Email service temporarily unavailable. Please try again later.";
          console.error(
            "🚨 SMTP Host unreachable - check SMTP_HOST and network connectivity"
          );
        } else if (emailResult.error.includes("timeout")) {
          userMessage = "Email service timeout. Please try again.";
          console.error("🚨 SMTP Connection timeout - possible network issue");
        } else if (
          emailResult.error.includes("Missing required environment variables")
        ) {
          userMessage = "Service configuration error. Please contact support.";
          console.error("🚨 Missing environment variables for email service");
        }
      }

      return createErrorResponse(
        {
          success: false,
          message: userMessage,
          code: errorCode,
          ...(process.env.NODE_ENV === "development" && {
            details: { originalError: emailResult.error },
          }),
        },
        500
      );
    }

    // Success response
    console.log(
      `✅ Contact form submitted successfully: ${emailResult.messageId}`
    );
    const successResponse = createSuccessResponse({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      rateLimitInfo: {
        remainingRequests: rateLimitResult.remainingRequests || 0,
        resetTime: rateLimitResult.resetTime || Date.now() + 3600000,
      },
    });

    // Add rate limiting headers to success response
    if (rateLimitResult.remainingRequests !== undefined) {
      successResponse.headers.set(
        "X-RateLimit-Remaining",
        rateLimitResult.remainingRequests.toString()
      );
    }

    return successResponse;
  } catch (error) {
    console.error("❌ Unexpected error in contact API:", error);

    return createErrorResponse(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        code: "INTERNAL_ERROR",
      },
      500
    );
  }
}

/**
 * Handle GET requests (not allowed)
 */
export async function GET(): Promise<NextResponse> {
  return createErrorResponse(
    {
      success: false,
      message: "Method not allowed. Use POST to submit contact form.",
      code: "VALIDATION_ERROR",
    },
    405
  );
}

/**
 * Handle other HTTP methods (not allowed)
 */
export async function PUT(): Promise<NextResponse> {
  return GET();
}

export async function DELETE(): Promise<NextResponse> {
  return GET();
}

export async function PATCH(): Promise<NextResponse> {
  return GET();
}
