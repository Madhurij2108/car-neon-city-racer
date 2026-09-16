import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hashPassword,
  verifyPassword,
  signJwt,
  verifyJwt,
  authenticateAuthHeader,
  authorizeUser,
  createAuthAuditEvent,
} from '../src/auth/auth.js';

describe('Auth & Security Boundaries', () => {
  const testSecret = 'super-secret-test-key-must-be-secure-32+chars';

  describe('Password Hashing & Verification', () => {
    it('should hash a plain password and verify successfully', () => {
      const plain = 'ChangeMe!12345';
      const hash = hashPassword(plain);
      assert.ok(hash.includes(':'), 'Hash must contain salt delimiter');
      assert.strictEqual(verifyPassword(plain, hash), true);
    });

    it('should reject invalid passwords against stored hash', () => {
      const hash = hashPassword('CorrectPassword123');
      assert.strictEqual(verifyPassword('WrongPassword123', hash), false);
      assert.strictEqual(verifyPassword('', hash), false);
      assert.strictEqual(verifyPassword(null, hash), false);
    });
  });

  describe('JWT Token Lifecycle & Verification', () => {
    const payload = {
      userId: 'usr-admin-001',
      email: 'admin@car-neon-city-racer.local',
      role: ROLES.ADMIN,
      workspaceId: 'ws-neon-prime',
    };

    it('should sign and successfully verify a valid JWT', () => {
      const token = signJwt(payload, testSecret, { expiresInSeconds: 60 });
      assert.ok(token);
      const result = verifyJwt(token, testSecret);
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.payload.userId, payload.userId);
      assert.strictEqual(result.payload.role, payload.role);
      assert.strictEqual(result.payload.iss, 'car-neon-city-racer');
      assert.strictEqual(result.payload.aud, 'car-neon-city-racer-api');
    });

    it('should reject a token with invalid signature', () => {
      const token = signJwt(payload, testSecret);
      const tampered = token.slice(0, -5) + 'abcde';
      const result = verifyJwt(tampered, testSecret);
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.error, 'Invalid token signature');
    });

    it('should reject an expired token', () => {
      const token = signJwt(payload, testSecret, { expiresInSeconds: -10 });
      const result = verifyJwt(token, testSecret);
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.expired, true);
    });

    it('should reject malformed tokens', () => {
      assert.strictEqual(verifyJwt('bad-token', testSecret).valid, false);
      assert.strictEqual(verifyJwt('', testSecret).valid, false);
      assert.strictEqual(verifyJwt(null, testSecret).valid, false);
    });
  });

  describe('RBAC Roles & Permissions Matrix', () => {
    it('admin should have full administrative and operational permissions', () => {
      assert.strictEqual(hasPermission(ROLES.ADMIN, PERMISSIONS.WORKSPACE_MANAGE), true);
      assert.strictEqual(hasPermission(ROLES.ADMIN, PERMISSIONS.APPROVAL_APPROVE), true);
      assert.strictEqual(hasPermission(ROLES.ADMIN, PERMISSIONS.AUDIT_VIEW), true);
      assert.strictEqual(hasPermission(ROLES.ADMIN, PERMISSIONS.RACE_PLAY), true);
    });

    it('reviewer should have approval and audit permissions but not workspace manage', () => {
      assert.strictEqual(hasPermission(ROLES.REVIEWER, PERMISSIONS.APPROVAL_APPROVE), true);
      assert.strictEqual(hasPermission(ROLES.REVIEWER, PERMISSIONS.APPROVAL_REJECT), true);
      assert.strictEqual(hasPermission(ROLES.REVIEWER, PERMISSIONS.AUDIT_VIEW), true);
      assert.strictEqual(hasPermission(ROLES.REVIEWER, PERMISSIONS.WORKSPACE_MANAGE), false);
      assert.strictEqual(hasPermission(ROLES.REVIEWER, PERMISSIONS.SCORE_SUBMIT), false);
    });

    it('racer should have gameplay and submission permissions but not approval actions', () => {
      assert.strictEqual(hasPermission(ROLES.RACER, PERMISSIONS.RACE_PLAY), true);
      assert.strictEqual(hasPermission(ROLES.RACER, PERMISSIONS.SCORE_SUBMIT), true);
      assert.strictEqual(hasPermission(ROLES.RACER, PERMISSIONS.APPROVAL_REQUEST), true);
      assert.strictEqual(hasPermission(ROLES.RACER, PERMISSIONS.APPROVAL_APPROVE), false);
      assert.strictEqual(hasPermission(ROLES.RACER, PERMISSIONS.AUDIT_VIEW), false);
    });

    it('guest should only have read-only access', () => {
      assert.strictEqual(hasPermission(ROLES.GUEST, PERMISSIONS.SCORE_VIEW), true);
      assert.strictEqual(hasPermission(ROLES.GUEST, PERMISSIONS.RACE_PLAY), false);
      assert.strictEqual(hasPermission(ROLES.GUEST, PERMISSIONS.APPROVAL_APPROVE), false);
    });
  });

  describe('HTTP Header Authentication & Authorization Guard', () => {
    it('should authenticate valid Bearer token header', () => {
      const user = { userId: 'usr-racer-001', role: ROLES.RACER };
      const token = signJwt(user, testSecret);
      const authHeader = `Bearer ${token}`;

      const res = authenticateAuthHeader(authHeader, testSecret);
      assert.strictEqual(res.authenticated, true);
      assert.strictEqual(res.user.userId, 'usr-racer-001');
    });

    it('should return 401 when Bearer header is missing or invalid', () => {
      const missing = authenticateAuthHeader(null, testSecret);
      assert.strictEqual(missing.authenticated, false);
      assert.strictEqual(missing.statusCode, 401);

      const invalid = authenticateAuthHeader('Bearer invalid-token-string', testSecret);
      assert.strictEqual(invalid.authenticated, false);
      assert.strictEqual(invalid.statusCode, 401);
    });

    it('should authorize user with permission and reject unauthorized user with 403', () => {
      const racerUser = { userId: 'usr-001', role: ROLES.RACER };

      // Racer can submit scores
      const allowed = authorizeUser(racerUser, PERMISSIONS.SCORE_SUBMIT);
      assert.strictEqual(allowed.authorized, true);

      // Racer cannot approve submissions
      const denied = authorizeUser(racerUser, PERMISSIONS.APPROVAL_APPROVE);
      assert.strictEqual(denied.authorized, false);
      assert.strictEqual(denied.statusCode, 403);
    });
  });

  describe('Audit Event Boundary', () => {
    it('should generate structured auth audit event with immutable schema', () => {
      const event = createAuthAuditEvent({
        action: 'USER_LOGIN',
        userId: 'usr-admin-001',
        role: ROLES.ADMIN,
        ipAddress: '10.0.0.1',
        success: true,
        details: { method: 'password' },
      });

      assert.ok(event.id.startsWith('audit-'));
      assert.strictEqual(event.category, 'AUTH');
      assert.strictEqual(event.action, 'USER_LOGIN');
      assert.strictEqual(event.role, ROLES.ADMIN);
      assert.strictEqual(event.success, true);
      assert.strictEqual(event.details.method, 'password');
      assert.ok(event.timestamp);
    });
  });
});
