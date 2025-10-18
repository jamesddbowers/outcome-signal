/**
 * Mock Document Data Service
 * Provides sample markdown documents for testing TipTap editor
 */

// Short document (~5 pages, 500 lines)
const SHORT_PRD = `# Product Requirements Document - Customer Portal MVP

## 1. Executive Summary

This document outlines the requirements for the Customer Portal MVP, a web-based application that enables customers to manage their accounts, view invoices, and submit support tickets.

### 1.1 Project Overview
**Project Name:** Customer Portal MVP
**Version:** 1.0
**Last Updated:** 2025-10-18

### 1.2 Goals
- Provide customers with self-service account management
- Reduce support ticket volume by 30%
- Improve customer satisfaction scores by 20%

## 2. User Stories

### 2.1 User Authentication
**As a** customer,
**I want** to securely log in to my account,
**so that** I can access my personal information and services.

**Acceptance Criteria:**
- Users can register with email and password
- Users can log in with existing credentials
- Users can reset forgotten passwords via email
- Sessions expire after 30 minutes of inactivity

### 2.2 Account Management
**As a** customer,
**I want** to view and update my account information,
**so that** I can keep my profile current.

**Acceptance Criteria:**
- Users can view their profile information
- Users can update name, email, phone number
- Users can change their password
- Changes are saved and reflected immediately

### 2.3 Invoice Management
**As a** customer,
**I want** to view my invoices and payment history,
**so that** I can track my spending and payments.

**Acceptance Criteria:**
- Users can view a list of all invoices
- Users can filter invoices by date range and status
- Users can download invoices as PDF
- Users can view payment history with transaction details

## 3. Technical Architecture

### 3.1 Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **Routing:** React Router v6

### 3.2 Backend
- **API:** REST API built with Node.js and Express
- **Database:** PostgreSQL
- **Authentication:** JWT tokens with refresh mechanism
- **File Storage:** AWS S3 for invoice PDFs

### 3.3 Infrastructure
- **Hosting:** AWS
- **CDN:** CloudFront
- **Monitoring:** DataDog
- **CI/CD:** GitHub Actions

## 4. Design Specifications

### 4.1 Color Palette
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Error: #EF4444 (Red)
- Background: #F9FAFB (Light Gray)
- Text: #111827 (Dark Gray)

### 4.2 Typography
- Headings: Inter, 700 weight
- Body: Inter, 400 weight
- Monospace: Fira Code

## 5. Security Requirements

### 5.1 Authentication
- Passwords must be at least 12 characters
- Must include uppercase, lowercase, number, and special character
- MFA required for sensitive operations
- Account lockout after 5 failed login attempts

### 5.2 Data Protection
- All data encrypted at rest (AES-256)
- All data encrypted in transit (TLS 1.3)
- PII data masked in logs
- Regular security audits and penetration testing

## 6. Performance Requirements

- Page load time: < 2 seconds
- API response time: < 500ms for 95th percentile
- Support 10,000 concurrent users
- 99.9% uptime SLA

## 7. Testing Strategy

### 7.1 Unit Tests
- Target coverage: > 80%
- Test framework: Jest
- Run on every commit

### 7.2 Integration Tests
- API endpoint testing
- Database integration testing
- Third-party service mocking

### 7.3 E2E Tests
- Critical user flows
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing

## 8. Deployment Plan

### 8.1 Staging Environment
- Deployed automatically on merge to \`develop\` branch
- Used for QA and stakeholder review
- Data seeded with test accounts

### 8.2 Production Environment
- Deployed manually after QA approval
- Blue-green deployment strategy
- Automatic rollback on errors

## 9. Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Third-party API downtime | High | Medium | Implement circuit breakers and fallback mechanisms |
| Database performance | High | Low | Optimize queries, add caching layer |
| Security vulnerability | Critical | Low | Regular security audits, dependency updates |
| Scope creep | Medium | High | Strict change request process |

## 10. Success Metrics

- Customer satisfaction score > 4.5/5
- Support ticket volume reduced by 30%
- 80% of users complete onboarding
- < 5% error rate in production

---

**Document Status:** Approved
**Approver:** Jane Smith, Product Manager
**Approval Date:** 2025-10-15
`;

