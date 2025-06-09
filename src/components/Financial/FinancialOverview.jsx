import React, { useState, useEffect } from 'react';
import { getFinancialOverview } from '../../services/dataService';
import { toast } from 'react-toastify';

const FinancialOverview = () => {
  const [financialData, setFinancialData] = useState({
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    profit: 0,
    unpaidInvoices: 0,
    unpaidCommissions: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      const data = await getFinancialOverview();
      setFinancialData(data);
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast.error('Failed to load financial overview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">💰 Financial Overview</h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading financial data...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">💰 Financial Overview - This Month</h3>
      </div>
      <div style={{ padding: '1rem' }}>
        {/* Money Flow Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>          <div className="stat-card" style={{ backgroundColor: '#e8f5e8' }}>
            <div className="stat-number" style={{ color: '#27ae60', fontSize: '1.5rem' }}>
              💰 RM{financialData.monthlyRevenue.toFixed(2)}
            </div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
          
          <div className="stat-card" style={{ backgroundColor: '#ffe8e8' }}>
            <div className="stat-number" style={{ color: '#e74c3c', fontSize: '1.5rem' }}>
              💸 RM{financialData.monthlyExpenses.toFixed(2)}
            </div>
            <div className="stat-label">Monthly Expenses</div>
          </div>
          
          <div className="stat-card" style={{ 
            backgroundColor: financialData.profit >= 0 ? '#e8f5e8' : '#ffe8e8' 
          }}>
            <div className="stat-number" style={{ 
              color: financialData.profit >= 0 ? '#27ae60' : '#e74c3c',
              fontSize: '1.5rem'
            }}>
              📈 RM{financialData.profit.toFixed(2)}
            </div>
            <div className="stat-label">Profit This Month</div>
          </div>
          
          <div className="stat-card" style={{ backgroundColor: '#fff3cd' }}>
            <div className="stat-number" style={{ color: '#856404', fontSize: '1.5rem' }}>
              👨‍🔧 RM{financialData.unpaidCommissions.toFixed(2)}
            </div>
            <div className="stat-label">Pending Commissions</div>
          </div>
        </div>

        {/* Action Items */}
        {(financialData.unpaidInvoices > 0 || financialData.unpaidCommissions > 0) && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            border: '1px solid #ffeaa7'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#856404' }}>⚠️ Needs Attention</h4>            {financialData.unpaidInvoices > 0 && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Unpaid Invoices:</strong> RM{financialData.unpaidInvoices.toFixed(2)}
              </div>
            )}
            {financialData.unpaidCommissions > 0 && (
              <div>
                <strong>Unpaid Commissions:</strong> RM{financialData.unpaidCommissions.toFixed(2)}
              </div>
            )}
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Recent Financial Activity</h4>
          {financialData.recentActivity.length > 0 ? (
            <div style={{ 
              border: '1px solid #dee2e6', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              {financialData.recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '0.75rem 1rem',
                    borderBottom: index < financialData.recentActivity.length - 1 ? '1px solid #dee2e6' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ marginRight: '0.5rem' }}>{activity.icon}</span>
                    <span>{activity.description}</span>
                  </div>                  <div style={{ 
                    fontWeight: 'bold',
                    color: activity.type === 'income' ? '#27ae60' : '#e74c3c'
                  }}>
                    {activity.type === 'income' ? '+' : '-'}RM{activity.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No recent financial activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
