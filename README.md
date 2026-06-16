# Ascendra Workspaces Dashboard

A high-density, performant, and modern cloud workspace management dashboard designed for **Ascendra Networks**. 

This application addresses two distinct user roles with fundamentally opposing mindsets:
* **Engineers/Developers:** Running and monitoring their daily workspaces. Noise is a distraction; immediate access is key.
* **DevOps/DevEx Admins:** Managing aggregate infrastructure efficiency, template structures, and cloud costs.

Built with **React**, **Next.js (App Router with Turbopack)**, **Tailwind CSS**, and **TypeScript**.

---

## Getting Started

### Prerequisites
* **Node.js**: `v18.x` or higher
* **Package Manager**: `npm` or `pnpm` installed on your system

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ascendra-workspaces



2. **Install dependencies:**
   If you are running on an Apple Silicon Mac (M1/M2/M3/M4) or specific Linux configurations and encounter package or native platform binding warnings (such as `lightningcss` installation anomalies), run with the optional/force parameters:
```bash
npm install --force

```


> ℹ️ **Note:** Native binary architecture mismatches are handled gracefully within the config profiles.


3. **Run the local development server:**
```bash
npm run dev

```


This launches the application using Next.js Turbopack.
4. **Open the interface:**
   Navigate to [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the application in your browser.

---

## 🧠 Part A — Product Thinking & UX Architecture

The core of this assignment is to translate ambiguous infrastructure demands into highly readable, lightning-fast dashboard layers tailored to specific user personas.

To support ease of review, a **Persona Switcher** is embedded in the main global layout. This allows seamless transitions between the two views while maintaining distinct routing, UI design languages, and layout separations.

### 1. Information Architecture & Decoupled Routing

* **Developer View (`/developer`)**
* **My Machines Dashboard:** Focused workspace grid cards highlighting live state gauges (*running*, *stopped*, *starting*, *stopping*), resource utilization bars (CPU, Memory, Disk), and one-click IDE connectivity.
* **VM Detail Drilldown (`/developer/[id]`)** Micro-telemetry graphs reflecting consumption timelines and host image specifications.


* **Admin View (`/admin`)**
* **Fleet Console:** Aggregate summaries focusing on infrastructure scale, current active engineers, total hourly run-rate, projected monthly expenditures, and utilization line graphs.
* **VM Inventory Table:** A searchable and filterable database view showing ownership, region, templates, and active consumption. It automatically flags underutilized machines.
* **Templates Panel:** Standard management system containing VM blueprint configurations (vCPU, RAM, Disk, Base Images) with form creation capabilities.



### 2. Design Philosophy & High-Density UX Decisions

* **Visual Separation:** The Admin dashboard adopts a deep technical slate theme (`bg-zinc-950`) prioritizing data density (similar to Datadog or AWS CloudWatch). The Developer environment utilizes a cleaner, light-slated canvas to reduce cognitive fatigue during standard engineering work.
* **Dynamic Transition States:** Clicking life-cycle triggers (like *Start* or *Stop*) does not merely swap text labels. They initiate active, animated transitional phases (*starting*, *stopping*) with pulsing UI controls to mimic actual hardware startup sequences.
* **Proactive Resource Optimization:** The Admin Inventory view dynamically computes and isolates sub-utilized VMs. If a machine's active CPU usage sits under 5% while its status remains running, the UI displays an intuitive yellow alert card, signaling potential wasted cloud budget.

---

##  Technical Trade-offs & Engineering Compromises

To fit the recommended 4–6 hour scope budget, critical decisions were made to prioritize system fidelity and high-fidelity UX over excessive database setup:

* **Simulated Network Pipeline over Hardcoded Data:** Storing hardcoded arrays inside local React components makes testing loading/empty states impossible. Instead, a highly structured asynchronous API wrapper (`mockApi.ts`) was engineered to implement a simulated network lag (600ms delay).
* **Asynchronous State Lifecycle Engines:** To demonstrate reactive UI lifecycle changes, the mock client acts as a state-machine simulator. When an update request is dispatched (e.g., `startVM`), an asynchronous timer runs in the background. After 4 seconds, it automatically transitions the target state from *starting* to *running*. This confirms the frontend handles realistic infrastructure lag cleanly without needing a Dockerized backend.
* **In-Memory Volatile Storage:** State updates persist during the active browser session, but reset on a full hard reload. While setting up local storage state synchronization or SQLite-lite wrappers would maintain persistence, prioritizing dynamic state transitions and styling within the UX viewport was deemed more beneficial to the assignment's evaluative score.

---

## Future Engineering Roadmap

If allotted additional execution scope, the following feature pipelines would be prioritized:

1. **Real-time Push Channels (SSE / WebSockets):** Swap the mock timeout triggers for active client polling or a simulated Server-Sent Events (SSE) stream to drive live, ticking utilization telemetry updates directly into the Recharts timeline canvas.
2. **Quota & Autostop Policy Engine:** Implement an active administrative modal where DevOps leads can define automation rules (e.g., auto-suspending any workspace with low utilization for over 30 minutes, or capping standard users to 2 concurrent VMs).
3. **Omni-Search & Global Command Center (`Cmd + K`):** Add a keyboard-driven administrative command panel allowing power users to query VMs by user, run template transitions, or jump across views in milliseconds.
4. **Automated Testing Matrix:** Establish integration tests using Vitest and React Testing Library to explicitly verify state machines across complex edge scenarios (such as clicking lifecycle buttons while a VM is currently transitioning).
