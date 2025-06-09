import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkOrders, getCustomers, getMechanics, updateWorkOrderStatus } from '../services/dataService';
import { toast } from 'react-toastify';

function WorkOrderListPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [mechanicFilter, setMechanicFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workOrdersData, customersData, mechanicsData] = await Promise.all([
        getWorkOrders(),
        getCustomers(),
        getMechanics()
      ]);
      
      setWorkOrders(workOrdersData);
      setCustomers(customersData);
      setMechanics(mechanicsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getMechanicName = (mechanicId) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    return mechanic ? mechanic.name : 'Unassigned';
  };
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Requested':
        return 'badge bg-gray text-gray';
      case 'In Progress':
        return 'badge bg-green text-green';
      case 'Completed':
        return 'badge bg-green text-green';
      default:
        return 'badge bg-gray text-gray';
    }
  };

  const handleStatusChange = async (workOrderId, newStatus) => {
    try {
      await updateWorkOrderStatus(workOrderId, newStatus);
      toast.success(`Work order status updated to ${newStatus}`);
      loadData(); // Reload to reflect changes
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Requested':
        return 'In Progress';
      case 'In Progress':
        return 'Completed';
      default:
        return null;
    }
  };

  const filteredWorkOrders = workOrders.filter(workOrder => {
    const statusMatch = statusFilter === 'All' || workOrder.status === statusFilter;
    const mechanicMatch = mechanicFilter === 'All' || workOrder.mechanicId === mechanicFilter;
    return statusMatch && mechanicMatch;
  });

  if (loading) {
    return <div className="loading">Loading work orders...</div>;
  }
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Work Orders</h1>
        <Link to="/work-orders/new" className="btn btn-primary">
          New Work Order
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Filters</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="form-group">
              <label htmlFor="statusFilter">Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Requested">Requested</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="mechanicFilter">Mechanic</label>
              <select
                id="mechanicFilter"
                value={mechanicFilter}
                onChange={(e) => setMechanicFilter(e.target.value)}
              >
                <option value="All">All Mechanics</option>
                {mechanics.map(mechanic => (
                  <option key={mechanic.id} value={mechanic.id}>
                    {mechanic.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <span className="text-gray">
                Showing {filteredWorkOrders.length} of {workOrders.length} work orders
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Work Orders ({filteredWorkOrders.length})</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Created</th>
                <th>Customer</th>
                <th>Mechanic</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No work orders found.
                  </td>
                </tr>
              ) : (
                filteredWorkOrders.map((workOrder) => (
                  <tr key={workOrder.id}>
                    <td className="font-semibold">
                      {workOrder.id.startsWith('WO-') ? workOrder.id : `#${workOrder.id.slice(-6)}`}
                    </td>
                    <td>
                      {new Date(workOrder.createdAt).toLocaleDateString()}
                    </td>
                    <td className="font-semibold">{getCustomerName(workOrder.customerId)}</td>
                    <td className="text-gray">{getMechanicName(workOrder.mechanicId)}</td>
                    <td>
                      <div className="max-w-xs truncate">
                        {workOrder.description}
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(workOrder.status)}>
                        {workOrder.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link 
                          to={`/work-orders/${workOrder.id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </Link>
                        {getNextStatus(workOrder.status) && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleStatusChange(workOrder.id, getNextStatus(workOrder.status))}
                          >
                            {getNextStatus(workOrder.status) === 'In Progress' ? 'Start' : 'Complete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WorkOrderListPage;
