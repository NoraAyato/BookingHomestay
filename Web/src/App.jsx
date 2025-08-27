import React, { Suspense } from "react";
import LoadingSpinner from "./components/common/LoadingSpinner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/home";
import GoogleCallback from "./pages/auth/GoogleCallback";
import { AuthProvider } from "./contexts/AuthContext";
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );

  function AppContent() {
    const location = useLocation();
    const hideLayout =
      location.pathname.startsWith("/Admin") ||
      location.pathname.startsWith("/Host");
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
        {!hideLayout && <Navbar />}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/google-callback" element={<GoogleCallback />} />
            <Route
              path="/auth/reset-password"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ResetPassword />
                </Suspense>
              }
            />
          </Routes>
        </div>
        {!hideLayout && <Footer />}
      </div>
    );
  }
}

export default App;
