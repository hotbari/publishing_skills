# OCR Portal Frontend Publishing Plan

## Document Metadata
- **Plan File**: ocr_prd_pub_plan.md
- **Based on**: OCR_PRD.pdf v1.2
- **Date**: 2026-02-03
- **Status**: Phase 1 - Initial Understanding

## PRD Summary

### Core System
- **Purpose**: File upload portal with user-triggered OCR text extraction and image extraction
- **Stack**: React Frontend + FastAPI Backend + MinIO Storage + PostgreSQL + Job Runner
- **Users**: USER (file operations) and ADMIN (system management)

### Key Workflow
1. **Upload**: Store original files to MinIO (no automatic processing)
2. **User-Triggered Extraction**:
   - OCR text extraction via button → async Job → results stored in PostgreSQL
   - Image extraction via button → async Job → images stored in MinIO
3. **Results Viewing**: Text viewer, image gallery/viewer, download functionality

---

## Phase 1: Initial Understanding (In Progress)

### PRD Analysis Completed

**User Roles & Permissions:**
- USER: Upload, view, download, trigger OCR/image extraction, retry failed jobs
- ADMIN: User management, policy settings, job monitoring, audit logs

**Core Features Identified:**
1. Authentication & Authorization (USER/ADMIN)
2. File Upload (storage only, no auto-processing)
3. File List & Detail Pages
4. OCR Text Extraction (user-triggered)
5. Image Extraction (user-triggered)
6. Text Viewer with search and download
7. Image Gallery/Viewer with download
8. Job Status & History
9. Admin Console (users, policies, jobs, audit logs)

**Technology Requirements:**
- React frontend served by Nginx
- Tailwind CSS + shadcn/ui for consistent UI
- Presigned URL pattern for file access
- No direct binary handling in frontend

---

## Next Steps

### Immediate Actions
1. Launch Explore agent to check for existing codebase structure
2. Identify which pages need to be created
3. Map PRD requirements to page templates (List/Detail/Form/Dashboard)
4. Design component structure for OCR-specific features

### Questions to Resolve
- Does any existing code structure exist?
- What is the target project directory?
- Should this extend the sso-admin-mvp or be a new project?

---

## Plan Status: DRAFT
**Waiting for**: Codebase exploration results
