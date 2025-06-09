# BYKI LITE — UI/UX Sweep & Fix Brief

## 1. Goals & Constraints  
- **Enhance clarity** and declutter the existing 14-page SPA without touching any business logic  
- **Group related pages** under four top-level modules: Dashboard, Inventory, Workshop, Finance  
- **Minimize page jumps** by using modals or slide-outs for detail/edit forms  
- **Introduce lightweight CSS utilities** for consistent spacing, typography and boxes  
- **Enforce approved palette** (Majestic Blue, White, Cool Gray, Accent Amber) and remove all emojis

---

## 2. Global Layout  

┌─────────────────────────────────────────────────────────┐
│ Top Bar: Logo | Current Section Title | User Menu (avatar) │
├───────────────┬─────────────────────────────────────────┤
│ Side Nav │ Main Content Area │
│ (collapsible) │ │
│ – Dashboard │ │
│ – Inventory │ │
│ • Suppliers │ │
│ • Parts │ │
│ • POs │ │
│ • Stock │ │
│ – Workshop │ │
│ • Orders │ │
│ • Calendar │ │
│ – Finance │ │
│ • Overview │ │
│ • Expenses │ │
│ │
└─────────────────────────────────────────────────────────┘

css
Copy
Edit

- **Side Nav** uses icons + labels, collapsible to icons only.  
- **Breadcrumb bar** immediately below Top Bar for drill-down context.  
- **Back/Forward buttons** in Top Bar for detail drill-in/out.

---

## 3. Section Summaries  

### A. Dashboard  
- **Two-column grid**:  
  - Left: Metric cards (Total Parts, Low Stock, Open Jobs, Outstanding Invoices)  
  - Right: Activity feed (recent POs, new work orders, stock adjustments)  
- **Quick Actions**: 3–4 card buttons (“New Job”, “Count Stock”, “Create PO”)  
- **Light, white background**, cards with subtle shadow, accent header stripe

### B. Inventory  
- **Tab strip** at top: Suppliers | Parts | Purchase Orders | Stock Counts  
- **Unified header**: “+ New” button opens modal, search/filter input  
- **Table rows** with hover highlight, amber tint for low-stock parts  
- **Detail & edit** in modal overlay (no full page load)

### C. Workshop  
- **Tab strip**: Work Orders | Calendar  
- **Work Orders List**: table [ID, Customer, Mechanic, Status, Date, Actions]  
- **Detail slide-out** (from right) when “View”: tabs for Details, Parts Issued, Invoice  
  - Inline “Issue Part” mini-form under Parts  
  - “Generate Invoice” button on Invoice tab  

### D. Finance  
- **Tab strip**: Revenue | Expenses | P&L Snapshot  
- **Revenue Tab**: bar chart (12-month), table of invoices with status badges  
- **Expenses Tab**: table + “Add Expense” modal  
- **P&L Snapshot**: card row showing Total Rev, Total Exp, Net Profit  

---

## 4. CSS Utility Guidelines  
Create `/src/styles/utils.css` and import globally:

```css
/* Layout & Containers */
.container    { max-width:1200px; margin:0 auto; padding:0 16px; }
.grid-2       { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.flex-space   { display:flex; justify-content:space-between; }

/* Spacing */
.mt-16        { margin-top:16px; }
.mb-16        { margin-bottom:16px; }
.p-16         { padding:16px; }

/* Cards & Boxes */
.card         { background:#FFFFFF; border-radius:6px; box-shadow:0 1px 4px rgba(0,0,0,0.1); padding:16px; }

/* Typography */
h1            { font-size:2rem; color:#1F3A93; }
h2            { font-size:1.5rem; color:#2E3A59; }
p             { font-size:1rem; line-height:1.5; color:#2E3A59; }

/* Buttons */
.btn-primary  { background:#1F3A93; color:#FFF; padding:8px 16px; border-radius:4px; }
.btn-secondary{ background:transparent; border:1px solid #1F3A93; color:#1F3A93; }
5. Interaction & Accessibility
Keyboard focus states on all inputs, buttons and nav links

ARIA labels on modals, slide-outs, and dynamic components

Contrast checks: text vs background ≥ WCAG AA

6. Next Steps
Mockups: Sketch each section and modal/slide-out interaction

Implement utils.css and refactor key containers & cards

Convert full-page forms (PO, Stock Count, Expense) into modals

Add breadcrumbs and back/forward controls in Top Bar

User validation: Conduct quick sessions with an admin user to verify clarity

This brief respects your existing pages and code—only the presentation layer changes to a cleaner, more modular UI/UX.