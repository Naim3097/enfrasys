import React, { useState } from 'react';
import FinancialOverview from '../components/Financial/FinancialOverview';
import ExpenseEntry from '../components/Financial/ExpenseEntry';
import PaymentTracker from '../components/Financial/PaymentTracker';
import InvoiceManagement from '../components/Financial/InvoiceManagement';
import MechanicReportingPage from './MechanicReportingPage';

function FinancePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [financialRefreshKey, setFinancialRefreshKey] = useState(0);

  const tabs = [
    { id: 'dashboard', label: 'Financial Dashboard', component: null },
    { id: 'invoices', label: 'Invoice Management', component: InvoiceManagement },
    { id: 'expenses', label: 'Expense Tracker', component: ExpenseEntry },
    { id: 'payments', label: 'Payment Tracker', component: PaymentTracker },
    { id: 'reports', label: 'Financial Reports', component: MechanicReportingPage }
  ];
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  const renderFinancialDashboard = () => (
    <div className="grid-2 gap-6">
      <FinancialOverview key={financialRefreshKey} />
      <div className="space-y-4">
        <ExpenseEntry onExpenseAdded={() => setFinancialRefreshKey(prev => prev + 1)} />
        <PaymentTracker onPaymentUpdate={() => setFinancialRefreshKey(prev => prev + 1)} />
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* Finance Header */}
      <div className="mb-6">
        <h1 className="text-majestic text-3xl font-bold mb-2">Financial Management</h1>
        <p className="text-cool-gray">Manage finances, track expenses, handle payments, and generate reports</p>
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
      </div>      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'dashboard' ? renderFinancialDashboard() : (
          ActiveComponent && <ActiveComponent />
        )}
      </div>
    </div>
  );
}

export default FinancePage;
