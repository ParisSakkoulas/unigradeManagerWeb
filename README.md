# Grade Manager — Frontend

A modern university grade management web application built with Angular, PrimeNG, and Tailwind CSS.

**Live Demo:** [https://iridescent-pony-6e3ad4.netlify.app](https://iridescent-pony-6e3ad4.netlify.app)

---

## Overview

Grade Manager is a full-featured academic platform that allows universities to manage courses, teachings, student declarations, and grading workflows. The system supports four distinct user roles with role-based access control throughout the application.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 17+ | Frontend framework (standalone components) |
| PrimeNG | 17+ | UI component library |
| Tailwind CSS | 3.x | Utility-first styling |
| PrimeIcons | Latest | Icon library |
| TypeScript | 5.x | Type safety |
| RxJS | 7.x | Reactive programming |

---

## Features

### Role-based access

| Role | Capabilities |
|---|---|
| **Admin** | Full access — manage users, courses, teachings, students, instructors |
| **Instructor** | Define grading, enter grades (single & bulk), finalize grades, view statistics |
| **Student** | Declare courses, view grades, view personal statistics |
| **Guest** | Browse courses and teachings (read-only) |

### Core modules

- **Authentication** — Login, registration with admin approval flow, JWT session management
- **Courses** — Full CRUD, prerequisite chains, keyword search
- **Teachings** — State machine workflow (entered → assigned → grading defined → partially graded → fully graded)
- **Declarations** — Course registration with prerequisite validation, finalization lock
- **Grade entry** — Single student entry and bulk CSV import
- **Statistics** — Pass/fail breakdowns per teaching (instructor) and overall progress (student)
- **Admin panel** — User management, pending approval queue, role assignment
- **Profile** — Self-service credential updates for all authenticated users

---

## Project Structure

```
src/
├── environments/
│   ├── environment.ts           # Development config
│   └── environment.prod.ts      # Production config
│
└── app/
    ├── core/                    # Singleton services loaded once
    │   ├── auth/                # Auth service, guards, role enum
    │   ├── interceptors/        # JWT auth + global error handling
    │   └── services/            # Toast notification service
    │
    ├── shared/                  # Reusable across all features
    │   ├── components/          # Button, Input, Modal, Table, Badge, etc.
    │   ├── directives/          # *hasRole structural directive
    │   ├── pipes/               # grade, roleLabel pipes
    │   ├── models/              # TypeScript interfaces (mirror backend DTOs)
    │   └── services/            # Generic ApiService<T> base class
    │
    ├── layout/                  # App shell — sidebar + navbar
    │
    └── features/                # Lazy-loaded feature modules
        ├── auth/                # Login, register
        ├── dashboard/           # Role-aware landing page
        ├── courses/             # List, detail, create/edit form
        ├── teachings/           # List, detail, grading form
        ├── declarations/        # List, grade entry (single + bulk)
        ├── students/            # List, detail, form
        ├── instructors/         # List, detail, form
        ├── statistics/          # Instructor & student stats
        ├── admin/               # User management
        └── profile/             # Self-edit profile
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 17+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd grade-manager/app/client

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (proxies API to localhost:3000)
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

### Production build

```bash
ng build --configuration production
```

Output goes to `dist/front/browser/`

---

## Configuration

### Environment files

**`src/environments/environment.ts`** (development):
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

**`src/environments/environment.prod.ts`** (production):
```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api.onrender.com/api',
};
```

### Proxy (development only)

`proxy.conf.json` forwards all `/api` requests to the NestJS backend:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

## Key Architectural Decisions

### Generic `ApiService<T>`

All feature services extend a generic base class — no raw `HttpClient` calls in components or feature services:

```ts
@Injectable({ providedIn: 'root' })
export class CoursesService extends ApiService<Course> {
  constructor() { super('courses'); }
}
```

### Signal-based auth state

Authentication state uses Angular signals for reactive, fine-grained updates without `BehaviorSubject` boilerplate:

```ts
readonly user  = computed(() => this._state().user);
readonly role  = computed(() => this._state().user?.role ?? Role.GUEST);
```

### `*hasRole` directive

Structural directive for declarative role-based UI rendering:

```html
<app-button *hasRole="[Role.ADMIN]">Delete</app-button>
<div *hasRole="[Role.ADMIN, Role.INSTRUCTOR]; else noAccess">...</div>
```

### Standalone components

All components are standalone — no NgModules. Everything is imported directly where needed and tree-shaken at build time.

---

## Deployment

Deployed on **Netlify** as a static site.

### `netlify.toml`

```toml
[build]
  command = "ng build --configuration production"
  publish = "dist/front/browser"

[[redirects]]
  from = "/*"
  to   = "/index.html"
  status = 200
```

The `[[redirects]]` rule is essential for Angular client-side routing — without it, refreshing any route returns a 404.

---

## Test Accounts

| Role | Login | Password |
|---|---|---|
| Admin | `admin` | `Admin1234!` |
| Instructor | `ppapadopoulos` | `Test1234!` |
| Student | `student_nikos` | `Test1234!` |

> New users must register and wait for admin approval before logging in.

---

## Backend

The REST API is built with NestJS + Mongoose and deployed on Render.

Repository: see `/api` folder in the monorepo.

API base URL: `https://unigrademanagerapi.onrender.com/api`

---

## License

MIT
