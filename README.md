# Ascendra Workspaces Dashboard

An enterprise-grade, high-density cloud workspace management console built with **React**, **Next.js (App Router)**, **Tailwind CSS**, and **TypeScript**. 

This repository serves as a professional take-home assignment showcase, delivering two distinct operational portals (Developer and Administrator) backed by a real-time reactive VM lifecycle simulation engine.

---

## SECTION 1: Getting Started & Installation Instructions

### Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18.x or higher recommended)
* **npm** (v9.x or higher)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd test-project
   ```

2. **Install Project Dependencies**
   Install the Node modules using standard `npm`:
   ```bash
   npm install
   ```

3. **Start the Development Server**
   Spin up the hot-reloading Next.js dev server powered by Next.js Turbopack:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the portal.

4. **Verify Production Build**
   To check type integrity and run static page optimizations, run the production build:
   ```bash
   npm run build
   ```

---

### macOS Native Architecture Troubleshooting Note
When running local development on Mac environments, Node CPU architecture mismatches (e.g., executing Intel Node binaries on Apple Silicon M-series chips) can occasionally cause dependency build flags or `lightningcss` native binary issues (`EBADPLATFORM` error). 

If you encounter a native binary error regarding `lightningcss.darwin-arm64.node`, execute these recovery steps:

1. **Force download both platform architectures to bypass platform checks:**
   ```bash
   npm install --force -D lightningcss-darwin-arm64 lightningcss-darwin-x64
   ```

2. **Copy the binary directly to the required sub-dependency path:**
   ```bash
   cp node_modules/lightningcss-darwin-arm64/lightningcss.darwin-arm64.node node_modules/lightningcss/ && cp node_modules/lightningcss-darwin-x64/lightningcss.darwin-x64.node node_modules/lightningcss/
   ```

3. Clean your local caches (`rm -rf .next`) and restart your dev server with `npm run dev`.

---

## SECTION 2: Part A — Product Thinking & Architectural Decisions

### Requirement Interpretation: Balancing Dual Personas
The assignment calls for two distinct user personas operating within the same system boundaries, requiring two entirely different UX models:

* **The Developer View (Workspace Cockpit):** Designed as a personal focus cockpit. Developers require clean, low-stress aesthetics with high-fidelity visual representations of their active workstations. The interface employs a warm, high-contrast Light Indigo theme (`bg-zinc-50`) to emphasize local environment management.
* **The Admin Fleet View (Command Center):** Tailored as an operational hub. DevOps administrators require high-density telemetry, aggregate resource status overviews, alerts, and template configurations. The UI adapts instantly to a dark DevOps theme (`bg-zinc-950`), conveying a command-center feeling suitable for infrastructure managers.

A prominent, global persona toggle sits in the top header, allowing evaluators to switch seamlessly between themes and portfolios instantly.

### Information Architecture & Decoupling
To achieve scalability, we implemented a clean structural segregation of routes and components:

```text
src/
├── app/
│   ├── page.tsx               # Root Gate (Persona Selector Dashboard)
│   ├── developer/
│   │   ├── layout.tsx         # Developer Scaffolding (Light Theme, Quota Widget)
│   │   ├── page.tsx           # Workspaces Grid List
│   │   └── [id]/page.tsx      # VM Telemetry & SVG Sparklines (Drill-down)
│   └── admin/
│       ├── layout.tsx         # Admin Command Scaffolding (Dark Theme, Fleet capacity)
│       ├── page.tsx           # Fleet Overview Dashboard & Alert Panel
│       ├── inventory/page.tsx # Searchable Dense Inventory Data Grid
│       └── templates/page.tsx # Sizing Profiles CRUD & Modal Form
```

This structural separation ensures that views never leak styles or layouts. A global `WorkspaceProvider` (`src/context/WorkspaceContext.tsx`) manages the active persona state and subscribes to mock database updates, keeping data completely synchronized as you navigate between tabs.

### UX Decisions for High-Density DevOps Tools
1. **High-Density Data Grids:** In line with standard DevOps tools (like AWS CloudWatch, Vercel, and Grafana), we avoided padding-heavy layouts. Text sizes are tight (`text-xs`), tables are compact, and resources are represented in clean bar grids and line paths.
2. **Transition Engine (VM Lifecycle):** Clicking "Start", "Stop", or "Restart" updates the state to transitioning (`starting`/`stopping`) in the UI immediately with spinning loaders and disabled state blocks. Background timers simulate VM initialization before automatically settling into final states.
3. **Proactive Resource Alerting:** To help admins control waste, the system flags anomalies:
   * **Underutilized Nodes (IDLE):** Running instances drawing $< 5\%$ CPU are marked with warning badges to encourage shutoff.
   * **Overloaded Nodes (HOT):** Instances drawing $> 90\%$ CPU are highlighted with danger badges for performance review.

---

## SECTION 3: Technical Trade-offs & Future Scope

### Technical Trade-offs Made
Given the **4-6 hour scope budget**, priorities were strictly managed:

* **Prioritized Reactive Client State Over Persistent Database:** We focused heavily on building a robust, reactive, in-memory client state framework. A pub-sub API subscription system (`mockApi.ts`) was implemented with artificial network latency injection (`setTimeout` and `Promise`) rather than spending critical time establishing database adapters.
* **SVG-based Visualizations:** Instead of importing heavy external charting packages (like `Recharts` or `Chart.js`) which regularly experience dependency conflicts on React 19 / Next.js 15+ environments, we hand-crafted custom, fully responsive SVG area charts (`MetricChart.tsx`). These are 100% stable, dependency-free, and load instantly with smooth path gradients and hover markers.
* **Component-driven UI Kit:** Rather than utilizing bulky UI library templates, we implemented minimalist, tailwind-wrapped UI components (`Button`, `Card`, `Badge`, `Table`, `Select`) in `src/components/ui/` resembling shadcn-style blocks, ensuring full customizability.

### Future Roadmap
With additional time, the following features would be implemented:

1. **Real-time Stream Telemetry:** Replace simulated latency with active WebSockets or Server-Sent Events (SSE) to feed live metric ticks down to the custom SVG sparklines.
2. **Infrastructure Automation Policies:** Implement functional rules (e.g., auto-terminate workspaces that remain idle for over 4 hours, or auto-scale template cores based on CPU warnings).
3. **Universal Command Menu (`Cmd + K`):** Integrate a central command palette (using `cmdk`) allowing developers and admins to search VMs, switch views, or stop instances instantly via keyboard shortcuts.
4. **Automated Testing Suite:** Introduce Vitest and React Testing Library tests to systematically assert the asynchronous VM lifecycle transition states (`stopped` $\rightarrow$ `starting` $\rightarrow$ `running`) and ensure no regressions affect billing cost calculations.
