Here is the updated **Next Phases Project Brief** to extend BYKI LITE *without damaging existing features*, continuing from the current production-ready state.

---

# 🚀 BYKI LITE — NEXT PHASES PROJECT BRIEF (POST-CONSOLIDATION)

## 🧭 Objective

Expand the BYKI LITE platform **intelligently**, **modularly**, and **non-destructively** by building new features on top of the now-stable foundation. All additions will **respect the existing architecture**, maintain the **single source of truth**, and focus on **enhancing workflow and visibility** for workshop teams.

---

## ✅ Guiding Principle

> “Build *on top* of what works — not *around* it.”

All new features must:

* ✅ Reuse existing collections and UI components where possible
* ✅ Avoid redundant data handling
* ✅ Follow the current user journey and data flow structure
* ✅ Use `InvoiceDisplay`, `WorkOrderDetailPage`, and `DashboardPage` as primary extension points

---

## 🔄 Phase-Based Feature Roadmap

### 🔹 PHASE 1 — Completion Polishing (UX / Reporting Layer) ✅ COMPLETED

#### 🧩 Feature Set:

* [x] **Printable Invoice Format** (A4-friendly, branded)
* [x] **Daily/Monthly Revenue Report Export** (`CSV`/PDF)
* [x] **Invoice Filtering in DashboardPage** (by date/status/customer)
* [x] **Customer Visit History Tab** in `CustomersPage`

#### 🔐 Notes:

* ✅ Uses existing `invoices` and `workOrders` data
* ✅ No changes to dataService structure — only enhanced UI consumption
* ✅ Export and print functions are optional buttons (non-destructive)

#### 📅 **Completed:** May 28, 2025

---

### 🔹 PHASE 2 — Smart Job Scheduling (Calendar Integration)

#### 🧩 Feature Set:

* [ ] **Job Calendar View** (Daily, Weekly)
* [ ] **Mechanic Scheduling Logic** (based on availability & workload)
* [ ] **Booking Slot Management** (30-min blocks, visualized)

#### 🔐 Notes:

* Create a lightweight `schedules/` collection (or extend `workOrders`)
* No disruption to `workOrders` workflow — this adds planning context only

---

### 🔹 PHASE 3 — Job Photo & Notes Uploads

#### 🧩 Feature Set:

* [ ] Upload before/after photos per work order
* [ ] Rich text repair notes
* [ ] View media in `WorkOrderDetailPage`

#### 🔐 Notes:

* Firebase Storage integration
* Link files via `workOrders/:id/media: []`
* Keep image uploads optional — does not block existing flow

---

### 🔹 PHASE 4 — Role-Based Permissions (User Types)

#### 🧩 Feature Set:

* [ ] Admin (full access)
* [ ] Mechanic (assigned jobs only)
* [ ] Clerk (can view invoices, create WOs, but not issue parts)

#### 🔐 Notes:

* Use Firebase Auth `customClaims`
* Role checks via React context
* Avoid hard-routing logic — use graceful access-denied notices

---

### 🔹 PHASE 5 — Customer Notification System (Optional)

#### 🧩 Feature Set:

* [ ] WhatsApp reminder integration (via Twilio or link-style)
* [ ] Email or PDF summary sent on job completion
* [ ] Service reminder trigger (based on date or mileage)

#### 🔐 Notes:

* Adds value to customer management, but is *not required* for core ops
* Use `workOrders/:id/notifications` subcollection if needed

---

## 🧱 System Protection Plan (Non-Destructive)

* 🔒 **All deprecated files remain untouched** (e.g., `InvoicePage.deprecated.jsx`)
* ✅ Only extend `dataService.js` — no overwriting
* ✅ Use props and conditional rendering to expand UI
* 🚫 No new top-level routes unless approved in planning
* ✅ Use Firebase rules to restrict write access if permissions phase is applied

---

## 📚 Reference Components to Reuse

* ✅ `InvoiceDisplay`
* ✅ `WorkOrderDetailPage`
* ✅ `DashboardPage` (for new cards)
* ✅ `CustomersPage` (add tabs or sections)

---

## 🗂️ Suggested New Collections (If Needed)

```js
schedules/: {
  workOrderId,
  mechanicId,
  date,
  slot
}

notifications/: {
  customerId,
  workOrderId,
  type, // 'reminder' | 'summary'
  status, // 'pending' | 'sent'
  sentAt
}
```

---

## 📅 Development Timeline Suggestion

| Phase                           | Est. Time | Priority   |
| ------------------------------- | --------- | ---------- |
| Phase 1 – Reporting & UX Polish | 3–5 days  | ⭐ High     |
| Phase 2 – Scheduling View       | 5–7 days  | ⭐⭐ Medium  |
| Phase 3 – Media Upload          | 4–6 days  | ⭐⭐ Medium  |
| Phase 4 – Roles & Access        | 3–4 days  | ⭐ Medium   |
| Phase 5 – Customer Notifier     | 3–5 days  | ⭐ Optional |

---

## ✅ Approval Checklist Before Building

* [ ] Confirm no overwrite of existing invoice/workOrder logic
* [ ] Keep deprecated features disabled but untouched
* [ ] Track new features via Git branches or comments
* [ ] Run validator tests on all modified modules before merge

---

## 📌 Final Notes

> BYKI LITE is now a trusted foundation. Every new feature should feel *native*, not *added on*. The technician’s workflow always comes first.

Let me know if you want this split into separate dev tickets or converted into project boards (e.g. Trello, Notion, GitHub).