// Medium document (~20 pages, 2000 lines)
const MEDIUM_PRD = SHORT_PRD + `

## 11. User Interface Specifications

### 11.1 Dashboard
The dashboard serves as the landing page after user login.

**Layout:**
- Top navigation bar with logo and user menu
- Sidebar navigation (collapsed on mobile)
- Main content area with widgets

**Widgets:**
- Account balance summary
- Recent invoices (last 3)
- Quick actions (Pay Bill, View Invoices, Contact Support)
- Notifications panel

### 11.2 Account Settings Page
Full-page form for managing account information.

**Sections:**
- Personal Information (Name, Email, Phone)
- Address (Billing and Shipping)
- Password Management
- Notification Preferences
- Connected Accounts (OAuth integrations)

### 11.3 Invoice List Page
Paginated table of all customer invoices.

**Features:**
- Sortable columns (Date, Amount, Status)
- Search by invoice number
- Filter by date range and status
- Bulk actions (Download selected, Export to CSV)

## 12. API Endpoints

### 12.1 Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
\`\`\`

#### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
\`\`\`

**Response:**
\`\`\`json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
\`\`\`

### 12.2 User Endpoints

#### GET /api/users/me
Get current user profile.

**Response:**
\`\`\`json
{
  "id": "usr_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "createdAt": "2025-01-01T00:00:00Z"
}
\`\`\`

#### PATCH /api/users/me
Update current user profile.

**Request Body:**
\`\`\`json
{
  "firstName": "Jane",
  "phone": "+1-555-987-6543"
}
\`\`\`

### 12.3 Invoice Endpoints

#### GET /api/invoices
List all invoices for current user.

**Query Parameters:**
- \`page\` (default: 1)
- \`limit\` (default: 20)
- \`status\` (paid, pending, overdue)
- \`startDate\` (ISO 8601)
- \`endDate\` (ISO 8601)

**Response:**
\`\`\`json
{
  "invoices": [
    {
      "id": "inv_123",
      "number": "INV-2025-001",
      "amount": 99.99,
      "status": "paid",
      "dueDate": "2025-02-01",
      "paidDate": "2025-01-28"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
\`\`\`

## 13. Database Schema

### 13.1 Users Table
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
\`\`\`

### 13.2 Invoices Table
\`\`\`sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  paid_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
\`\`\`

### 13.3 Support Tickets Table
\`\`\`sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at);
\`\`\`

## 14. Error Handling

### 14.1 Error Response Format
All API errors return a consistent structure:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
\`\`\`

### 14.2 Error Codes
- \`VALIDATION_ERROR\` - Invalid input data
- \`AUTHENTICATION_ERROR\` - Invalid credentials
- \`AUTHORIZATION_ERROR\` - Insufficient permissions
- \`NOT_FOUND\` - Resource not found
- \`RATE_LIMIT_EXCEEDED\` - Too many requests
- \`INTERNAL_ERROR\` - Server error

## 15. Accessibility Requirements

### 15.1 WCAG 2.1 Level AA Compliance
- All interactive elements keyboard accessible
- Minimum color contrast ratio: 4.5:1 for text
- Descriptive alt text for all images
- Form labels associated with inputs
- Skip navigation links

### 15.2 Screen Reader Support
- Semantic HTML elements
- ARIA labels and roles
- Live regions for dynamic content
- Descriptive link text

## 16. Internationalization

### 16.1 Supported Languages
- English (US) - Primary
- Spanish (ES)
- French (FR)
- German (DE)

### 16.2 Implementation
- Use react-i18next for translations
- Store translations in JSON files
- Detect user language from browser
- Allow manual language selection

## 17. Analytics

### 17.1 Events to Track
- User registration
- User login
- Invoice viewed
- Invoice downloaded
- Support ticket created
- Payment initiated
- Password reset requested

### 17.2 Tools
- Google Analytics 4
- Mixpanel for user behavior
- Sentry for error tracking

## 18. Compliance

### 18.1 GDPR
- Cookie consent banner
- Data export functionality
- Right to be forgotten (account deletion)
- Privacy policy and terms of service

### 18.2 PCI DSS
- No credit card data stored on our servers
- Use Stripe for payment processing
- Annual compliance audit

## 19. Support and Maintenance

### 19.1 Support Tiers
- **Tier 1:** Email support (24-hour response)
- **Tier 2:** Phone support (business hours)
- **Tier 3:** Dedicated account manager (enterprise customers)

### 19.2 Maintenance Windows
- Scheduled maintenance: Sundays 2-4 AM EST
- Emergency maintenance: As needed with 1-hour notice
`;

