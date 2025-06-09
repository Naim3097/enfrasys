import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomerWorkOrderHistory } from '../services/dataService';
import { toast } from 'react-toastify';
import InvoiceDisplay from '../components/InvoiceDisplay';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleDetails: '',
    notes: ''
  });
  
  // PHASE 1 ENHANCEMENT - Customer Visit History
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' or 'history'

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerHistory = async (customer) => {
    try {
      setHistoryLoading(true);
      setSelectedCustomer(customer);
      const history = await getCustomerWorkOrderHistory(customer.id);
      setCustomerHistory(history);
      setActiveTab('history');
    } catch (error) {
      console.error('Error loading customer history:', error);
      toast.error('Failed to load customer history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const calculateInvoiceTotal = (invoice) => {
    return invoice.items?.reduce((total, item) => {
      return total + (item.qty * item.price);
    }, 0) || 0;
  };

  const calculateWorkOrderTotal = (workOrder) => {
    return workOrder.invoices?.reduce((total, invoice) => {
      return total + calculateInvoiceTotal(invoice);
    }, 0) || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(formData);
        toast.success('Customer created successfully');
      }

      setFormData({ name: '', phone: '', vehicleDetails: '', notes: '' });
      setShowForm(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error('Failed to save customer');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      vehicleDetails: customer.vehicleDetails || '',
      notes: customer.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        toast.success('Customer deleted successfully');
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Failed to delete customer');
      }
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', phone: '', vehicleDetails: '', notes: '' });
    setShowForm(false);
    setEditingCustomer(null);
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="page">      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <div className="flex gap-2">
          <button 
            className={`btn ${activeTab === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
          {selectedCustomer && (
            <button 
              className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('history')}
            >
              {selectedCustomer.name} History
            </button>
          )}
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(true)}
          >
            Add Customer
          </button>
        </div>
      </div>

      {/* PHASE 1 - Customer Visit History Tab */}
      {activeTab === 'history' && selectedCustomer && (
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-header">
              <h3 className="card-title">Customer Information</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Name:</strong> {selectedCustomer.name}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedCustomer.phone}
                </div>
                <div>
                  <strong>Vehicle:</strong> {selectedCustomer.vehicleDetails || 'Not specified'}
                </div>
              </div>
              {selectedCustomer.notes && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Notes:</strong> {selectedCustomer.notes}
                </div>
              )}
            </div>
          </div>

          {historyLoading ? (
            <div className="loading">Loading customer history...</div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Visit History ({customerHistory.length} visits)</h3>
              </div>
              {customerHistory.length > 0 ? (
                <div style={{ padding: '1rem' }}>
                  {customerHistory.map((workOrder, index) => (
                    <div key={workOrder.id} className="card" style={{ marginBottom: '1rem', border: '1px solid #ddd' }}>
                      <div className="card-header" style={{ backgroundColor: '#f8f9fa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4>Work Order #{workOrder.id.slice(-6)}</h4>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span className={`badge ${workOrder.status === 'completed' ? 'badge-success' : 
                              workOrder.status === 'in-progress' ? 'badge-warning' : 'badge-secondary'}`}>
                              {workOrder.status}
                            </span>
                            <span>{new Date(workOrder.dateCreated).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ padding: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Service Type:</strong> {workOrder.serviceType || 'General Service'}
                        </div>
                        
                        {workOrder.description && (
                          <div style={{ marginBottom: '1rem' }}>
                            <strong>Description:</strong> {workOrder.description}
                          </div>
                        )}

                        {workOrder.mechanic && (
                          <div style={{ marginBottom: '1rem' }}>
                            <strong>Mechanic:</strong> {workOrder.mechanic}
                          </div>
                        )}

                        {workOrder.partsIssued && workOrder.partsIssued.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <strong>Parts Used:</strong>
                            <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                              {workOrder.partsIssued.map((part, idx) => (
                                <li key={idx}>
                                  {part.partName || part.partId} - Qty: {part.quantityIssued}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {workOrder.invoices && workOrder.invoices.length > 0 && (
                          <div style={{ marginTop: '1rem' }}>
                            <h5>Invoices ({workOrder.invoices.length})</h5>
                            {workOrder.invoices.map((invoice, invoiceIdx) => (
                              <div key={invoice.id} style={{ marginBottom: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                                <InvoiceDisplay 
                                  invoice={invoice} 
                                  isReadOnly={true}
                                  showPrintButton={true}
                                />
                              </div>
                            ))}
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                              <strong>Total Work Order Value: ${calculateWorkOrderTotal(workOrder).toFixed(2)}</strong>
                            </div>
                          </div>
                        )}

                        {workOrder.status === 'completed' && workOrder.dateCompleted && (
                          <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                            <strong>Completed:</strong> {new Date(workOrder.dateCompleted).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Customer Summary */}
                  <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="card-header">
                      <h4>Customer Summary</h4>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <strong>Total Visits:</strong> {customerHistory.length}
                        </div>
                        <div>
                          <strong>Completed Jobs:</strong> {customerHistory.filter(wo => wo.status === 'completed').length}
                        </div>
                        <div>
                          <strong>Total Spent:</strong> ${customerHistory.reduce((total, wo) => total + calculateWorkOrderTotal(wo), 0).toFixed(2)}
                        </div>
                        <div>
                          <strong>Latest Visit:</strong> {customerHistory.length > 0 ? new Date(customerHistory[0].dateCreated).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ padding: '1rem' }}>No work order history found for this customer.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Customer List Tab (existing content) */}
      {activeTab === 'customers' && (
        <div>          {showForm && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cancelForm()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </h3>
                  <button 
                    className="modal-close"
                    onClick={cancelForm}
                    type="button"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="name">Customer Name *</label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="vehicleDetails">Vehicle Details</label>
                      <input
                        type="text"
                        id="vehicleDetails"
                        value={formData.vehicleDetails}
                        onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                        placeholder="e.g., 2020 Honda Civic, VIN: 1234567890"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows="3"
                        placeholder="Additional customer notes..."
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingCustomer ? 'Update Customer' : 'Create Customer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Customers Directory</h3>
              <div className="card-subtitle">{customers.length} customers</div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Vehicle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-gray">
                        No customers found. Click "Add Customer" to create your first customer.
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="font-semibold">{customer.name}</td>
                        <td>{customer.phone}</td>
                        <td className="text-gray">{customer.vehicleDetails || 'Not specified'}</td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-secondary" 
                              onClick={() => loadCustomerHistory(customer)}
                            >
                              History
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary" 
                              onClick={() => handleEdit(customer)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleDelete(customer.id)}
                            >
                              Delete
                            </button>
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
      )}
    </div>
  );
}

export default CustomersPage;
