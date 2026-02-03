# SSO Admin Dashboard MVP

A modern, consistent SSO (Single Sign-On) admin dashboard built with React, TypeScript, and Tailwind CSS.

## Features

### 3 Core Pages

1. **Dashboard** (`/dashboard`)
   - Overview metrics (Total Users, Active Sessions, MFA Adoption, Security Alerts)
   - Recent login activity
   - Security event timeline
   - User statistics

2. **Users List** (`/users`)
   - Searchable user table
   - Filter by role, status, MFA status
   - View user details: name, email, role, status, MFA, last login
   - Pagination support

3. **User Detail** (`/users/:userId`)
   - Full user profile information
   - Account details (role, status, created date, last login)
   - Security settings (MFA, email verification)
   - Recent activity timeline
   - Actions: Edit, Delete, Force password reset

## Design System

### Consistency Rules

This project follows strict consistency rules enforced by the frontend-ui-ux-publishing skill:

- **Spacing**: 8px scale only (4, 8, 16, 24, 32, 40, 48)
- **Colors**: Purple primary (#8b5cf6) with semantic tokens
- **Typography**: Fixed hierarchy (Page Title, Section Title, Body, Caption)
- **Components**: All components imported from `@/components/common/`
- **Page Templates**: Follows standardized List/Detail/Dashboard patterns

### Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Design Tokens** for consistent spacing, colors, and typography

## Project Structure

```
sso-admin-mvp/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── PageLayout.tsx
│   │   │   └── index.ts
│   │   └── features/        # Feature-specific components
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── UsersListPage.tsx
│   │   └── UserDetailPage.tsx
│   ├── styles/
│   │   ├── globals.css      # Global styles
│   │   └── tokens.css       # Design tokens
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── public/
│   └── logo.png             # Brand logo
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173`

### Navigation

- `/` - Redirects to Dashboard
- `/dashboard` - Main dashboard with metrics
- `/users` - Users list page
- `/users/:userId` - Individual user details

## Key Features

### User Management
- View all users with role badges
- Filter by status (active, inactive, suspended)
- MFA status indicators
- Last login timestamps
- Quick navigation to user details

### Security
- MFA adoption metrics
- Security event tracking
- Failed login monitoring
- Account status management

### Consistency
- All spacing uses 8px scale
- Semantic color tokens (no hardcoded colors)
- Fixed typography hierarchy
- Standardized page layouts
- Common component library

## MVP Scope

This is an MVP with 3 pages focusing on core user management functionality:
- ✅ Dashboard overview
- ✅ Users list with search/filter
- ✅ User detail with security settings
- ⏳ Settings page (placeholder in navigation)
- ⏳ Real API integration
- ⏳ Authentication flow
- ⏳ Role management
- ⏳ Audit logs

## Consistency Validation

To validate consistency rules:

```bash
python ../frontend-ui-ux-publishing/scripts/validate-consistency.py src/
```

This checks:
- 8px spacing scale compliance
- No hardcoded colors
- Proper component imports
- Design token usage

## Built With

This project was built using the **frontend-ui-ux-publishing** skill, which enforces:
- Predictability over aesthetic variation
- Rules over freedom
- Systematic decisions over case-by-case judgment
- Common components to enforce consistency
- Design tokens to prevent hardcoding
- Templates to ensure structural consistency

## License

MIT
