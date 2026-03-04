# Mwenaro Ecosystem

Welcome to the **Mwenaro** monorepo—Africa's premier digital ecosystem for talent development, innovation, and digital solutions.

This repository hosts a suite of interconnected platforms built with Next.js, Tailwind CSS (v4), and Supabase, designed to scale and provide a premium "Elite Tech" experience.

## 🏗️ Monorepo Structure

```bash
mwenaro-tech-academy/
├── academy/    # Core Learning Management System
├── hub/        # Main Ecosystem Portal & Landing Page
├── talent/     # Digital Talent Marketplace & Spotlight
├── labs/       # Innovation R&D & Digital Solutions Hub
├── packages/
│   ├── ui/     # Shared Design System & Premium Components
│   └── database/ # Shared Supabase Client & Data Layer
└── package.json # Root Workspace Configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 20+ (using npm workspaces)
- **Supabase Account**: For database and authentication

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mwenaro/mwenaro-tech-hub.git
   cd mwenaro-tech-hub
   ```

2. Install dependencies (from the root):
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.local.example` to `.env.local` and fill in your Supabase and App URL credentials.

### Development

Run all applications concurrently:
```bash
npm run dev
```

Or run specific applications:
```bash
npm run dev:academy  # Port 3001
npm run dev:hub      # Port 3002
npm run dev:talent   # Port 3003
npm run dev:labs     # Port 3004
```

## 🎨 Design System

All apps share a premium **Tailwind CSS v4** design system located in `packages/ui`. We use:
- **Glassmorphism**: Modern, translucent UI elements.
- **Elite Typography**: Clean, modern sans-serif fonts.
- **Dynamic Gradients**: Performance-themed color palettes.

## 🌐 Ecosystem Links

- **Academy**: [academy.mwenaro.tech](https://academy.mwenaro.tech)
- **Hub**: [mwenarotech.com](https://mwenarotech.com)
- **Talent**: [talent.mwenaro.tech](https://talent.mwenaro.tech)
- **Labs**: [labs.mwenaro.tech](https://labs.mwenaro.tech)

---

Built with ❤️ by the **Mwenaro Team**.
