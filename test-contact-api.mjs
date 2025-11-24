/**
 * Test script for contact form API
 * Run with: node test-contact-api.mjs
 */

const API_URL = "http://localhost:3002/api/contact";

// Test data
const testData = {
  name: "Test User",
  email: "test@example.com",
  subject: "Test Subject",
  message:
    "This is a test message to verify the contact form API is working correctly.",
};

async function testContactAPI() {
  console.log("🧪 Testing Contact Form API...\n");

  try {
    console.log("📤 Sending test request...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log(
      `📊 Response Status: ${response.status} ${response.statusText}`
    );

    // Log response headers
    console.log("\n📋 Response Headers:");
    response.headers.forEach((value, key) => {
      if (
        key.toLowerCase().includes("ratelimit") ||
        key.toLowerCase().includes("retry")
      ) {
        console.log(`  ${key}: ${value}`);
      }
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("\n✅ SUCCESS!");
      console.log("📧 Email should be sent to james.hansung.park@gmail.com");
      console.log("📝 Response:", responseData);
    } else {
      console.log("\n❌ FAILED!");
      console.log("📝 Error Response:", responseData);

      if (response.status === 429) {
        console.log(
          "⏰ Rate limit hit - this is expected behavior for security"
        );
      }
    }
  } catch (error) {
    console.error("\n💥 Request Failed:", error.message);
    console.log("\n🔍 Possible issues:");
    console.log("  - Server not running (npm run dev)");
    console.log("  - Environment variables not configured");
    console.log("  - Email service configuration issue");
  }
}

// Run the test
testContactAPI();
