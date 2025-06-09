import React, { useState, useEffect, useCallback } from 'react';
import { getWorkOrders, getMechanics, getCustomers, updateCommissionStatus } from '../../services/dataService';
import { toast } from 'react-toastify';

const MechanicMonthlyReport = ({ mechanicId, selectedMonth, selectedYear }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mechanicDetails, setMechanicDetails] = useState(null);
  const [processingCommission, setProcessingCommission] = useState(null);

  const generateReport = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all work orders and filter by mechanic and month
      const [workOrders, mechanics, customers] = await Promise.all([
        getWorkOrders(),
        getMechanics(),
        getCustomers()
      ]);

      const mechanic = mechanics.find(m => m.id === mechanicId);
      setMechanicDetails(mechanic);

      if (!mechanic) {
        toast.error('Mechanic not found');
        return;
      }

      // Filter work orders for this mechanic and month
      const mechanicWorkOrders = workOrders.filter(wo => {
        if (wo.mechanicId !== mechanicId) return false;
        
        const woDate = new Date(wo.createdAt);
        return woDate.getMonth() === selectedMonth && woDate.getFullYear() === selectedYear;
      });

      // Generate report data
      const totalJobs = mechanicWorkOrders.length;
      const completedJobs = mechanicWorkOrders.filter(wo => wo.status === 'Completed').length;
      const inProgressJobs = mechanicWorkOrders.filter(wo => wo.status === 'In Progress').length;
      const requestedJobs = mechanicWorkOrders.filter(wo => wo.status === 'Requested').length;

      // Calculate commission data
      const commissionsData = mechanicWorkOrders
        .filter(wo => wo.commission && wo.commission.mechanicId === mechanicId)
        .map(wo => ({
          workOrderId: wo.id,
          customerName: customers.find(c => c.id === wo.customerId)?.name || 'Unknown',
          jobDescription: wo.description,
          commissionAmount: wo.commission.amount,
          isPaid: wo.commission.paid,
          paidDate: wo.commission.paidDate,
          completedDate: wo.completedAt,
          createdDate: wo.createdAt
        }));

      const totalCommissions = commissionsData.reduce((sum, c) => sum + c.commissionAmount, 0);
      const paidCommissions = commissionsData
        .filter(c => c.isPaid)
        .reduce((sum, c) => sum + c.commissionAmount, 0);
      const unpaidCommissions = totalCommissions - paidCommissions;

      // Job completion timeline
      const jobsByWeek = {};
      mechanicWorkOrders.forEach(wo => {
        const weekStart = getWeekStart(new Date(wo.createdAt));
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!jobsByWeek[weekKey]) {
          jobsByWeek[weekKey] = { created: 0, completed: 0, inProgress: 0 };
        }
        
        jobsByWeek[weekKey].created++;
        if (wo.status === 'Completed') jobsByWeek[weekKey].completed++;
        if (wo.status === 'In Progress') jobsByWeek[weekKey].inProgress++;
      });

      setReportData({
        mechanic,
        totalJobs,
        completedJobs,
        inProgressJobs,
        requestedJobs,
        commissionsData,
        totalCommissions,
        paidCommissions,
        unpaidCommissions,
        jobsByWeek,
        completionRate: totalJobs > 0 ? (completedJobs / totalJobs * 100).toFixed(1) : 0,
        mechanicWorkOrders: mechanicWorkOrders.map(wo => ({
          ...wo,
          customerName: customers.find(c => c.id === wo.customerId)?.name || 'Unknown'
        }))
      });    } catch (error) {
      console.error('Error generating mechanic report:', error);
      toast.error('Failed to generate mechanic report');
    } finally {
      setLoading(false);
    }
  }, [mechanicId, selectedMonth, selectedYear]);

  useEffect(() => {
    if (mechanicId && selectedMonth && selectedYear) {
      generateReport();
    }
  }, [mechanicId, selectedMonth, selectedYear, generateReport]);

  const getWeekStart = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const exportReport = () => {
    if (!reportData) return;

    const monthName = getMonthName(selectedMonth);
    const fileName = `${reportData.mechanic.name}_${monthName}_${selectedYear}_Report.csv`;
    
    let csvContent = `Mechanic Monthly Report - ${reportData.mechanic.name}\n`;
    csvContent += `Period: ${monthName} ${selectedYear}\n\n`;
    
    csvContent += `SUMMARY\n`;    csvContent += `Total Jobs,${reportData.totalJobs}\n`;
    csvContent += `Completed Jobs,${reportData.completedJobs}\n`;
    csvContent += `In Progress Jobs,${reportData.inProgressJobs}\n`;
    csvContent += `Requested Jobs,${reportData.requestedJobs}\n`;
    csvContent += `Completion Rate,${reportData.completionRate}%\n`;
    csvContent += `Total Commissions,RM${reportData.totalCommissions.toFixed(2)}\n`;
    csvContent += `Paid Commissions,RM${reportData.paidCommissions.toFixed(2)}\n`;
    csvContent += `Unpaid Commissions,RM${reportData.unpaidCommissions.toFixed(2)}\n\n`;
    
    csvContent += `JOB DETAILS\n`;
    csvContent += `Date,Customer,Job Description,Status,Commission,Paid\n`;
      reportData.mechanicWorkOrders.forEach(wo => {
      const commission = wo.commission ? wo.commission.amount.toFixed(2) : '0.00';
      const paid = wo.commission ? (wo.commission.paid ? 'Yes' : 'No') : 'N/A';
      csvContent += `"${formatDate(wo.createdAt)}","${wo.customerName}","${wo.description}","${wo.status}","RM${commission}","${paid}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };
  const handleToggleCommissionStatus = async (workOrderId, currentStatus) => {
    try {
      setProcessingCommission(workOrderId);
      await updateCommissionStatus(workOrderId, !currentStatus);
      
      // Update local state to reflect the change
      const updatedCommissionsData = reportData.commissionsData.map(commission => {
        if (commission.workOrderId === workOrderId) {
          return {
            ...commission,
            isPaid: !currentStatus,
            paidDate: !currentStatus ? new Date().toISOString() : null
          };
        }
        return commission;
      });
      
      // Also update the work orders data to keep them in sync
      const updatedWorkOrders = reportData.mechanicWorkOrders.map(wo => {
        if (wo.id === workOrderId && wo.commission) {
          return {
            ...wo,
            commission: {
              ...wo.commission,
              paid: !currentStatus,
              paidDate: !currentStatus ? new Date().toISOString() : null
            }
          };
        }
        return wo;
      });
      
      // Recalculate totals
      const totalCommissions = updatedCommissionsData.reduce((sum, c) => sum + c.commissionAmount, 0);
      const paidCommissions = updatedCommissionsData
        .filter(c => c.isPaid)
        .reduce((sum, c) => sum + c.commissionAmount, 0);
      const unpaidCommissions = totalCommissions - paidCommissions;
      
      // Update report data
      setReportData({
        ...reportData,
        commissionsData: updatedCommissionsData,
        mechanicWorkOrders: updatedWorkOrders,
        totalCommissions,
        paidCommissions,
        unpaidCommissions
      });
      
      toast.success(`Commission ${!currentStatus ? 'marked as paid' : 'marked as pending'}`);
    } catch (error) {
      console.error('Error updating commission status:', error);
      toast.error('Failed to update commission status');
    } finally {
      setProcessingCommission(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading monthly report...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        Select a mechanic and month to generate report
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0', color: '#1976d2' }}>
            {mechanicDetails?.name} - {getMonthName(selectedMonth)} {selectedYear}
          </h3>
          <p style={{ margin: '0.5rem 0', color: '#666' }}>
            Specialty: {mechanicDetails?.specialty || 'General'} | Contact: {mechanicDetails?.contact}
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={exportReport}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          📥 Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#1976d2' }}>{reportData.totalJobs}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#27ae60' }}>{reportData.completedJobs}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#f57c00' }}>{reportData.inProgressJobs}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#e74c3c' }}>{reportData.requestedJobs}</div>
          <div className="stat-label">Requested</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#9b59b6' }}>{reportData.completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      {/* Commission Summary */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">💰 Commission Summary</h4>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                RM{reportData.totalCommissions.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Earned</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>
                RM{reportData.paidCommissions.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Paid</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f57c00' }}>
                RM{reportData.unpaidCommissions.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Pending</div>
            </div>
          </div>

          {/* Commission Details */}
          {reportData.commissionsData.length > 0 && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Job Description</th>
                    <th>Commission</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>                  {reportData.commissionsData.map((commission, index) => (
                    <tr key={index}>
                      <td>{formatDate(commission.createdDate)}</td>
                      <td>{commission.customerName}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{commission.jobDescription}</td>
                      <td style={{ fontWeight: 'bold' }}>RM{commission.commissionAmount.toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`status-badge ${commission.isPaid ? 'paid' : 'pending'}`}>
                            {commission.isPaid ? '✅ Paid' : '⏳ Pending'}
                          </span>
                          <button 
                            className={`btn btn-sm ${commission.isPaid ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => handleToggleCommissionStatus(commission.workOrderId, commission.isPaid)}
                            disabled={processingCommission === commission.workOrderId}
                            style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                          >
                            {processingCommission === commission.workOrderId ? '...' : 
                              commission.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Job Timeline */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">📋 Job Timeline</h4>
        </div>
        <div style={{ padding: '1rem' }}>
          {reportData.mechanicWorkOrders.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Job Description</th>
                    <th>Status</th>
                    <th>Commission</th>
                  </tr>
                </thead>
                <tbody>                  {reportData.mechanicWorkOrders.map((wo) => (
                    <tr key={wo.id}>
                      <td>{formatDate(wo.createdAt)}</td>
                      <td>{wo.customerName}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wo.description}</td>
                      <td>
                        <span className={`status ${wo.status.toLowerCase().replace(' ', '-')}`}>{wo.status}</span>
                      </td>
                      <td>{wo.commission ? `RM${wo.commission.amount.toFixed(2)}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No jobs found for this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MechanicMonthlyReport;
