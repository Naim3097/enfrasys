import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/utils.css';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import WorkshopPage from './pages/WorkshopPage';
import FinancePage from './pages/FinancePage';
// Keep individual pages for direct access
import PartsPage from './pages/PartsPage';
import SuppliersPage from './pages/SuppliersPage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import StockCountPage from './pages/StockCountPage';
import CustomersPage from './pages/CustomersPage';
import MechanicsPage from './pages/MechanicsPage';
import MechanicReportingPage from './pages/MechanicReportingPage';
import WorkOrderListPage from './pages/WorkOrderListPage';
import WorkOrderDetailPage from './pages/WorkOrderDetailPage';
import WorkOrderNewPage from './pages/WorkOrderNewPage';
import ScheduleCalendarPage from './pages/ScheduleCalendarPage';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              {/* Main Module Routes */}
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="workshop" element={<WorkshopPage />} />
              <Route path="finance" element={<FinancePage />} />
              
              {/* Individual Component Routes (for direct access and legacy support) */}
              <Route path="parts" element={<PartsPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="purchase-orders" element={<PurchaseOrderPage />} />
              <Route path="stock-count" element={<StockCountPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="mechanics" element={<MechanicsPage />} />
              <Route path="mechanic-reports" element={<MechanicReportingPage />} />
              <Route path="work-orders" element={<WorkOrderListPage />} />
              <Route path="work-orders/new" element={<WorkOrderNewPage />} />
              <Route path="work-orders/:id" element={<WorkOrderDetailPage />} />
              <Route path="schedule" element={<ScheduleCalendarPage />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
