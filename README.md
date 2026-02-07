# Home Tools

A personal home server management application for monitoring and controlling various services from a unified dashboard.

## Features

- **Application Management**: Start, stop, and monitor desktop applications
  - **Kodi**: Media center control
  - **Deluge**: BitTorrent client control
- **Real-time Status**: Auto-polling dashboard with live status updates
- **Dark Theme UI**: Modern, blueish dark theme with Angular Material

## Tech Stack

- **Frontend**: Angular 21, TypeScript, RxJS, Angular Material
- **Backend**: NestJS, TypeScript
- **Monorepo**: Nx workspace with Rspack bundler
- **Styling**: SCSS with Angular Material theming

## Project Structure

```
home-tools/
├── apps/
│   ├── web/                    # Angular frontend
│   │   └── src/app/features/
│   │       └── dashboard/      # Dashboard feature module
│   └── api/                    # NestJS backend
│       └── src/app/
│           ├── apps/           # Application management
│           │   ├── deluge/     # Deluge controller & service
│           │   └── kodi/       # Kodi controller & service
│           └── health/         # Health check endpoint
├── libs/
│   └── shared-api/             # Shared backend utilities (ShellService)
├── nx.json
└── package.json
```

## API Endpoints

### Deluge
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps/deluge/status` | Get Deluge running status |
| POST | `/api/apps/deluge/start` | Start Deluge |
| POST | `/api/apps/deluge/stop` | Stop Deluge |

### Kodi
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps/kodi/status` | Get Kodi running status |
| POST | `/api/apps/kodi/start` | Start Kodi |
| POST | `/api/apps/kodi/stop` | Stop Kodi |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn

### Installation

```bash
yarn install
```

### Development

```bash
# Start both frontend and backend
nx serve web
nx serve api

# Or run both in parallel
nx run-many -t serve --projects=web,api
```

The frontend runs on `http://localhost:4200` and proxies API requests to `http://localhost:3000`.

### Build

```bash
# Build all projects
nx run-many -t build

# Build individual projects
nx build web
nx build api
```

### Lint

```bash
nx run-many -t lint
```

## Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```
