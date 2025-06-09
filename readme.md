# Sparepart Management System — Quickstart Brief

## 1. Core Goals
1. **Directory** of parts & suppliers  
2. **Purchase Orders** → bring stock in  
3. **Invoices** → move stock out  
4. **Stock Count** → manual reconciliation  
5. **Simple Dashboard** → current stock snapshot  

## 2. Tech Stack & Environment
- **Frontend:** React (or plain JS/HTML) in VS Code  
- **Backend:** Node.js Cloud Functions  
- **Database:** Firebase Firestore  
- **Auth:** Firebase Authentication (email/password)  
- **Hosting & Deploy:** Firebase Hosting + CLI  

> **Tip:** In VS Code install “Firebase Tools”, “ESLint” and “Prettier” extensions. Keep `firebase.json` & `.firebaserc` at the repo root.

## 3. Collections & Data Model
```txt
parts         { id, name, sku, unitPrice, currentStock }
suppliers     { id, name, contact, address }
purchaseOrders{ id, supplierId, date, items:[{ partId, qty, cost }] }
invoices      { id, customerName, date, items:[{ partId, qty, price }] }
stockCounts   { id, date, items:[{ partId, countedQty }] }
No audit or analytics collections—just core data.

4. Page List & Purpose
LoginPage

Email/password login

DashboardPage

Cards: Total parts, low-stock alerts, recent POs/invoices

PartsPage

Table of parts + inline “Adjust Stock”

SuppliersPage

CRUD list of suppliers

PurchaseOrderPage

Create PO → batched write increments stock

List past POs

InvoicePage

Create invoice → batched write decrements stock

List past invoices

StockCountPage

Manual count sheet → overwrite currentStock

5. UI/UX & Logic
Layout: Single-column, form-driven pages

Actions:

PO/Invoice → wrap record write + stock update in one batch

Feedback: Toast on success or error

Styling hints:

Highlight low-stock rows in amber tint when currentStock < 5

Keep forms simple—no analytics charts or extra metrics

Access: All pages behind login—no role split initially

6. Minimal File Structure
bash
Copy
Edit
/src
  /pages
    LoginPage.jsx
    DashboardPage.jsx
    PartsPage.jsx
    SuppliersPage.jsx
    PurchaseOrderPage.jsx
    InvoicePage.jsx
    StockCountPage.jsx
  /services
    dataService.js      ← Firestore calls: getParts(), createPO(), createInvoice(), updateStock(), etc.
  /config
    firebaseConfig.js
/functions
  index.js             ← Optional Cloud Functions
firebase.json
7. Next Steps
Scaffold React (or static) app in VS Code

Initialize Firebase SDK & Auth in firebaseConfig.js

Build dataService.js with:

getParts()

createPurchaseOrder()

createInvoice()

updateStock()

submitStockCount()

Create each page’s form/table UI

Test batched writes & reads in the Firestore emulator

Deploy to Firebase Hosting — you’re live!

This brief is your single source of truth. Focus on these core features first; polish and extend later.