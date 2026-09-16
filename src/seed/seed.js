/**
 * Seed execution script for Car Neon City Racer
 * Seeds deterministic users, workspaces, tracks, vehicles, approvals, and audit events.
 */

import { SEED_USERS, SEED_WORKSPACES, SEED_TRACKS, SEED_VEHICLES, SEED_APPROVALS, SEED_AUDIT_LOGS } from './seedData.js';
import { verifyPassword } from '../auth/auth.js';

export function runSeed(verbose = true) {
  if (verbose) {
    console.log('=== [AIDLC SEED] Initializing deterministic seed dataset ===');
  }

  // Validate seed users
  for (const user of SEED_USERS) {
    if (!user.email || !user.role || !user.passwordPlain || !user.passwordHash) {
      throw new Error(`Invalid seed user structure: ${JSON.stringify(user)}`);
    }
    const verified = verifyPassword(user.passwordPlain, user.passwordHash);
    if (!verified) {
      throw new Error(`Password hash mismatch for seed user ${user.email}`);
    }
  }

  const summary = {
    usersCount: SEED_USERS.length,
    workspacesCount: SEED_WORKSPACES.length,
    tracksCount: SEED_TRACKS.length,
    vehiclesCount: SEED_VEHICLES.length,
    approvalsCount: SEED_APPROVALS.length,
    auditLogsCount: SEED_AUDIT_LOGS.length,
    demoAccounts: SEED_USERS.map((u) => ({
      email: u.email,
      role: u.role,
      password: u.passwordPlain,
    })),
  };

  if (verbose) {
    console.log(`[AIDLC SEED] Successfully verified ${summary.usersCount} users, ${summary.workspacesCount} workspaces, ${summary.tracksCount} tracks, ${summary.vehiclesCount} vehicles.`);
    console.log(`[AIDLC SEED] Demo Accounts:`);
    for (const acct of summary.demoAccounts) {
      console.log(`  - [${acct.role.toUpperCase()}] ${acct.email} / ${acct.password}`);
    }
    console.log('=== [AIDLC SEED] Seeding complete ===');
  }

  return summary;
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  try {
    runSeed(true);
    process.exit(0);
  } catch (err) {
    console.error('[AIDLC SEED] Error during seeding:', err.message);
    process.exit(1);
  }
}
