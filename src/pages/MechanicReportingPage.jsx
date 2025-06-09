import React, { useState, useEffect } from 'react';
import { getMechanics, getWorkOrders, getUnpaidCommissions } from '../services/dataService';
import MechanicMonthlyReport from '../components/Mechanic/MechanicMonthlyReport';
import { toast } from 'react-toastify';

const MechanicReportingDashboard = () => {
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [mechanicOverview, setMechanicOverview] = useState([]);
  const [unpaidCommissions, setUnpaidCommissions] = useState([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [mechanicsData, workOrders, unpaidCommissionsData] = await Promise.all([
        getMechanics(),
        getWorkOrders(),
        getUnpaidCommissions()
      ]);

      setMechanics(mechanicsData);
      setUnpaidCommissions(unpaidCommissionsData);

      // Generate mechanic overview
      const overview = mechanicsData.map(mechanic => {
        const mechanicJobs = workOrders.filter(wo => wo.mechanicId === mechanic.id);
        const completedJobs = mechanicJobs.filter(wo => wo.status === 'Completed');
        const inProgressJobs = mechanicJobs.filter(wo => wo.status === 'In Progress');
        
        // Calculate current month stats
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthJobs = mechanicJobs.filter(wo => {
          const woDate = new Date(wo.createdAt);
          return woDate.getMonth() === currentMonth && woDate.getFullYear() === currentYear;
        });

        // Calculate commissions
        const allCommissions = mechanicJobs
          .filter(wo => wo.commission && wo.commission.mechanicId === mechanic.id)
          .reduce((sum, wo) => sum + wo.commission.amount, 0);
          
        const unpaidCommissionsTotal = mechanicJobs
          .filter(wo => wo.commission && wo.commission.mechanicId === mechanic.id && !wo.commission.paid)
          .reduce((sum, wo) => sum + wo.commission.amount, 0);

        return {
          id: mechanic.id,
          name: mechanic.name,
          specialty: mechanic.specialty,
          contact: mechanic.contact,
          totalJobs: mechanicJobs.length,
          completedJobs: completedJobs.length,
          inProgressJobs: inProgressJobs.length,
          currentMonthJobs: currentMonthJobs.length,
          completionRate: mechanicJobs.length > 0 ? (completedJobs.length / mechanicJobs.length * 100).toFixed(1) : 0,
          totalCommissions: allCommissions,
          unpaidCommissions: unpaidCommissionsTotal,
          lastActivity: mechanicJobs.length > 0 ? 
            Math.max(...mechanicJobs.map(wo => new Date(wo.createdAt).getTime())) : null
        };
      });

      setMechanicOverview(overview);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load mechanic dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (!selectedMechanic) {
      toast.error('Please select a mechanic');
      return;
    }
    setShowReport(true);
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  const formatLastActivity = (timestamp) => {
    if (!timestamp) return 'No activity';
    const daysAgo = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    return `${daysAgo} days ago`;
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 2; i--) {
      years.push(i);
    }
    return years;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading mechanic reporting dashboard...</div>
      </div>
    );
  }
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mechanic Reporting Dashboard</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowReport(false)}
          style={{ display: showReport ? 'block' : 'none' }}
        >
          Back to Overview
        </button>
      </div>

      {!showReport ? (
        <>
          {/* Monthly Report Generator */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Generate Monthly Report</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="form-group">
                  <label htmlFor="mechanic">Select Mechanic</label>
                  <select
                    id="mechanic"
                    value={selectedMechanic}
                    onChange={(e) => setSelectedMechanic(e.target.value)}
                  >
                    <option value="">Choose a mechanic...</option>
                    {mechanics.map(mechanic => (
                      <option key={mechanic.id} value={mechanic.id}>
                        {mechanic.name} - {mechanic.specialty || 'General'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="month">Month</label>
                  <select
                    id="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{getMonthName(i)}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {getYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button
                    className="btn btn-primary w-full"
                    onClick={generateReport}
                    disabled={!selectedMechanic}
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mechanics Overview */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Mechanics Overview</h3>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialty</th>
                    <th>Total Jobs</th>
                    <th>This Month</th>
                    <th>Completion Rate</th>
                    <th>Total Commissions</th>
                    <th>Unpaid</th>
                    <th>Last Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mechanicOverview.map(mechanic => (
                    <tr key={mechanic.id}>
                      <td className="font-semibold">{mechanic.name}</td>
                      <td>
                        <span className="badge bg-green text-green">
                          {mechanic.specialty || 'General'}
                        </span>
                      </td>
                      <td>{mechanic.totalJobs}</td>
                      <td>{mechanic.currentMonthJobs}</td>
                      <td>
                        <span className={`font-semibold ${
                          mechanic.completionRate >= 80 ? 'text-green-600' : 
                          mechanic.completionRate >= 60 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {mechanic.completionRate}%
                        </span>
                      </td>
                      <td className="font-semibold text-green-600">
                        RM{mechanic.totalCommissions.toFixed(2)}
                      </td>
                      <td className={`font-semibold ${
                        mechanic.unpaidCommissions > 0 ? 'text-green-600' : 'text-gray'
                      }`}>
                        RM{mechanic.unpaidCommissions.toFixed(2)}
                      </td>
                      <td className="text-gray">{formatLastActivity(mechanic.lastActivity)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setSelectedMechanic(mechanic.id);
                            generateReport();
                          }}
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commission Alerts */}
          {unpaidCommissions.length > 0 && (
            <div className="card bg-green-50 border-green-200">
              <div className="card-header">
                <h3 className="card-title text-green-600">
                  Unpaid Commissions Alert
                </h3>
              </div>
              <div className="card-body">                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-green-800 mb-0">
                    {unpaidCommissions.length} mechanic(s) have unpaid commissions totaling RM
                    {unpaidCommissions.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
                  </p>
                </div>
                
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Mechanic</th>
                        <th>Work Order</th>
                        <th>Completed Date</th>
                        <th>Commission Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unpaidCommissions.slice(0, 5).map((commission, index) => (
                        <tr key={index}>
                          <td className="font-semibold">{commission.mechanicName}</td>
                          <td>WO-{commission.workOrderId.slice(-6)}</td>
                          <td>{new Date(commission.completedDate).toLocaleDateString()}</td>
                          <td className="font-semibold text-green-600">
                            RM{commission.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {unpaidCommissions.length > 5 && (
                  <p className="text-center text-gray mt-4">
                    ...and {unpaidCommissions.length - 5} more unpaid commissions
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <MechanicMonthlyReport
          mechanicId={selectedMechanic}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default MechanicReportingDashboard;
