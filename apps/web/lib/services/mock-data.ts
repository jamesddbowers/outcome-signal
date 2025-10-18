/**
 * Mock Data Service
 *
 * Provides mock data for Initiatives and Epics until real API endpoints
 * are implemented in Epic 7. This allows us to build and test the UI
 * components without backend dependencies.
 *
 * @temporary This file will be replaced when real API endpoints are available
 */

export type InitiativeStatus = 'active' | 'archived';
export type InitiativePhase = 'planning' | 'development' | 'testing' | 'deployed';

export interface Initiative {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: InitiativeStatus;
  phase: InitiativePhase;
  phase_progress: number; // 0-100
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface Epic {
  id: string;
  initiative_id: string;
  epic_number: number;
  title: string;
  description: string | null;
  story_count: number;
  status: 'pending' | 'in_progress' | 'completed';
}

// Mock initiatives data
const MOCK_INITIATIVES: Initiative[] = [
  {
    id: 'init-001',
    user_id: 'user-123',
    title: 'Customer Portal MVP',
    description: 'Build a customer-facing portal for self-service account management',
    status: 'active',
    phase: 'development',
    phase_progress: 65,
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-10-18T14:30:00Z',
    archived_at: null,
  },
  {
    id: 'init-002',
    user_id: 'user-123',
    title: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard for business metrics',
    status: 'active',
    phase: 'planning',
    phase_progress: 25,
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2025-10-18T09:15:00Z',
    archived_at: null,
  },
  {
    id: 'init-003',
    user_id: 'user-123',
    title: 'Mobile App Launch',
    description: 'Native mobile applications for iOS and Android',
    status: 'active',
    phase: 'testing',
    phase_progress: 80,
    created_at: '2025-08-20T12:00:00Z',
    updated_at: '2025-10-17T16:45:00Z',
    archived_at: null,
  },
];

// Mock epics data organized by initiative
const MOCK_EPICS: Record<string, Epic[]> = {
  'init-001': [
    {
      id: 'epic-001-1',
      initiative_id: 'init-001',
      epic_number: 1,
      title: 'User Authentication & Authorization',
      description: 'Implement secure login, registration, and role-based access control',
      story_count: 8,
      status: 'completed',
    },
    {
      id: 'epic-001-2',
      initiative_id: 'init-001',
      epic_number: 2,
      title: 'Account Management',
      description: 'Profile editing, password reset, and account settings',
      story_count: 12,
      status: 'in_progress',
    },
    {
      id: 'epic-001-3',
      initiative_id: 'init-001',
      epic_number: 3,
      title: 'Billing & Subscriptions',
      description: 'Payment processing, subscription management, and invoicing',
      story_count: 15,
      status: 'pending',
    },
    {
      id: 'epic-001-4',
      initiative_id: 'init-001',
      epic_number: 4,
      title: 'Support Ticket System',
      description: 'Customer support ticketing and communication',
      story_count: 10,
      status: 'pending',
    },
  ],
  'init-002': [
    {
      id: 'epic-002-1',
      initiative_id: 'init-002',
      epic_number: 1,
      title: 'Data Collection Pipeline',
      description: 'Set up data ingestion and ETL processes',
      story_count: 6,
      status: 'in_progress',
    },
    {
      id: 'epic-002-2',
      initiative_id: 'init-002',
      epic_number: 2,
      title: 'Dashboard UI Components',
      description: 'Build reusable chart and metric display components',
      story_count: 10,
      status: 'pending',
    },
    {
      id: 'epic-002-3',
      initiative_id: 'init-002',
      epic_number: 3,
      title: 'Real-time Data Streaming',
      description: 'WebSocket integration for live data updates',
      story_count: 8,
      status: 'pending',
    },
  ],
  'init-003': [
    {
      id: 'epic-003-1',
      initiative_id: 'init-003',
      epic_number: 1,
      title: 'Core App Framework',
      description: 'Set up React Native project with navigation',
      story_count: 5,
      status: 'completed',
    },
    {
      id: 'epic-003-2',
      initiative_id: 'init-003',
      epic_number: 2,
      title: 'Feature Parity with Web',
      description: 'Implement all essential web features in mobile',
      story_count: 20,
      status: 'completed',
    },
    {
      id: 'epic-003-3',
      initiative_id: 'init-003',
      epic_number: 3,
      title: 'App Store Deployment',
      description: 'Build pipeline, beta testing, and store submission',
      story_count: 7,
      status: 'in_progress',
    },
  ],
};

/**
 * Simulates an API call to fetch all initiatives for the current user
 *
 * @returns Promise<Initiative[]> Array of initiative objects
 */
export async function getMockInitiatives(): Promise<Initiative[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return only active initiatives
  return MOCK_INITIATIVES.filter((init) => init.status === 'active');
}

/**
 * Simulates an API call to fetch epics for a specific initiative
 *
 * @param initiativeId - The ID of the initiative
 * @returns Promise<Epic[]> Array of epic objects for the initiative
 */
export async function getMockEpics(initiativeId: string): Promise<Epic[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return epics for the given initiative, or empty array if not found
  return MOCK_EPICS[initiativeId] || [];
}

/**
 * Simulates an API call to fetch a single initiative by ID
 *
 * @param initiativeId - The ID of the initiative
 * @returns Promise<Initiative | null> Initiative object or null if not found
 */
export async function getMockInitiative(initiativeId: string): Promise<Initiative | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const initiative = MOCK_INITIATIVES.find((init) => init.id === initiativeId);
  return initiative || null;
}

/**
 * Simulates an API call to fetch a single epic by ID
 *
 * @param epicId - The ID of the epic
 * @returns Promise<Epic | null> Epic object or null if not found
 */
export async function getMockEpic(epicId: string): Promise<Epic | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Search through all initiatives' epics
  for (const epics of Object.values(MOCK_EPICS)) {
    const epic = epics.find((e) => e.id === epicId);
    if (epic) return epic;
  }

  return null;
}
