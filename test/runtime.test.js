import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getRuntimeConfig } from '../src/config/runtime.js';

describe('Runtime Boundaries Specification', () => {
  it('should default to development runtime with fixed internal container ports', () => {
    const config = getRuntimeConfig({});
    assert.strictEqual(config.nodeEnv, 'development');
    assert.strictEqual(config.internalPorts.frontend, 3000);
    assert.strictEqual(config.internalPorts.api, 8000);
    assert.strictEqual(config.internalPorts.db, 5432);
  });

  it('should preserve dynamic host ports defaulting to 0 for ephemeral OS assignment', () => {
    const config = getRuntimeConfig({});
    assert.strictEqual(config.hostPorts.frontend, 0);
    assert.strictEqual(config.hostPorts.api, 0);
    assert.strictEqual(config.hostPorts.db, 0);
  });

  it('should adopt explicit host port overrides from environment while keeping internal ports fixed', () => {
    const customEnv = {
      AIDLC_FRONTEND_PORT: '3100',
      AIDLC_API_PORT: '8100',
      AIDLC_DB_PORT: '5500',
    };
    const config = getRuntimeConfig(customEnv);
    assert.strictEqual(config.hostPorts.frontend, 3100);
    assert.strictEqual(config.hostPorts.api, 8100);
    assert.strictEqual(config.hostPorts.db, 5500);

    // Internal container ports MUST remain fixed regardless of host ports
    assert.strictEqual(config.internalPorts.frontend, 3000);
    assert.strictEqual(config.internalPorts.api, 8000);
    assert.strictEqual(config.internalPorts.db, 5432);
  });

  it('health check endpoints must always target container loopback IPv4 on fixed internal ports', () => {
    const config = getRuntimeConfig({ AIDLC_FRONTEND_PORT: '45000', AIDLC_API_PORT: '45001' });
    assert.strictEqual(config.healthChecks.frontend, 'http://127.0.0.1:3000/health');
    assert.strictEqual(config.healthChecks.api, 'http://127.0.0.1:8000/health');
  });

  it('should enforce storage limits and allowed mime types', () => {
    const config = getRuntimeConfig({});
    assert.strictEqual(config.storage.maxFileSizeBytes, 10 * 1024 * 1024);
    assert.ok(config.storage.allowedMimeTypes.includes('image/png'));
    assert.ok(config.storage.allowedMimeTypes.includes('application/json'));
  });

  it('should validate PostgreSQL configuration parameters', () => {
    const config = getRuntimeConfig({});
    assert.strictEqual(config.database.database, 'car_neon_city_racer');
    assert.strictEqual(config.database.user, 'neon_racer');
    assert.strictEqual(config.database.port, 5432);
  });
});
