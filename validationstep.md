📦 BYKI LITE SYSTEM CONSOLIDATION BRIEF

🎯 Purpose

This file serves as a validation reference for AI agents and developers working on the current BYKI LITE system to ensure all existing modules are correctly unified. The goal is to create a centralized, non-redundant, and single-flow workshop management system using the current architecture.

🚫 Do not add new features yet.
✅ Focus only on consolidating what exists and eliminating redundancies.

🔧 Goals

Ensure one single invoice flow — no separate invoice systems under sparepart and work order modules.

Centralize customer, parts, and job data — no data duplication.

Unify sparepart stock logic across all operations (purchase, issue, invoice).

**Ensure work order and sparepart modules operate as one ecosystem with linked records.

Preserve structure integrity for Firebase/Firestore.

🧩 Consolidation Actions

1. 🔁 Invoice Redundancy Elimination

✅ Keep: Auto-generated invoice from Work Order Completion.

❌ Remove: Manual invoice generation module in InvoicePage.jsx.

🔗 Route all completed job invoices through workOrders/ → autoInvoice logic.

🔁 Reuse invoice rendering component if necessary, but only one invoice source.

2. 📚 Shared Collections & Data Models

Ensure that the following entities are shared across the system:

Customer

customers/ → Single source of truth

Used in: Work Orders, Invoices, Job History

Mechanic

mechanics/ → Central profile store

Used in: Work Orders only

Spareparts

parts/ → Master list

Used in: Inventory, Purchase Orders, Part Issuing

Suppliers

suppliers/ → Used only for Purchase Orders

Invoices

Stored as sub-documents or references under workOrders/ or accounts/

3. 🔗 Work Order + Inventory Link

✅ Verify: When a part is issued in a work order, the stock is reduced via parts/

✅ Ensure: Part issuing UI writes directly to orderItems/ collection

✅ Auto-assign cost and track profit margin in the job card

4. 📈 Accounts & Sales Management (Read-only for now)

✅ Pull sales data only from completed work orders

❌ Do not calculate revenue from standalone invoices (to be removed)

Future logic can link invoices → accounts/ → daily summaries

📁 Code Refactor Points

✅ Keep Pages:

WorkOrderListPage.jsx

WorkOrderDetailPage.jsx

WorkDashboardPage.jsx

PartsPage.jsx

PurchaseOrderPage.jsx

CustomersPage.jsx

MechanicsPage.jsx

❌ Mark for Refactor or Merge:

InvoicePage.jsx → to be deprecated

Any standalone invoice logic in dataService.js not tied to workOrders/

🔗 Important Relations:

workOrders ↔ customers

workOrders ↔ mechanics

workOrders ↔ parts (via orderItems)

purchaseOrders ↔ parts ↔ suppliers

🧠 Developer Reminders

⚠ All invoice and stock decrement logic should live under workOrders only

✅ Parts used in jobs should always trace back to the part record in parts/

✅ Avoid re-inventing invoice UIs, just use shared components if needed

✅ Completion Checklist



📌 Final Note

Once consolidation is validated, all future modules (like Premium Leads Acquisition) will be built on top of this clean base.

🔒 This is your single source of truth for system structure.

Project: BYKI LITEValidated By: AI Agent, Nexova CTODate: May 28, 2025