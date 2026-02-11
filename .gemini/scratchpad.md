# Subscription Tracker Project

## Background and Motivation

Nicco wants a web application (Vite + React) to track his various subscriptions (chatbots, streaming, etc.). The goal is to have a clear overview of recurring costs and active services, with a "vibecoding" approach where he doesn't read the code.

## Project Status Board

### Core Features

- [x] Project setup (Vite + React + Tailwind)
- [x] Basic UI Layout (Header, List, Footer)
- [x] Add Subscription (Modal)
- [x] List Subscriptions (Card View)
- [x] Delete Subscription
- [x] **Edit Subscription** (added feature)
- [x] **Category Management** (Standard list + Custom input)

### Data & Logic

- [x] LocalStorage persistence
- [x] Total Monthly Cost calculation
- [x] **Date Handling**
  - [x] Custom `DD/MM/YYYY` format enforcement
  - [x] Hybrid DatePicker (Text + Calendar)
  - [x] Optional "Next Renewal" date (for one-offs)
  - [x] Expiration Date logic

### UI/UX

- [x] "System" Aesthetic (Mono fonts, strict borders, technical feel)
- [x] Responsive Design

## Current Status

Project is functional and deployed.
Recently completed:

- Restored Calendar Picker.
- Made "Initial Renewal" optional.
- Fixed Category duplication bug.
- Enforced European date format.

## Lessons

- **Date Inputs**: Browser `<input type="date">` is hard to style and forces locale formats. A hybrid approach (Text Input + Hidden Date Picker) works best for strict formatting + usability.
- **Component Reuse**: `AddSubscriptionModal` handles both Create and Edit modes efficiently.
- **Deployment**: Always check `vite.config.ts` `base` path matches the repo name for GitHub Pages.

## Executor's Feedback

The application is stable. Ready for new feature requests or further UI refinements.
