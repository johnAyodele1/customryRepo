# Customry - Bespoke Luxury E-Commerce & Catalogue Platform

Customry is a production-ready, feature-based full-stack e-commerce platform crafted for luxury personalized jewelry, journals, thermal flasks, gift boxes, and timepieces.

---

## 1. Monorepo Architecture

The repository is organized as an npm workspace monorepo:

```
customry/
├── packages/
│   └── contracts/               # Shared Zod schemas & derived TypeScript types
├── apps/
│   ├── api/                     # Node.js + Express + Mongoose + Zod Backend
│   │   ├── src/
│   │   │   ├── config/          # Zod env validation, MongoMemoryServer DB
│   │   │   ├── shared/          # AppError, response formatters, middleware
│   │   │   ├── modules/         # Feature-based domain modules
│   │   │   │   ├── auth/        # Admin & Staff authentication, JWT access/refresh
│   │   │   │   ├── categories/  # Controlled 5 catalogue categories
│   │   │   │   ├── products/    # Product CRUD, variants, customization rules
│   │   │   │   ├── inventory/   # Atomic stock tracking & adjustments
│   │   │   │   ├── carts/       # Server-side price & customization validation
│   │   │   │   ├── orders/      # Price calculations, immutable snapshots, state machine
│   │   │   │   ├── payments/    # Paystack, Flutterwave, Bank Transfer & idempotent webhooks
│   │   │   │   ├── notifications/# Email & WhatsApp abstractions
│   │   │   │   ├── admin/       # Dashboard analytics service & endpoints
│   │   │   │   └── customers/   # Customer records & lifetime value stats
│   │   │   └── scripts/         # Database seeding script
│   └── web/                     # React + TypeScript + Vite + Tailwind CSS Storefront & Admin
│       ├── src/
│       │   ├── components/      # Storefront Layout (Navbar, Hero, Footer)
│       │   ├── features/        # Feature components (Cart, Checkout, Tracking, Admin)
│       │   └── pages/           # Storefront & Admin views
```

---

## 2. Shared Contracts & Independent Hosting

`@customry/contracts` defines all API boundaries with **Zod** and exports inferred TypeScript types.

### Deployment on Separate Hosting Platforms (e.g. Vercel for Web, Render/Railway for API)
- When building (`npm run build`), `packages/contracts` compiles first via TypeScript (`tsc`), generating standard JavaScript (`dist/index.js`) and type declarations (`dist/index.d.ts`).
- When `apps/web` and `apps/api` are deployed to separate cloud hosts, `npm run build` bundles `@customry/contracts`, ensuring full type safety and runtime validation across distinct hosting environments.

---

## 3. Order & Payment Lifecycle

- **Server-Side Pricing**: Prices and discounts are calculated strictly on the backend. Client-provided prices are never trusted.
- **Historical Order Snapshots**: When an order is placed, an immutable snapshot of product names, variant names, options, customization values, and unit prices is stored with the order. Subsequent changes or deletions of products will not affect historical order data.
- **Order State Machine**:
  `PENDING_PAYMENT` -> `PAID` -> `CONFIRMED` -> `PROCESSING` -> `READY_FOR_DELIVERY` -> `COMPLETED` / `CANCELLED`
- **Idempotent Webhooks**: Payment webhooks check payment reference idempotency, preventing duplicate stock decrements or state transitions.

---

## 4. Getting Started

### Installation
```bash
npm install
```

### Build All Workspaces
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Seed Database
Populates admin user, 5 core categories, products with variants and customization fields, stock levels, and sample orders:
```bash
npm run seed
```

**Default Admin Credentials**:
- **Email**: `admin@customry.com`
- **Password**: `admin123`

### Development Servers
- **Backend API**: `npm run dev:api` (runs Express on `http://localhost:5000`)
- **Frontend Storefront**: `npm run dev:web` (runs Vite on `http://localhost:3000`)

---

## 5. Design System Tokens

Customry uses a luxury editorial aesthetic defined by:
- **Primary Accent**: `#745a27` (Gold)
- **Primary Container**: `#c9a96e` (Warm Gold)
- **Surface**: `#fcf9f8` (Warm Off-white)
- **Deep Surface**: `#1b1c1c` (Obsidian Black)
- **Headings Font**: `Playfair Display`
- **Body Font**: `DM Sans`
