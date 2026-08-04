# El-Ma3ras Company ERP System

Enterprise Multi-Branch Inventory, Sales, Purchase, and Financial Management System for El-Ma3ras Clothing Factory.

## 🚀 Architectural Overview

- **Bilingual & Multi-Directional**: Arabic (RTL Default) & English (LTR).
- **Independent Monorepo Architecture**: Clean separation between `frontend/` (React, Vite, i18next, Tailwind) and `backend/` (Express, Prisma ORM, JWT).
- **Multi-Branch & Single-Company**: Shared catalog (Products, Sizes, Customers, Suppliers); Branch-isolated inventory and financial accounting.
- **Factory Product Matrix**: Dynamic size variants (`Size` entity: XS, S, M, L, XL, XXL) mapped to `ProductSize` with granular multi-pricing (`purchasePrice`, `retailPrice`, `wholesalePrice`, `minimumRetailPrice`).
- **Flexible Payments & Invoicing**: Partial payment tracking (`subtotal`, `discount`, `total`, `paidAmount`, `remainingAmount`) with statuses (`PAID`, `PARTIALLY_PAID`, `UNPAID`).
- **Service Products**: Native support for `isService` items with no stock deduction.
- **Stock Transfers & Audit Trail**: Document-driven `StockTransfer` workflow + atomic `StockMovement` ledger.
- **Simplified Authorization**: User model with `ADMIN` (Full System Access) and `EMPLOYEE` (Operational Sales, Returns, View Only) roles.
- **Soft Delete**: Universal `deletedAt` soft-deletion on all primary business records.

---

## 📂 Folder Structure

```text
erp-inventory-system/
├── frontend/
│   ├── public/              # Static frontend assets
│   ├── src/                 # React UI, pages, components, hooks, i18n, services
│   ├── index.html           # HTML entry point
│   ├── package.json         # Independent frontend dependencies & scripts
│   ├── tsconfig.json        # Frontend TypeScript configuration
│   └── vite.config.ts       # Vite bundler configuration
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # PostgreSQL Prisma ORM database schema
│   ├── src/
│   │   ├── app.ts           # Express application initialization & routes
│   │   ├── server.ts        # Standalone backend server entry point
│   │   ├── config/          # Database connection, JWT & Env configurations
│   │   ├── constants/       # Global system constants
│   │   ├── controllers/     # HTTP Controller orchestrators
│   │   ├── middlewares/     # Auth, validation, logging, error handling
│   │   ├── routes/          # Express API routers
│   │   ├── services/        # Business logic and domain service layer
│   │   ├── utils/           # Standardized ApiResponse, Logger, Password hasher
│   │   ├── validators/      # Zod request validation schemas
│   │   └── types/           # Express & JWT TypeScript definitions
│   ├── package.json         # Independent backend dependencies & scripts
│   └── tsconfig.json        # Backend TypeScript configuration
│
├── .editorconfig            # Code editor formatting rules
├── .env.example             # Documented environment variables
├── .gitignore               # Git ignore rules
├── metadata.json            # AI Studio app metadata
├── package.json             # Workspace root manifest & scripts
├── README.md                # Project documentation
├── server.ts                # Workspace Express server + Vite dev orchestrator
├── tsconfig.json            # Root TypeScript configuration
└── vite.config.ts           # Root Vite configuration fallback
```

---

## 📜 Workspace NPM Scripts

- `npm run dev`: Runs the workspace server executing `backend/src/app.ts` with Vite middleware targeting `frontend/`.
- `npm run build`: Bundles the React frontend and esbuild server into `dist/`.
- `npm run start`: Runs the compiled production server.
- `npm run lint`: Runs TypeScript type checks for both `backend` and `frontend`.
- `npm run prisma:generate`: Generates Prisma Client artifacts for the database schema.
- `npm run prisma:migrate`: Applies database migrations.
- `npm run prisma:seed`: Seeds database with default settings, sizes, and admin user.
