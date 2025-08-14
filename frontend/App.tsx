import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { MainLayout } from './components/layout/MainLayout';
import { QuickActionsPage } from './pages/QuickActionsPage';
import { AccountPage } from './pages/AccountPage';
import { BudgetPage } from './pages/BudgetPage';
import { StudentLoansPage } from './pages/StudentLoansPage';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { TopBanner } from "./components/TopBanner";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { connected } = useWallet();
  if (!connected) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { connected } = useWallet();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={!connected ? <LandingPage /> : <Navigate to="/home" replace />} />
        
        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <TopBanner />
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="quick-actions" element={<QuickActionsPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="loans" element={<StudentLoansPage />} />
        </Route>

        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to={connected ? "/home" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
