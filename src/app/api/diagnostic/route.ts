import { NextResponse } from 'next/server';
import { emailService } from '../../../lib/email';

/**
 * Diagnostic endpoint to test email configuration
 * Returns detailed error information for debugging
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Check environment variables
    const requiredVars = [
      'SMTP_HOST',
      'SMTP_PORT', 
      'SMTP_USER',
      'SMTP_PASS',
      'RECIPIENT_EMAIL'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missing: missingVars,
        environment: process.env.NODE_ENV
      }, { status: 500 });
    }

    // Test SMTP connection
    const connectionTest = await emailService.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'SMTP connection failed',
        details: connectionTest.error,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER?.slice(0, 3) + '***', // Hide most of email
          passLength: process.env.SMTP_PASS?.length || 0
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email service is configured correctly',
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER?.slice(0, 3) + '***',
        recipient: process.env.RECIPIENT_EMAIL?.slice(0, 3) + '***',
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during diagnostic',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}