// Generate a long document by repeating sections with variations
const generateLongPRD = (): string => {
  let longDoc = MEDIUM_PRD;

  for (let i = 20; i <= 100; i++) {
    longDoc += `

## ${i}. Additional Section ${i}

This section provides additional details for the Customer Portal MVP project.

### ${i}.1 Subsection A
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

**Key Points:**
- Point 1: Implementation detail for feature ${i}
- Point 2: Configuration requirement
- Point 3: Testing criteria
- Point 4: Deployment consideration

### ${i}.2 Subsection B
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

\`\`\`typescript
// Code example for section ${i}
function featureImplementation${i}() {
  const result = processData();
  return result.map(item => ({
    id: item.id,
    value: item.value * 2,
    status: 'processed'
  }));
}
\`\`\`

### ${i}.3 Subsection C
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

> **Note:** This is an important consideration for section ${i}.
> Make sure to review all requirements before implementation.

### ${i}.4 Technical Details

| Feature | Status | Priority | Owner |
|---------|--------|----------|-------|
| Feature ${i}-A | In Progress | High | Team Alpha |
| Feature ${i}-B | Planned | Medium | Team Beta |
| Feature ${i}-C | Complete | Low | Team Gamma |

### ${i}.5 Implementation Checklist
- [ ] Design review completed
- [ ] Technical specification written
- [ ] Development started
- [ ] Unit tests written
- [ ] Integration tests completed
- [ ] QA testing passed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Production deployment approved
`;
  }

  return longDoc;
};

const LONG_PRD = generateLongPRD();

/**
 * Mock document service that simulates fetching documents
 * @param initiativeId - The initiative ID
 * @param epicId - Optional epic ID
 * @returns Promise resolving to markdown content
 */
export async function getMockDocument(
  initiativeId: string,
  epicId?: string
): Promise<string> {
  // Simulate network delay (200-300ms)
  await new Promise((resolve) =>
    setTimeout(resolve, 200 + Math.random() * 100)
  );

  // Return different documents based on initiative ID for testing
  if (initiativeId === 'short') {
    return SHORT_PRD;
  } else if (initiativeId === 'medium') {
    return MEDIUM_PRD;
  } else if (initiativeId === 'long') {
    return LONG_PRD;
  }

  // Return epic-specific document if epicId provided
  if (epicId) {
    return `# Epic Document: ${epicId}

## Epic Overview
This is a mock epic document for epic **${epicId}** under initiative **${initiativeId}**.

${SHORT_PRD}`;
  }

  // Default to medium PRD
  return MEDIUM_PRD;
}

/**
 * Get document size information for testing
 */
export function getDocumentSizeInfo(): {
  short: { name: string; lines: number; chars: number; pages: number };
  medium: { name: string; lines: number; chars: number; pages: number };
  long: { name: string; lines: number; chars: number; pages: number };
} {
  return {
    short: {
      name: 'Short PRD',
      lines: SHORT_PRD.split('\n').length,
      chars: SHORT_PRD.length,
      pages: Math.ceil(SHORT_PRD.split('\n').length / 50),
    },
    medium: {
      name: 'Medium PRD',
      lines: MEDIUM_PRD.split('\n').length,
      chars: MEDIUM_PRD.length,
      pages: Math.ceil(MEDIUM_PRD.split('\n').length / 50),
    },
    long: {
      name: 'Long PRD',
      lines: LONG_PRD.split('\n').length,
      chars: LONG_PRD.length,
      pages: Math.ceil(LONG_PRD.split('\n').length / 50),
    },
  };
}
