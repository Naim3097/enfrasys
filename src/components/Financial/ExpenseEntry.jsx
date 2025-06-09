import React, { useState } from 'react';
import { createExpense } from '../../services/dataService';
import { toast } from 'react-toastify';

const ExpenseEntry = ({ onExpenseAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'parts_purchase', label: 'Parts Purchase' },
    { value: 'rent', label: 'Rent/Utilities' },
    { value: 'supplies', label: 'Workshop Supplies' },
    { value: 'maintenance', label: 'Equipment Maintenance' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      await createExpense(expenseData);
      toast.success('Expense recorded successfully');
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      
      // Notify parent to refresh data
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to record expense');
    } finally {
      setLoading(false);
    }
  };

  const cancelForm = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">💸 Quick Expense Entry</h3>
        {!showForm && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Expense
          </button>
        )}
      </div>
      
      {showForm ? (
        <div style={{ padding: '1rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="amount">Amount *</label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What was this expense for?"
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={cancelForm}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Recording...' : 'Record Expense'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          <p>Track workshop expenses like supplies, utilities, and maintenance.</p>
          <p><small>Parts purchases are automatically tracked through purchase orders.</small></p>
        </div>
      )}
    </div>
  );
};

export default ExpenseEntry;
