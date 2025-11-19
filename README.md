# Skyforge

Skyforge is a personal monorepo built with Turborepo. It contains my portfolio site, a shared UI component library, and a collection of experimental projects. The goal of this repository is to serve as a living demonstration of my front-end architecture practices, design approach, and the systems I prefer building.

---

## Tech Stack

- Turborepo (monorepo orchestration)
- TypeScript
- React 19
- Next.js (used by portfolio and labs)
- ESLint (shared config across workspaces)

---

## Repository Structure
```
skyforge/
├── apps/
│   ├── portfolio/      # Primary website
│   └── labs/           # Experimental playgrounds and prototypes
└── packages/
    └── ui/             # Shared React component library (@skyforge/ui)
```    



Each workspace is isolated but shares the same TypeScript configuration, linting standards, and React version.

---

## Getting Started

### Install dependencies
```npm install```

### Run dev servers
```npm run dev```
