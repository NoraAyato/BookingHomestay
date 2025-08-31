import React, { Suspense } from "react";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/common/ProtectedRoute";
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
import { AuthPopupProvider } from "./contexts/AuthPopupProvider";
import UserPage from "./pages/user";
import NewsPage from "./pages/news";
import NewsDetailPage from "./pages/news/NewsDetail";
import AboutUsPage from "./pages/aboutus";
import HomestayIndex from "./pages/homestay";
import HomestayDetail from "./pages/homestay/detail";

const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthPopupProvider>
          <AppContent />
        </AuthPopupProvider>
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

            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  {" "}
                  <UserPage />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/booking-history"
              element={
                <ProtectedRoute>
                  {" "}
                  <UserPage />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/promotions"
              element={
                <ProtectedRoute>
                  {" "}
                  <UserPage />{" "}
                </ProtectedRoute>
              }
            />

            {/* News Routes */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />

            {/* About Us Route */}
            <Route path="/aboutus" element={<AboutUsPage />} />

            {/* Homestay Routes */}
            <Route path="/homestay/index" element={<HomestayIndex />} />
            <Route path="/homestay/detail/:id" element={<HomestayDetail />} />
          </Routes>
        </div>
        {!hideLayout && <Footer />}
      </div>
    );
  }
}

export default App;
