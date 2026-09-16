/**
 * Deterministic seed and review data for Car Neon City Racer
 * Used for development, CI/CD gates, local previews, and automated testing.
 */

export const SEED_USERS = [
  {
    id: 'usr-admin-001',
    email: 'admin@car-neon-city-racer.local',
    passwordPlain: 'ChangeMe!12345',
    passwordHash: 'salt_for_demo_neon_2026:b0cbdc34e0df54ff3180838b113a3d55975b441d7a824e32efc042a6e96f4d0af29338e4e9a30b602c5624176c2cb0d0ed67c028147545ac3c26fac6e27453cb',
    name: 'System Admin',
    role: 'admin',
    workspaceId: 'ws-neon-prime',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'usr-reviewer-001',
    email: 'reviewer@car-neon-city-racer.local',
    passwordPlain: 'ChangeMe!12345',
    passwordHash: 'salt_for_demo_neon_2026:b0cbdc34e0df54ff3180838b113a3d55975b441d7a824e32efc042a6e96f4d0af29338e4e9a30b602c5624176c2cb0d0ed67c028147545ac3c26fac6e27453cb',
    name: 'Race Marshal Alex',
    role: 'reviewer',
    workspaceId: 'ws-neon-prime',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'usr-racer-001',
    email: 'racer1@car-neon-city-racer.local',
    passwordPlain: 'ChangeMe!12345',
    passwordHash: 'salt_for_demo_neon_2026:b0cbdc34e0df54ff3180838b113a3d55975b441d7a824e32efc042a6e96f4d0af29338e4e9a30b602c5624176c2cb0d0ed67c028147545ac3c26fac6e27453cb',
    name: 'Neon Phantom Kai',
    role: 'racer',
    workspaceId: 'ws-neon-prime',
    createdAt: '2026-09-02T00:00:00.000Z',
  },
  {
    id: 'usr-racer-002',
    email: 'racer2@car-neon-city-racer.local',
    passwordPlain: 'ChangeMe!12345',
    passwordHash: 'salt_for_demo_neon_2026:b0cbdc34e0df54ff3180838b113a3d55975b441d7a824e32efc042a6e96f4d0af29338e4e9a30b602c5624176c2cb0d0ed67c028147545ac3c26fac6e27453cb',
    name: 'Cyber Drift Maya',
    role: 'racer',
    workspaceId: 'ws-neon-prime',
    createdAt: '2026-09-02T00:00:00.000Z',
  },
];

