# 1. Introduction

## 1.1 Starter Template

**Decision:** N/A - Greenfield project with custom tech stack

## 1.2 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-16 | 1.0 | Initial Fullstack Architecture Document created from PRD and UI/UX spec | Winston (Architect Agent) |

## 1.3 Introduction

This document outlines the complete fullstack architecture for **OutcomeSignal**, an AI planning platform that guides solo developers and small teams from ideation through production-ready specifications. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

OutcomeSignal combines a **Next.js 14 frontend** with **shadcn/ui Scaled theme**, **Next.js API Routes** (TypeScript) for the backend, **Google Vertex AI Agent Development Kit (ADK)** for AI orchestration, and **Supabase** for database and real-time functionality. The architecture emphasizes:

- **Three-column workspace UI** (hierarchy tree, live document preview, agent chat)
- **AI agent orchestration** with 7 specialized sub-agents using Google ADK
- **Subscription-based SaaS model** with Stripe billing and tier-based limits
- **Document generation workflow** covering 8 planning document types (Brief, PRD, Architecture, UX, Security, QA, Market Research, Competitive Analysis)
- **Responsive design** targeting desktop-first with mobile/tablet adaptation
- **Unified Next.js application** with TypeScript for frontend and backend API

This unified approach streamlines development by using a single language (TypeScript) for the entire application stack, with Python reserved only for separately-deployed Google ADK agents.

---
