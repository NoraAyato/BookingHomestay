import React, { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import GoogleCallback from "./pages/GoogleCallback";
import { AuthProvider } from "./contexts/AuthContext";
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
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
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
            <Route
              path="/reset-password"
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