export const SEED_WORKSPACES = [
  {
    id: 'ws-neon-prime',
    slug: 'neon-city-grand-prix',
    name: 'Neon City Grand Prix League',
    description: 'Premier competitive neon circuit racing championship and vehicle engineering workspace.',
    ownerId: 'usr-admin-001',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

export const SEED_TRACKS = [
  {
    id: 'trk-001',
    workspaceId: 'ws-neon-prime',
    name: 'Downtown Neon Expressway',
    difficulty: 'Medium',
    lengthKm: 3.8,
    nitroPads: 4,
    recordLapMs: 74220, // 1m 14.22s
    ambientTheme: 'Synthwave Midnight',
  },
  {
    id: 'trk-002',
    workspaceId: 'ws-neon-prime',
    name: 'Cyberpunk Skyline Overpass',
    difficulty: 'Hard',
    lengthKm: 5.2,
    nitroPads: 6,
    recordLapMs: 102450, // 1m 42.45s
    ambientTheme: 'Neon Rain High-Rise',
  },
  {
    id: 'trk-003',
    workspaceId: 'ws-neon-prime',
    name: 'Underground Industrial Grid',
    difficulty: 'Expert',
    lengthKm: 4.1,
    nitroPads: 5,
    recordLapMs: 88100, // 1m 28.10s
    ambientTheme: 'Hypergrid Tunnel',
  },
];

export const SEED_VEHICLES = [
  {
    id: 'veh-001',
    name: 'Apex Phantom GT',
    neonColor: '#00ffff', // Cyan
    topSpeedKmh: 290,
    acceleration: 88,
    handling: 85,
    nitroBoost: 95,
  },
  {
    id: 'veh-002',
    name: 'Viper Cyberline',
    neonColor: '#ff007f', // Magenta
    topSpeedKmh: 310,
    acceleration: 92,
    handling: 78,
    nitroBoost: 88,
  },
  {
    id: 'veh-003',
    name: 'Solaris Drift-R',
    neonColor: '#ffe600', // Yellow
    topSpeedKmh: 275,
    acceleration: 82,
    handling: 96,
    nitroBoost: 90,
  },
];

export const SEED_APPROVALS = [
  {
    id: 'appr-001',
    workspaceId: 'ws-neon-prime',
    trackId: 'trk-001',
    submitterId: 'usr-racer-001',
    reviewerId: 'usr-reviewer-001',
    type: 'LAP_RECORD_VERIFICATION',
    title: 'Track Record Claim: Downtown Neon Expressway (01:14.22)',
    status: 'approved',
    telemetryDataUrl: '/uploads/telemetry-racer1-trk1.json',
    comments: [
      {
        id: 'cmt-001',
        authorId: 'usr-reviewer-001',
        text: 'Telemetry telemetry verified. Zero collision breaches detected. Approved as new record.',
        createdAt: '2026-09-03T10:15:00.000Z',
      },
    ],
    submittedAt: '2026-09-03T09:30:00.000Z',
    reviewedAt: '2026-09-03T10:15:00.000Z',
  },
  {
    id: 'appr-002',
    workspaceId: 'ws-neon-prime',
    trackId: 'trk-002',
    submitterId: 'usr-racer-002',
    reviewerId: 'usr-reviewer-001',
    type: 'CUSTOM_SKIN_APPROVAL',
    title: 'Holographic Cyberline Chassis Skin Submission',
    status: 'pending',
    telemetryDataUrl: '/uploads/skin-racer2-viper.json',
    comments: [],
    submittedAt: '2026-09-04T14:00:00.000Z',
    reviewedAt: null,
  },
  {
    id: 'appr-003',
    workspaceId: 'ws-neon-prime',
    trackId: 'trk-003',
    submitterId: 'usr-racer-001',
    reviewerId: 'usr-reviewer-001',
    type: 'LAP_RECORD_VERIFICATION',
    title: 'Disputed Lap: Underground Industrial Grid (Wallclip suspicion)',
    status: 'rejected',
    telemetryDataUrl: '/uploads/telemetry-racer1-trk3-dispute.json',
    comments: [
      {
        id: 'cmt-002',
        authorId: 'usr-reviewer-001',
        text: 'Telemetry shows velocity anomaly at checkpoint 4. Boundary clipping detected. Disallowed.',
        createdAt: '2026-09-05T16:20:00.000Z',
      },
    ],
    submittedAt: '2026-09-05T15:00:00.000Z',
    reviewedAt: '2026-09-05T16:20:00.000Z',
  },
];

export const SEED_AUDIT_LOGS = [
  {
    id: 'audit-001',
    timestamp: '2026-09-01T00:00:00.000Z',
    category: 'SYSTEM',
    action: 'SYSTEM_BOOTSTRAP',
    userId: 'usr-admin-001',
    role: 'admin',
    ipAddress: '127.0.0.1',
    success: true,
    details: { message: 'Database initialized with deterministic seed records' },
  },
  {
    id: 'audit-002',
    timestamp: '2026-09-03T10:15:00.000Z',
    category: 'WORKFLOW',
    action: 'APPROVAL_RESOLVED',
    userId: 'usr-reviewer-001',
    role: 'reviewer',
    ipAddress: '127.0.0.1',
    success: true,
    details: { approvalId: 'appr-001', newStatus: 'approved' },
  },
  {
    id: 'audit-003',
    timestamp: '2026-09-05T16:20:00.000Z',
    category: 'WORKFLOW',
    action: 'APPROVAL_RESOLVED',
    userId: 'usr-reviewer-001',
    role: 'reviewer',
    ipAddress: '127.0.0.1',
    success: true,
    details: { approvalId: 'appr-003', newStatus: 'rejected', reason: 'Boundary clipping anomaly' },
  },
];
