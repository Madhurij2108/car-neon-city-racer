import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  SEED_USERS,
  SEED_WORKSPACES,
  SEED_TRACKS,
  SEED_VEHICLES,
  SEED_APPROVALS,
  SEED_AUDIT_LOGS,
} from '../src/seed/seedData.js';
import { runSeed } from '../src/seed/seed.js';
import { resetAndReseed } from '../src/seed/reset.js';
import { verifyPassword } from '../src/auth/auth.js';

describe('Seed Data & Reset Boundaries', () => {
  describe('Seed Users Specification', () => {
    it('should provide deterministic admin and reviewer users', () => {
      const admin = SEED_USERS.find((u) => u.role === 'admin');
      assert.ok(admin, 'Admin seed user must exist');
      assert.strictEqual(admin.email, 'admin@car-neon-city-racer.local');
      assert.strictEqual(admin.passwordPlain, 'ChangeMe!12345');
      assert.strictEqual(verifyPassword(admin.passwordPlain, admin.passwordHash), true);

      const reviewer = SEED_USERS.find((u) => u.role === 'reviewer');
      assert.ok(reviewer, 'Reviewer seed user must exist');
      assert.strictEqual(reviewer.email, 'reviewer@car-neon-city-racer.local');
      assert.strictEqual(reviewer.passwordPlain, 'ChangeMe!12345');
      assert.strictEqual(verifyPassword(reviewer.passwordPlain, reviewer.passwordHash), true);
    });

    it('should provide racer users for game simulation', () => {
      const racers = SEED_USERS.filter((u) => u.role === 'racer');
      assert.strictEqual(racers.length >= 2, true, 'At least 2 racer seed users required');
    });
  });

  describe('Sample Domain Records Specification', () => {
    it('should include workspace, tracks, and vehicles', () => {
      assert.strictEqual(SEED_WORKSPACES.length > 0, true);
      assert.strictEqual(SEED_TRACKS.length >= 3, true);
      assert.strictEqual(SEED_VEHICLES.length >= 3, true);

      // Verify track properties
      for (const track of SEED_TRACKS) {
        assert.ok(track.id);
        assert.ok(track.name);
        assert.ok(track.lengthKm > 0);
        assert.ok(track.recordLapMs > 0);
      }

      // Verify vehicle properties
      for (const vehicle of SEED_VEHICLES) {
        assert.ok(vehicle.id);
        assert.ok(vehicle.name);
        assert.ok(vehicle.neonColor);
        assert.ok(vehicle.topSpeedKmh > 0);
      }
    });

    it('should include approval workflow examples (approved, pending, rejected)', () => {
      assert.strictEqual(SEED_APPROVALS.length >= 3, true);

      const approved = SEED_APPROVALS.find((a) => a.status === 'approved');
      const pending = SEED_APPROVALS.find((a) => a.status === 'pending');
      const rejected = SEED_APPROVALS.find((a) => a.status === 'rejected');

      assert.ok(approved, 'Approved approval sample record required');
      assert.ok(pending, 'Pending approval sample record required');
      assert.ok(rejected, 'Rejected approval sample record required');
    });

    it('should include baseline audit logs', () => {
      assert.strictEqual(SEED_AUDIT_LOGS.length >= 3, true);
      for (const log of SEED_AUDIT_LOGS) {
        assert.ok(log.id);
        assert.ok(log.timestamp);
        assert.ok(log.category);
        assert.ok(log.action);
      }
    });
  });

  describe('Reset & Reseed Execution', () => {
    it('runSeed should execute without errors and return summary', () => {
      const summary = runSeed(false);
      assert.strictEqual(summary.usersCount, SEED_USERS.length);
      assert.strictEqual(summary.tracksCount, SEED_TRACKS.length);
      assert.strictEqual(summary.demoAccounts.length, SEED_USERS.length);
    });

    it('resetAndReseed should succeed in development environment', () => {
      const res = resetAndReseed({ NODE_ENV: 'development' }, false);
      assert.strictEqual(res.reset, true);
      assert.strictEqual(res.environment, 'development');
    });

    it('resetAndReseed should block destructive reset in production unless explicitly allowed', () => {
      assert.throws(
        () => resetAndReseed({ NODE_ENV: 'production' }, false),
        /SAFETY BLOCKED: Resetting data in production environment is prohibited/
      );

      // Succeeded when explicitly allowed
      const allowed = resetAndReseed({ NODE_ENV: 'production', ALLOW_PROD_RESET: 'true' }, false);
      assert.strictEqual(allowed.reset, true);
    });
  });
});
