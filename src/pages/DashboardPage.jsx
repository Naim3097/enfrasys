import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData, getFilteredInvoices, getRevenueReport, exportRevenueReportCSV, getCustomers, getTodaySchedules, getScheduleMetrics, getWorkDashboardData } from '../services/dataService';
import { toast } from 'react-toastify';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    totalParts: 0,
    lowStockCount: 0,
    lowStockParts: [],
    recentPOs: [],
    recentInvoices: []
  });
  const [loading, setLoading] = useState(true);
    // PHASE 2 ENHANCEMENTS - Schedule Integration
  const [scheduleData, setScheduleData] = useState({
    todaySchedules: [],
    metrics: {
      totalToday: 0,
      completedToday: 0,
      upcomingToday: 0,
      overdueJobs: 0
    }
  });
  
  // Work Order Dashboard Integration
  const [workData, setWorkData] = useState({
    openJobs: 0,
    inProgressJobs: 0,
    completedThisWeek: 0,
    recentWorkOrders: []
  });
  
  // PHASE 1 ENHANCEMENTS - Invoice Filtering & Revenue Reports
  const [showFilters, setShowFilters] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    customer: '',
    source: '',
    minAmount: '',
    maxAmount: ''
  });  const [revenueReport, setRevenueReport] = useState(null);
  const [showRevenueReport, setShowRevenueReport] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadCustomers();
    loadScheduleData();
    loadWorkData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
      setFilteredInvoices(data.recentInvoices);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };  const loadCustomers = async () => {
    try {
      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };
  const loadScheduleData = async () => {
    try {
      const [todaySchedules, metrics] = await Promise.all([
        getTodaySchedules(),
        getScheduleMetrics()
      ]);
      
      setScheduleData({
        todaySchedules,
        metrics
      });
    } catch (error) {
      console.error('Error loading schedule data:', error);
      toast.error('Failed to load schedule data');
    }
  };

  const loadWorkData = async () => {
    try {
      const data = await getWorkDashboardData();
      setWorkData(data);
    } catch (error) {
      console.error('Error loading work dashboard data:', error);
      toast.error('Failed to load work dashboard data');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const filtered = await getFilteredInvoices(filters);
      setFilteredInvoices(filtered);
      toast.success(`Found ${filtered.length} invoices matching filters`);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      customer: '',
      source: '',
      minAmount: '',
      maxAmount: ''
    });
    setFilteredInvoices(dashboardData.recentInvoices);
  };

  const generateRevenueReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error('Please select start and end dates for the revenue report');
      return;
    }

    try {
      setLoading(true);
      const report = await getRevenueReport(filters.startDate, filters.endDate);
      setRevenueReport(report);
      setShowRevenueReport(true);
      toast.success('Revenue report generated successfully');
    } catch (error) {
      console.error('Error generating revenue report:', error);
      toast.error('Failed to generate revenue report');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!revenueReport) {
      toast.error('Please generate a revenue report first');
      return;
    }

    try {
      exportRevenueReportCSV(revenueReport, filters.startDate, filters.endDate);
      toast.success('Revenue report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export revenue report');
    }
  };
  const calculateInvoiceTotal = (invoice) => {
    return invoice.items?.reduce((total, item) => {
      return total + (item.qty * item.price);
  }, 0) || 0;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  return (
    <div className="container">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-majestic text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-cool-gray">Monitor your workshop operations and key metrics</p>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid-4 gap-4 mb-6">
        <Link to="/work-orders/new" className="btn btn-primary">
          New Work Order
        </Link>        <button 
          className="btn btn-secondary" 
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Invoice Filters'}
        </button>        <Link to="/finance" className="btn btn-primary">
          Financial Dashboard
        </Link>
        <Link to="/schedule" className="btn btn-secondary">
          View Calendar
        </Link>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid-2 gap-6">
        {/* Left Column - Metrics and Quick Actions */}
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Key Metrics</h2>
            </div>
            <div className="card-body">              <div className="grid-2 gap-4">
                <div className="metric-card bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.totalParts}</div>
                  <div className="text-cool-gray text-sm">Total Parts</div>
                </div>
                <div className="metric-card bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <div className={`text-2xl font-bold ${dashboardData.lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {dashboardData.lowStockCount}
                  </div>
                  <div className="text-cool-gray text-sm">Low Stock Alerts</div>
                </div>
                <div className="metric-card bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-600">{workData.openJobs}</div>
                  <div className="text-cool-gray text-sm">Open Jobs</div>
                </div>
                <div className="metric-card bg-white p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-600">{workData.inProgressJobs}</div>
                  <div className="text-cool-gray text-sm">In Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          {scheduleData.todaySchedules.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Today's Schedule</h2>
                <span className="badge badge-primary">{scheduleData.todaySchedules.length}</span>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {scheduleData.todaySchedules.slice(0, 4).map((schedule) => (
                    <div key={schedule.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{schedule.customerName}</div>
                        <div className="text-sm text-cool-gray">
                          {new Date(`2024-01-01T${schedule.startTime}`).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit', 
                            hour12: true 
                          })} - {schedule.mechanicName}
                        </div>
                      </div>
                      <span className={`badge ${
                        schedule.status === 'completed' ? 'badge-success' :
                        schedule.status === 'in-progress' ? 'badge-warning' : 'badge-secondary'
                      }`}>
                        {schedule.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
                {scheduleData.todaySchedules.length > 4 && (
                  <Link to="/schedule" className="btn btn-secondary btn-sm mt-3">
                    View All ({scheduleData.todaySchedules.length})
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Low Stock Alerts */}
          {dashboardData.lowStockParts.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Low Stock Alerts</h2>
                <span className="badge badge-warning">{dashboardData.lowStockParts.length}</span>
              </div>
              <div className="card-body">
                <div className="space-y-2">
                  {dashboardData.lowStockParts.slice(0, 5).map((part) => (
                    <div key={part.id} className="flex justify-between items-center p-2 border-l-4 border-red-500 bg-red-50">
                      <div>
                        <div className="font-medium">{part.name}</div>
                        <div className="text-sm text-cool-gray">SKU: {part.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-600 font-bold">{part.currentStock}</div>
                        <div className="text-xs text-cool-gray">in stock</div>
                      </div>
                    </div>
                  ))}
                </div>
                {dashboardData.lowStockParts.length > 5 && (
                  <Link to="/parts" className="btn btn-secondary btn-sm mt-3">
                    View All ({dashboardData.lowStockParts.length})
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Activity Feed */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Activity</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">                {/* Recent Work Orders */}
                {workData.recentWorkOrders.slice(0, 3).map((workOrder) => (
                  <div key={workOrder.id} className="activity-item border-l-4 border-deep-teal pl-4 py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm">Work Order Created</div>
                        <div className="text-sm text-cool-gray line-clamp-2 mt-1">{workOrder.description}</div>
                        <div className="text-xs text-cool-gray-light mt-2">
                          {new Date(workOrder.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`status-compact ${
                        workOrder.status === 'Completed' ? 'completed' :
                        workOrder.status === 'In Progress' ? 'in-progress' : 'requested'
                      }`}>
                        {workOrder.status}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Recent Purchase Orders */}
                {dashboardData.recentPOs.slice(0, 2).map((po) => (
                  <div key={po.id} className="activity-item border-l-4 border-deep-teal pl-4 py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm">Purchase Order</div>
                        <div className="text-sm text-cool-gray mt-1">{po.supplierName}</div>
                        <div className="text-xs text-cool-gray-light mt-2">
                          {new Date(po.date).toLocaleDateString()} • {po.items.length} items
                        </div>
                      </div>
                      <span className="status-compact ordered">Ordered</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/work-orders" className="btn btn-secondary btn-sm mt-4">
                View All Activity
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Today's Summary</h2>
            </div>
            <div className="card-body">
              <div className="grid-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-xl font-bold text-green-600">{scheduleData.metrics.totalToday}</div>
                  <div className="text-sm text-cool-gray">Scheduled Jobs</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-xl font-bold text-green-600">{scheduleData.metrics.completedToday}</div>
                  <div className="text-sm text-cool-gray">Completed</div>
                </div>                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-xl font-bold text-green-600">{workData.completedThisWeek}</div>
                  <div className="text-sm text-cool-gray">This Week</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-xl font-bold text-red-600">{scheduleData.metrics.overdueJobs}</div>
                  <div className="text-sm text-cool-gray">Overdue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Invoices</h2>
              <span className="badge badge-primary">{filteredInvoices.length}</span>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {filteredInvoices.slice(0, 4).map((invoice) => (
                  <div key={invoice.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{invoice.customerName}</div>
                      <div className="text-sm text-cool-gray">
                        {new Date(invoice.date).toLocaleDateString()} • {invoice.items?.length || 0} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-majestic">RM{calculateInvoiceTotal(invoice).toFixed(2)}</div>
                      {invoice.workOrderId && (
                        <div className="text-xs text-cool-gray">WO-{invoice.workOrderId.slice(-6)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {filteredInvoices.length > 4 && (
                <button 
                  className="btn btn-secondary btn-sm mt-3"
                  onClick={() => setShowFilters(true)}
                >
                  View All ({filteredInvoices.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>      {/* Invoice Filters Modal */}
      {showFilters && (
        <div className="modal-overlay" onClick={() => setShowFilters(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Invoice Filters & Revenue Reports</h3>
              <button className="modal-close" onClick={() => setShowFilters(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid-3 gap-4 mb-4">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="customer">Customer</label>
                  <select
                    id="customer"
                    value={filters.customer}
                    onChange={(e) => handleFilterChange('customer', e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Customers</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.name}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="source">Invoice Source</label>
                  <select
                    id="source"
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Sources</option>
                    <option value="work-order">Work Orders</option>
                    <option value="legacy">Legacy Invoices</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="minAmount">Min Amount (RM)</label>
                  <input
                    type="number"
                    id="minAmount"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maxAmount">Max Amount (RM)</label>
                  <input
                    type="number"
                    id="maxAmount"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    placeholder="999.99"
                    step="0.01"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-primary" onClick={applyFilters}>
                  Apply Filters
                </button>
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>                <button className="btn btn-primary" onClick={generateRevenueReport}>
                  Generate Revenue Report
                </button>
                {revenueReport && (
                  <button className="btn btn-secondary" onClick={exportReport}>
                    Export CSV
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}      {/* Revenue Report Modal */}
      {showRevenueReport && revenueReport && (
        <div className="modal-overlay" onClick={() => setShowRevenueReport(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Revenue Report ({filters.startDate} to {filters.endDate})</h3>
              <button className="modal-close" onClick={() => setShowRevenueReport(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid-2 gap-4 mb-6">
                <div className="metric-card bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-600">
                    RM{revenueReport.totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-cool-gray text-sm">Total Revenue</div>
                </div>
                <div className="metric-card bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-600">{revenueReport.totalInvoices}</div>
                  <div className="text-cool-gray text-sm">Total Invoices</div>
                </div>                <div className="metric-card bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-600">{revenueReport.workOrderInvoices}</div>
                  <div className="text-cool-gray text-sm">Work Order Invoices</div>
                </div>
                <div className="metric-card bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-600">RM{revenueReport.averageInvoiceValue.toFixed(2)}</div>
                  <div className="text-cool-gray text-sm">Average Invoice</div>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={exportReport}>
                Export CSV Report
              </button>
            </div>
          </div>        </div>
      )}    </div>
  );
}

export default DashboardPage;
