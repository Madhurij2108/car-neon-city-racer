/**
 * Authentication and Authorization boundary for Car Neon City Racer
 * Implements JWT token handling, password hashing, and Role-Based Access Control (RBAC).
 */

import crypto from 'node:crypto';

// Defined roles across the system
export const ROLES = {
  ADMIN: 'admin',
  REVIEWER: 'reviewer',
  RACER: 'racer',
  GUEST: 'guest',
};

// Defined permissions for all operations
export const PERMISSIONS = {
  // System & Workspace
  WORKSPACE_MANAGE: 'workspace:manage',
  WORKSPACE_VIEW: 'workspace:view',
  USER_MANAGE: 'user:manage',

  // Gameplay & Racing
  RACE_PLAY: 'race:play',
  RACE_MANAGE_TRACKS: 'race:manage_tracks',
  SCORE_SUBMIT: 'score:submit',
  SCORE_VIEW: 'score:view',

  // Approval Workflows
  APPROVAL_REQUEST: 'approval:request',
  APPROVAL_REVIEW: 'approval:review',
  APPROVAL_APPROVE: 'approval:approve',
  APPROVAL_REJECT: 'approval:reject',

  // File & Uploads
  UPLOAD_FILE: 'upload:file',
  UPLOAD_DELETE: 'upload:delete',
  UPLOAD_VIEW: 'upload:view',

  // Audit
  AUDIT_VIEW: 'audit:view',
};

// RBAC Matrix mapping roles to allowed permissions
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.WORKSPACE_MANAGE,
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.RACE_PLAY,
    PERMISSIONS.RACE_MANAGE_TRACKS,
    PERMISSIONS.SCORE_SUBMIT,
    PERMISSIONS.SCORE_VIEW,
    PERMISSIONS.APPROVAL_REQUEST,
    PERMISSIONS.APPROVAL_REVIEW,
    PERMISSIONS.APPROVAL_APPROVE,
    PERMISSIONS.APPROVAL_REJECT,
    PERMISSIONS.UPLOAD_FILE,
    PERMISSIONS.UPLOAD_DELETE,
    PERMISSIONS.UPLOAD_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],
  [ROLES.REVIEWER]: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.RACE_PLAY,
    PERMISSIONS.SCORE_VIEW,
    PERMISSIONS.APPROVAL_REVIEW,
    PERMISSIONS.APPROVAL_APPROVE,
    PERMISSIONS.APPROVAL_REJECT,
    PERMISSIONS.UPLOAD_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],
  [ROLES.RACER]: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.RACE_PLAY,
    PERMISSIONS.SCORE_SUBMIT,
    PERMISSIONS.SCORE_VIEW,
    PERMISSIONS.APPROVAL_REQUEST,
    PERMISSIONS.UPLOAD_FILE,
    PERMISSIONS.UPLOAD_VIEW,
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.SCORE_VIEW,
    PERMISSIONS.UPLOAD_VIEW,
  ],
};

/**
 * Check if a role possesses a given permission
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Base64URL encoding/decoding utilities
 */
function base64UrlEncode(strOrBuffer) {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer, 'utf8');
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Deterministic password hashing using PBKDF2/SHA256
 */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const iterations = 10000;
  const keyLen = 64;
  const digest = 'sha256';
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLen, digest);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Constant-time password verification
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, originalHex] = storedHash.split(':');
  const iterations = 10000;
  const keyLen = 64;
  const digest = 'sha256';
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLen, digest);
  const originalBuffer = Buffer.from(originalHex, 'hex');
  if (derivedKey.length !== originalBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(derivedKey, originalBuffer);
}

/**
 * Sign a JWT token with HMAC-SHA256
 */
export function signJwt(payload, secret, options = {}) {
  if (!secret) {
    throw new Error('JWT secret is required');
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = options.expiresInSeconds || 3600;

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
    iss: options.issuer || 'car-neon-city-racer',
    aud: options.audience || 'car-neon-city-racer-api',
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(signatureInput)
    .digest();

  const encodedSignature = base64UrlEncode(signature);
  return `${signatureInput}.${encodedSignature}`;
}

/**
 * Verify and decode a JWT token
 */
export function verifyJwt(token, secret, options = {}) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token is missing or invalid' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signatureInput)
    .digest();
  const expectedEncoded = base64UrlEncode(expectedSignature);

  // Constant time comparison
  const sigBuf = Buffer.from(encodedSignature);
  const expBuf = Buffer.from(expectedEncoded);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token has expired', expired: true };
    }

    if (options.issuer && payload.iss !== options.issuer) {
      return { valid: false, error: `Invalid issuer. Expected: ${options.issuer}` };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: 'Failed to decode token payload' };
  }
}

/**
 * Authenticate HTTP Authorization header (Bearer token)
 */
export function authenticateAuthHeader(headerValue, secret) {
  if (!headerValue || !headerValue.startsWith('Bearer ')) {
    return {
      authenticated: false,
      statusCode: 401,
      error: { code: 'AUTH_REQUIRED', message: 'Bearer token authorization header is missing or malformed' },
    };
  }

  const token = headerValue.slice(7).trim();
  const result = verifyJwt(token, secret);

  if (!result.valid) {
    return {
      authenticated: false,
      statusCode: 401,
      error: { code: 'INVALID_TOKEN', message: result.error, expired: result.expired || false },
    };
  }

  return {
    authenticated: true,
    user: result.payload,
  };
}

/**
 * Authorize an authenticated user against required permissions
 */
export function authorizeUser(user, requiredPermission) {
  if (!user || !user.role) {
    return {
      authorized: false,
      statusCode: 401,
      error: { code: 'UNAUTHENTICATED', message: 'Valid user context is required' },
    };
  }

  if (!hasPermission(user.role, requiredPermission)) {
    return {
      authorized: false,
      statusCode: 403,
      error: {
        code: 'FORBIDDEN',
        message: `Role '${user.role}' lacks required permission '${requiredPermission}'`,
      },
    };
  }

  return { authorized: true };
}

/**
 * Create a structured audit event entry for authentication/authorization
 */
export function createAuthAuditEvent({ action, userId, role, ipAddress, success, details = {} }) {
  return {
    id: `audit-${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
    category: 'AUTH',
    action,
    userId: userId || null,
    role: role || null,
    ipAddress: ipAddress || '127.0.0.1',
    success: Boolean(success),
    details,
  };
}
