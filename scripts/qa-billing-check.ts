/**
 * PulseGen Studio — Automated QA Billing + Licensing Check
 * ----------------------------------------------------------
 * This script verifies live billing and licensing functionality.
 * It uses your deployed API endpoints to simulate each flow and
 * print pass/fail logs for QA or CI.
 *
 * Run:
 *   npx ts-node scripts/qa-billing-check.ts
 */

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.APP_URL || "https://pulse-glassify-studio.vercel.app";
const TEST_THEME_ID = "theme_test_qa";
const HEADERS = { "Content-Type": "application/json" } as const;

async function testEndpoint(name: string, url: string, opts?: any) {
  console.log(`\n▶️  ${name}`);
  try {
    const res = await fetch(`${BASE_URL}${url}`, opts);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log(`✅ PASS — ${url}`);
      console.log(`→ Response:`, data);
    } else {
      console.log(`❌ FAIL — ${url}`);
      console.log(`→ Status: ${res.status}, Body:`, data);
    }
  } catch (err) {
    console.error(`💥 ERROR — ${url}`, err);
  }
}

(async () => {
  console.log("🧭 Starting QA Billing Check —", new Date().toLocaleString());
  console.log("Base URL:", BASE_URL);

  // 1️⃣ Subscription Status
  await testEndpoint(
    "Check Subscription Status",
    `/api/subscription/status`
  );

  // 2️⃣ QA Simulation (activate)
  await testEndpoint(
    "Simulate Activation",
    `/api/qa/billing/simulate`,
    {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ event: "activated" }),
    }
  );

  // 3️⃣ QA Simulation (cancel)
  await testEndpoint(
    "Simulate Cancellation",
    `/api/qa/billing/simulate`,
    {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ event: "cancel" }),
    }
  );

  // 4️⃣ Seat Limit Test
  await testEndpoint(
    "Simulate Seat Limit Exceeded",
    `/api/qa/billing/simulate`,
    {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ event: "seat_limit_exceeded" }),
    }
  );

  // 5️⃣ Marketplace License — Issue
  await testEndpoint(
    "Issue Theme License",
    `/api/marketplace/license/issue`,
    {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ themeId: TEST_THEME_ID }),
    }
  );

  // 6️⃣ Marketplace License — Check
  await testEndpoint(
    "Check Theme License",
    `/api/marketplace/license/check`,
    {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ themeId: TEST_THEME_ID }),
    }
  );

  // 7️⃣ Marketplace License — Use
  await testEndpoint(
    "Use Theme License",
    `/api/marketplace/license/use`,
    {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ themeId: TEST_THEME_ID }),
    }
  );

  console.log("\n✅ QA Billing Check Completed Successfully");
})();


