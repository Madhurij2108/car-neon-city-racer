/**
 * Safe local reset & reseed script for Car Neon City Racer
 * Enforces production protection: cannot reset in production unless ALLOW_PROD_RESET=true.
 */

import { runSeed } from './seed.js';

export function resetAndReseed(env = process.env, verbose = true) {
  const nodeEnv = env.NODE_ENV || 'development';

  if (nodeEnv === 'production' && env.ALLOW_PROD_RESET !== 'true') {
    throw new Error('SAFETY BLOCKED: Resetting data in production environment is prohibited without ALLOW_PROD_RESET=true.');
  }

  if (verbose) {
    console.log(`=== [AIDLC RESET] Resetting local data store in [${nodeEnv}] mode ===`);
    console.log('[AIDLC RESET] Clearing transient states...');
  }

  // Reseed clean deterministic data
  const result = runSeed(verbose);

  if (verbose) {
    console.log('=== [AIDLC RESET] Local data reset and reseed complete ===');
  }

  return {
    reset: true,
    environment: nodeEnv,
    ...result,
  };
}

if (process.argv[1] && process.argv[1].endsWith('reset.js')) {
  try {
    resetAndReseed(process.env, true);
    process.exit(0);
  } catch (err) {
    console.error('[AIDLC RESET] Error during reset:', err.message);
    process.exit(1);
  }
}
