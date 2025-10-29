#!/usr/bin/env ts-node

/*
  Stripe QA Script

  Usage:
    ts-node scripts/stripe-qa.ts <SUBSCRIPTION_ID> [status] [--run]

  Examples:
    ts-node scripts/stripe-qa.ts sub_123 active --run
    ts-node scripts/stripe-qa.ts sub_123 past_due --run
    ts-node scripts/stripe-qa.ts sub_123 unpaid --run
    ts-node scripts/stripe-qa.ts sub_123 canceled --run

  Notes:
    - Requires Stripe CLI installed (`stripe`) and authenticated.
    - When --run is omitted, the script only prints the commands.
    - Changing subscription.status via CLI should trigger your webhook → app updates `subscription_status` and logs in `billing_events`.
*/

import { spawnSync } from 'child_process';

type Status = 'active' | 'past_due' | 'unpaid' | 'canceled';

const ALL_STATUSES: Status[] = ['active', 'past_due', 'unpaid', 'canceled'];

function runStripe(subId: string, status: Status, actuallyRun: boolean) {
  const cmd = `stripe subscriptions update ${subId} -d status=${status}`;
  if (!actuallyRun) {
    console.log(cmd);
    return { code: 0 };
  }
  console.log(`\n$ ${cmd}`);
  const res = spawnSync('stripe', ['subscriptions', 'update', subId, '-d', `status=${status}`], {
    stdio: 'inherit',
    env: process.env,
  });
  return { code: res.status ?? 0 };
}

function main() {
  const [, , subId, maybeStatus, maybeRun] = process.argv;
  if (!subId) {
    console.error('Usage: ts-node scripts/stripe-qa.ts <SUBSCRIPTION_ID> [status] [--run]');
    process.exit(1);
  }
  const actuallyRun = maybeStatus === '--run' || maybeRun === '--run';
  const statusArg = (maybeStatus && maybeStatus !== '--run') ? (maybeStatus as Status) : undefined;

  if (statusArg && !ALL_STATUSES.includes(statusArg)) {
    console.error(`Invalid status: ${statusArg}. Valid: ${ALL_STATUSES.join(', ')}`);
    process.exit(1);
  }

  const statuses = statusArg ? [statusArg] : ALL_STATUSES;

  let anyFail = false;
  for (const s of statuses) {
    const { code } = runStripe(subId, s, actuallyRun);
    if (code !== 0) anyFail = true;
  }

  if (anyFail) process.exit(1);
}

main();


