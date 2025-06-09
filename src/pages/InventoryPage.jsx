import React, { useState } from 'react';
import PartsPage from './PartsPage';
import SuppliersPage from './SuppliersPage';
import PurchaseOrderPage from './PurchaseOrderPage';
import StockCountPage from './StockCountPage';

function InventoryPage() {
  const [activeTab, setActiveTab] = useState('parts');

  const tabs = [
    { id: 'parts', label: 'Parts', component: PartsPage },
    { id: 'suppliers', label: 'Suppliers', component: SuppliersPage },
    { id: 'purchase-orders', label: 'Purchase Orders', component: PurchaseOrderPage },
    { id: 'stock', label: 'Stock Count', component: StockCountPage }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="container">
      {/* Inventory Header */}
      <div className="mb-6">
        <h1 className="text-majestic text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-cool-gray">Manage parts, suppliers, purchase orders, and stock levels</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation mb-6">
        <div className="tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default InventoryPage;
