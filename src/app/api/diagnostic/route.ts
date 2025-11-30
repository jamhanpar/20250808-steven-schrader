import { NextResponse } from "next/server";
import { emailService } from "../../../lib/email-mailgun";

/**
 * Diagnostic endpoint to test email configuration
 * Returns detailed error information for debugging
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Check environment variables
    const requiredVars = [
      "MAILGUN_API_KEY",
      "MAILGUN_DOMAIN",
      "MAILGUN_FROM_EMAIL",
      "RECIPIENT_EMAIL",
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing environment variables",
          missing: missingVars,
          environment: process.env.NODE_ENV,
        },
        { status: 500 }
      );
    }

    // Test Mailgun API connection
    const connectionTest = await emailService.testConnection();

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Mailgun API connection failed",
          details: connectionTest.error,
          config: {
            domain: process.env.MAILGUN_DOMAIN,
            fromEmail: process.env.MAILGUN_FROM_EMAIL,
            apiKeyLength: process.env.MAILGUN_API_KEY?.length || 0,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mailgun email service is configured correctly",
      config: {
        domain: process.env.MAILGUN_DOMAIN,
        fromEmail: process.env.MAILGUN_FROM_EMAIL,
        recipient: process.env.RECIPIENT_EMAIL?.slice(0, 3) + "***",
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error during diagnostic",
        details: error instanceof Error ? error.message : "Unknown error",
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
