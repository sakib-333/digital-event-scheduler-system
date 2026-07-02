# Digital Event Scheduler System

A modern web application for managing university events, venue scheduling, approvals, attendance, and administrative workflows. The system is built with React, TypeScript, Vite, TanStack Router, Tailwind CSS, Firebase, Supabase, and EmailJS.

## Overview

Digital Event Scheduler System helps institutions coordinate academic and campus events from a single interface. It supports public landing pages, authenticated dashboards, event creation, event management, calendar views, analytics, user management, notifications, and contact form email delivery.

## Features

- Public home page with hero, feature, about, FAQ, and contact sections
- Authentication-aware routing with protected dashboard areas
- Event creation, editing, deleting, listing, and detail views
- Event detail actions for joining and leaving events
- Admin event management and approval workflows
- Calendar-based event visualization
- Analytics dashboard with charts and summaries
- User role management
- Notification provider and notification dialog
- Language translation(English and Bangla)
- Theme support with light and dark modes
- Contact form powered by React Hook Form and EmailJS
- Toast notifications through Sonner/shadcn UI

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn UI components
- TanStack Router
- Zustand
- Firebase
- Supabase
- React Hook Form
- React Big Calendar
- Recharts
- EmailJS

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and provide the required service credentials.

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

# Cloudinary
VITE_CLOUD_NAME=
VITE_UPLOAD_PRESET=

# EmailJS
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Do not commit real production credentials to source control.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  api/                 Data access and service functions
  assets/              Static assets
  components/          Shared UI and feature components
  components/home/     Public landing page sections
  components/ui/       shadcn UI primitives
  context/             React context providers
  layouts/             Application layouts
  routes/              TanStack Router routes
  stores/              Zustand state stores
  types/               Shared TypeScript types
  utils/               Utility helpers
```

## Key Routes

- `/` - Public home page
- `/signin` - Sign in
- `/signup` - Sign up
- `/dashboard` - Authenticated dashboard
- `/events` - Event listing
- `/event/create-event` - Create event
- `/event/manage-events` - Manage events
- `/event/$eventId` - View event details, join or leave an event, and delete an event as the owner
- `/calendar` - Calendar view
- `/analytics` - Analytics view
- `/manage-users` - User management
- `/settings` - User settings

## Email Delivery

The contact form uses EmailJS with browser-safe public credentials from Vite environment variables. The form submits:

- First name
- Last name
- University email
- Message

Successful and failed submissions are surfaced with Sonner toast notifications.

## Notes

- The app uses Vite environment variables, so all client-exposed values must be prefixed with `VITE_`.
- Run `npm run build` before deployment to verify TypeScript and production bundling.
- Generated router files should stay in sync with route changes.

