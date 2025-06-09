# Work-Order Management — Project Brief

## 1. Purpose & Goals  
Extend the Sparepart Management System with a lightweight Work-Order Management module that lets One X technicians:
- Create and track gearbox jobs end-to-end  
- Associate each job with a customer profile and assigned mechanic  
- Link issued parts (from inventory) directly to the job  
- Progress jobs through statuses (“Requested” → “In Progress” → “Completed”)  
- Auto-draft invoices when jobs complete  

## 2. Data Model & Collections  
Reusing the same Firebase project and `dataService.js`, add:

```txt
customers      { id, name, phone, vehicleDetails, notes }
mechanics      { id, name, contact, specialty }
workOrders     { 
  id, 
  customerId, 
  mechanicId, 
  createdAt, 
  status,        // "Requested" | "In Progress" | "Completed"
  description 
}
orderItems     { 
  id, 
  workOrderId, 
  partId, 
  qty, 
  issuedAt 
}
customers: Master customer directory

mechanics: Technician directory

workOrders: Job tickets with status

orderItems: Parts issued per job (batched with stock decrement)

3. Pages & Interfaces
Place under /src/pages/ alongside existing pages:

CustomersPage.jsx

List, add, edit customer profiles (name, phone, vehicle)

MechanicsPage.jsx

CRUD list of mechanics and their specialties

WorkOrderListPage.jsx

Table of all jobs, filter by status or mechanic

Action buttons: “New Job,” “View,” “Advance Status”

WorkOrderDetailPage.jsx

Header: Job info (customer, mechanic, createdAt, status)

Section: Description & notes

Section: “Issue Parts” widget → select part + qty → batched write

Buttons: “Start Job,” “Complete Job,” which update status

Auto-draft Invoice link when status is set to “Completed”

OrderItemsPage.jsx (embedded in detail page)

List of parts issued with timestamp

WorkDashboardPage.jsx

Summary cards: Open jobs, In-Progress, Completed this week

Quick-action: “New Job”

4. Core Logic & Workflows
4.1 Create Job
User fills “New Job” form → calls createWorkOrder({ customerId, mechanicId, description })

Firestore write to workOrders with status="Requested" & createdAt=serverTimestamp()

4.2 Issue Parts
From WorkOrderDetailPage, select part and qty → calls issuePartToOrder(orderId, partId, qty)

In dataService.js:

Run a batched write:

Add a document to orderItems

Decrement inventory.currentStock

4.3 Status Transitions
Start Job: update workOrders.status = "In Progress"

Complete Job:

update workOrders.status = "Completed"

call draftInvoiceForJob(orderId) which:

Reads issued parts → creates an invoices doc

(Optionally) decrements any remaining parts or adds labor line

5. UI/UX & Styling Notes
Keep existing layout: sidebar + content area

Use the same Majestic Blue / White / Amber palette

Follow form and table patterns from PurchaseOrderPage & InvoicePage

Status badges:

“Requested” → gray

“In Progress” → blue

“Completed” → amber

6. File Structure Updates
bash
Copy
Edit
/src
  /pages
    CustomersPage.jsx
    MechanicsPage.jsx
    WorkDashboardPage.jsx
    WorkOrderListPage.jsx
    WorkOrderDetailPage.jsx
  /services
    dataService.js       // add: createWorkOrder, issueOrderItem, updateWorkOrderStatus, draftInvoiceForJob
  /config
    firebaseConfig.js
7. Next Steps & Milestones
Schema & Rules: Add security rules for new collections

DataService: Implement CRUD & batch functions

Pages: Scaffold UI and wire up forms/tables

Test Workflows: Create job → issue parts → complete → auto-draft invoice

Deploy & Validate: Roll out in emulator → pilot with One X technicians

This brief reuses your existing patterns—minimal new collections, shared services, familiar UI—to deliver robust Work-Order functionality without over-engineering.