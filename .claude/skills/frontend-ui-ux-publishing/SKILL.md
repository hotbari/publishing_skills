---
name: frontend-publishing
description: |
  Build consistent, modern React frontends with Tailwind CSS + shadcn/ui (or Ant Design for admin dashboards). Use this skill when you need to create professional web UIs including: (1) SSO admin dashboards, (2) OCR pipeline interfaces, (3) CRUD applications, (4) data visualization dashboards, (5) form-heavy applications, or (6) any frontend implementation from requirements documents. This skill enforces strict consistency rules for spacing, layout, components, typography, and interactions to ensure predictable, high-quality outputs even with incomplete requirements.
---

# Frontend UI/UX Publishing Skill

## Core Objective

This skill exists to produce **consistent, modern React frontends** that follow strict design rules.

**Primary goal**: Consistency over creativity
**Approach**: Rules-based, systematic, predictable
**Function**: Consistency-enforcing system, not a designer

## When to Use This Skill

Use this skill when building any React frontend UI, including:
- Admin dashboards (SSO, user management, etc.)
- Data-heavy applications (OCR pipelines, analytics)
- CRUD interfaces
- Form-heavy applications
- Any web application requiring modern, polished UI

## Quick Start

### 1. Understand Requirements

Read the requirements document (any format) or user request to identify:
- What pages are needed (List, Detail, Form, Dashboard)
- What data is being managed
- What user interactions are required

### 2. Initialize Project

Use the project template:

```bash
cp -r assets/project-template/* <target-directory>/
cd <target-directory>
npm install
```

Or use the automation script:

```bash
python scripts/init-project.py <project-name> <target-directory>
```

### 3. Build Pages Using Templates

Based on requirements, build pages using the four standard templates:
- **List Page**: Tables, search, filters, pagination
- **Detail Page**: View single record, related data
- **Form Page**: Create/edit records with validation
- **Dashboard Page**: Charts, metrics, summaries

See `references/page-templates.md` for detailed specifications.

### 4. Use Common Components Only

**CRITICAL RULE**: Pages must NEVER import from `src/ui/` directly.

All UI elements must go through `src/components/common/`:
- Button
- Form (with React Hook Form + Zod)
- Table (with TanStack Table)
- Input, Select, Textarea
- Modal, Drawer
- PageLayout (Header, Sidebar, Footer)

This enforces consistency. See `references/component-library.md`.

### 5. Follow Consistency Rules

The skill enforces rules in this priority order:

1. **Spacing/Layout** (Highest Priority)
   - 8px scale only: `4 | 8 | 16 | 24 | 32 | 40 | 48`
   - Use predefined page templates

2. **Component Behavior**
   - Same-purpose components behave identically
   - Forms validate the same way
   - Tables paginate the same way

3. **Typography Hierarchy**
   - Fixed text roles: Page Title, Section Title, Body, Caption
   - Defined via design tokens

4. **Color Usage**
   - Semantic roles only (Primary, Secondary, Success, Error, Warning)
   - No decorative colors

5. **Interaction Patterns**
   - Modals, drawers, toasts behave consistently
   - Standardized animations

See `references/consistency-rules.md` for complete ruleset.

## Technology Stack (Fixed)

- **React Setup**: Vite (default), Next.js only when SSR required
- **Design System**: Tailwind CSS + shadcn/ui (primary), Ant Design (secondary for admin dashboards)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table (or Ant Design Table)
- **Validation**: Zod

## Design System Selection

**Default**: Tailwind CSS + shadcn/ui

**Use Ant Design only if**:
- Admin or operator dashboards
- Complex CRUD with heavy table/form usage
- Rapid implementation is highest priority

**When in doubt**: Use shadcn/ui

## Handling Incomplete Requirements

When requirements are unclear or incomplete:
1. Apply fixed default layout (List/Detail/Form/Dashboard)
2. Use existing common components
3. Reuse established interaction patterns
4. **DO NOT** invent new patterns based on assumptions

Consistency takes precedence over speculative customization.

## Reference Documents

Read these as needed for detailed guidance:

- **`references/design-system.md`**: Design tokens, spacing, colors, typography
- **`references/component-library.md`**: Common component specs and APIs
- **`references/page-templates.md`**: List/Detail/Form/Dashboard specifications
- **`references/consistency-rules.md`**: Complete consistency ruleset
- **`references/form-patterns.md`**: React Hook Form + Zod patterns
- **`references/table-patterns.md`**: TanStack Table patterns
- **`references/decision-trees.md`**: When to use what (shadcn vs Ant, etc.)

## Example Workflow

1. **User request**: "Build an SSO admin dashboard"

2. **Initialize project**:
   ```bash
   python scripts/init-project.py sso-admin ./sso-admin
   ```

3. **Identify pages needed**:
   - Users list (List Page)
   - User detail (Detail Page)
   - Create/edit user (Form Page)
   - Dashboard overview (Dashboard Page)

4. **Build each page** using `assets/examples/` as reference:
   - Copy `ListPage.example.tsx` → customize for Users
   - Copy `DetailPage.example.tsx` → customize for User
   - Copy `FormPage.example.tsx` → customize for User form
   - Copy `DashboardPage.example.tsx` → customize for overview

5. **Validate consistency**:
   ```bash
   python scripts/validate-consistency.py
   ```

6. **Run and iterate**:
   ```bash
   npm run dev
   ```

## Validation

Before declaring the frontend complete:
- Run `npm run build` (must pass with no errors)
- Run `python scripts/validate-consistency.py` (must pass)
- Verify all pages follow templates
- Verify all spacing uses 8px scale
- Verify no direct imports from `ui/`

## Key Principles

- **Predictability over aesthetic variation**
- **Rules over freedom**
- **Systematic decisions over case-by-case judgment**
- **Common components enforce consistency**
- **Design tokens prevent hardcoding**
- **Templates ensure structural consistency**

This skill produces the same quality output every time, regardless of requirements format or completeness.
