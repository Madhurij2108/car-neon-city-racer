/**
 * Runtime boundaries configuration for Car Neon City Racer
 * Specifies environment variables, port bindings, networking, database connection,
 * storage boundaries, and fixed loopback healthcheck contracts.
 */

export const RUNTIME_ENVIRONMENTS = ['development', 'test', 'staging', 'production'];

export function getRuntimeConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development';

  // Internal fixed ports inside containers
  const internalPorts = {
    frontend: 3000,
    api: 8000,
    db: 5432,
  };

  // Host ports: dynamic OS assignment (default 0 in Docker Compose) or override
  const hostPorts = {
    frontend: env.AIDLC_FRONTEND_PORT ? parseInt(env.AIDLC_FRONTEND_PORT, 10) : 0,
    api: env.AIDLC_API_PORT ? parseInt(env.AIDLC_API_PORT, 10) : 0,
    db: env.AIDLC_DB_PORT ? parseInt(env.AIDLC_DB_PORT, 10) : 0,
  };

  // Healthcheck endpoints - MUST ALWAYS use fixed container loopback IPv4
  const healthChecks = {
    frontend: `http://127.0.0.1:${internalPorts.frontend}/health`,
    api: `http://127.0.0.1:${internalPorts.api}/health`,
  };

  const apiConfig = {
    prefix: '/api',
    version: 'v1',
    internalPort: internalPorts.api,
    hostPort: hostPorts.api,
    corsOrigin: env.CORS_ORIGIN || '*',
    healthCheckPath: '/health',
  };

  const frontendConfig = {
    internalPort: internalPorts.frontend,
    hostPort: hostPorts.frontend,
    healthCheckPath: '/health',
  };

  const databaseConfig = {
    host: env.POSTGRES_HOST || (nodeEnv === 'production' ? 'db' : 'localhost'),
    port: parseInt(env.POSTGRES_PORT || String(internalPorts.db), 10),
    database: env.POSTGRES_DB || 'car_neon_city_racer',
    user: env.POSTGRES_USER || 'neon_racer',
    password: env.POSTGRES_PASSWORD || 'neon_secret_2026',
    ssl: env.POSTGRES_SSL === 'true',
    maxConnections: parseInt(env.POSTGRES_MAX_CONNECTIONS || '20', 10),
  };

  const authConfig = {
    jwtSecret: env.JWT_SECRET || 'neon-city-racer-dev-jwt-secret-key-32chars-min!!',
    jwtAlgorithm: 'HS256',
    tokenExpiresInSeconds: parseInt(env.JWT_EXPIRES_IN || '3600', 10), // 1 hour
    refreshTokenExpiresInSeconds: parseInt(env.JWT_REFRESH_EXPIRES_IN || '604800', 10), // 7 days
    issuer: 'car-neon-city-racer',
    audience: 'car-neon-city-racer-api',
  };

  const storageConfig = {
    uploadDir: env.UPLOAD_DIR || './uploads',
    maxFileSizeBytes: parseInt(env.MAX_FILE_SIZE_BYTES || String(10 * 1024 * 1024), 10), // 10MB
    allowedMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/json',
      'text/plain',
    ],
  };

  const auditConfig = {
    enabled: env.AUDIT_LOGS_ENABLED !== 'false',
    retentionDays: parseInt(env.AUDIT_RETENTION_DAYS || '90', 10),
  };

  return {
    nodeEnv,
    internalPorts,
    hostPorts,
    healthChecks,
    api: apiConfig,
    frontend: frontendConfig,
    database: databaseConfig,
    auth: authConfig,
    storage: storageConfig,
    audit: auditConfig,
  };
}

export const runtimeConfig = getRuntimeConfig();
