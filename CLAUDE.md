# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Home Tools is a personal server management application for managing various tools and services hosted on a home server (e.g., web servers, Kodi, Docker containers, etc.). The application provides a unified dashboard to monitor, configure, and control these services.

## Tech Stack

- **Frontend**: Angular 21 (standalone components), TypeScript 5.9, RxJS, Angular Material
- **Backend**: NestJS (to be added)
- **Monorepo**: Nx workspace with Rspack bundler
- **Build**: Nx CLI, Yarn
- **Styling**: SCSS with Angular Material theming

## Project Structure

```
home-tools/
├── apps/
│   ├── web/              # Angular frontend application
│   └── api/              # NestJS backend (to be added)
├── libs/                 # Shared libraries (to be added)
├── nx.json               # Nx configuration
└── package.json
```

## Common Commands

```bash
yarn install              # Install dependencies
nx serve web              # Dev server for Angular app
nx build web              # Production build for Angular app
nx serve api              # Dev server for NestJS API (when added)
nx build api              # Production build for NestJS API (when added)
nx lint web               # Lint the web app
nx run-many -t build      # Build all projects
nx run-many -t lint       # Lint all projects
```

## Architecture

### Frontend (Angular)

The Angular frontend uses signal-based state management:

```typescript
// Signal state mutations
this.state.update((s) => ({ ...s, loading: false }));

// Component props using input()/output()
readonly service = input.required<ServiceInfo>();
readonly statusChanged = output<ServiceStatus>();
```

### Backend (NestJS)

The NestJS backend will provide REST APIs for:
- Service discovery and status monitoring
- Service control (start/stop/restart)
- Configuration management
- Docker container management
- System health metrics

## Code Style

- Prettier configured for formatting
- TypeScript strict mode enabled
- Angular: Standalone components only (no NgModules)
- Angular: Use `inject()` for dependency injection
- Angular: Use Signal Forms, not Reactive Forms or HTML forms
- NestJS: Follow standard module/controller/service pattern
- Naming convention: `.<file-type>` suffix (e.g., `service.model.ts`, `dashboard.component.ts`, `docker.service.ts`)
- Always use the frontend-design skill for creating/updating frontend UI

## TypeScript Standards

### Strict Mode Enforcement

1. **Never use `any`** - Use `unknown` when the type is truly unknown:
   ```typescript
   // ❌ Bad
   function parseData(data: any): void { }

   // ✅ Good
   function parseData(data: unknown): void {
     if (typeof data === 'string') {
       // Type narrowing
     }
   }
   ```

2. **Explicit Function/Method Typing** - All parameters and return types must be declared:
   ```typescript
   // ❌ Bad
   function getVideoUrl(id) {
     return `/api/videos/${id}`;
   }

   // ✅ Good
   function getVideoUrl(id: string): string {
     return `/api/videos/${id}`;
   }
   ```

3. **Explicit Variable Declarations** - Variables receiving values from functions/props must have explicit types:
   ```typescript
   // ❌ Bad
   const url = getVideoUrl('123');
   const { data } = response;

   // ✅ Good
   const url: string = getVideoUrl('123');
   const { data }: SomeResponse = response;
   ```

4. **Prefer Named Types** - Use explicit typings instead of inline object types:
   ```typescript
   // ❌ Bad
   function getVideoUrl(id: string): { url: string } {
     return { url: `/api/videos/${id}` };
   }

   // ✅ Good
   interface GetVideoUrlResponse {
     url: string;
   }
   function getVideoUrl(id: string): GetVideoUrlResponse {
     return { url: `/api/videos/${id}` };
   }
   ```

## Angular Component Architecture

### Component Size and Responsibility
- Keep components small and focused on a single responsibility
- Split large components into smaller, reusable pieces
- Aim for components under 200 lines of code

### Smart-Dumb Component Pattern

**Dumb Components (Presentational):**
- Handle UI rendering and UI-specific logic only
- Manage internal UI state via signals (e.g., dropdown open/closed)
- Handle UI events (click, change)
- **Not allowed**: Direct injection of data services, business logic, data fetching

**Smart Components (Container):**
- Inject services and manage data fetching
- Coordinate between multiple dumb components
- Handle business logic and state management

### Minimize Custom CSS
- Leverage Angular Material built-in components and theming
- Use component-scoped styles via `:host` and encapsulated SCSS
- Only create custom SCSS for:
  - Custom animations
  - Complex layouts not covered by Flexbox/Grid
  - Specific design requirements not covered by Angular Material
