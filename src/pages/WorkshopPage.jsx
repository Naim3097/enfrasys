import React, { useState } from 'react';
import WorkOrderListPage from './WorkOrderListPage';
import ScheduleCalendarPage from './ScheduleCalendarPage';
import CustomersPage from './CustomersPage';
import MechanicsPage from './MechanicsPage';

function WorkshopPage() {
  const [activeTab, setActiveTab] = useState('work-orders');

  const tabs = [
    { id: 'work-orders', label: 'Work Orders', component: WorkOrderListPage },
    { id: 'customers', label: 'Customers', component: CustomersPage },
    { id: 'mechanics', label: 'Mechanics', component: MechanicsPage },
    { id: 'schedule', label: 'Calendar', component: ScheduleCalendarPage }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="container">      {/* Workshop Header */}
      <div className="mb-6">
        <h1 className="text-majestic text-3xl font-bold mb-2">Workshop Operations</h1>
        <p className="text-cool-gray">Manage work orders, customers, mechanics, and scheduling</p>
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

export default WorkshopPage;
