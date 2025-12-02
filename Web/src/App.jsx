import React, { Suspense } from "react";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/common/ProtectedRoute";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import BookingPage from "./pages/booking";
import PaymentPage from "./pages/booking/payment";
import PaymentConfirmation from "./pages/booking/confirmation";
import NewsDetailPage from "./pages/news/NewsDetail";
import AboutUsPage from "./pages/aboutus";
import HomestayIndex from "./pages/homestay";
import HomestayDetail from "./pages/homestay/detail";
import MessengerButton from "./components/chat/MessengerButton";
import AIChatButton from "./components/chat/AIChatButton";

// Lazy load admin pages
const Dashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminHomestays = React.lazy(() => import("./pages/admin/Homestays"));
const AdminBookings = React.lazy(() => import("./pages/admin/Bookings"));
const AdminUsers = React.lazy(() => import("./pages/admin/Users"));
const AdminLocations = React.lazy(() => import("./pages/admin/Locations"));
const AdminPromotions = React.lazy(() => import("./pages/admin/Promotions"));
const AdminNews = React.lazy(() => import("./pages/admin/News"));
const AdminReviews = React.lazy(() => import("./pages/admin/Reviews"));
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));
const AdminActivityLogs = React.lazy(() =>
  import("./pages/admin/ActivityLogs")
);
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// Lazy load host pages
const HostDashboard = React.lazy(() => import("./pages/host/Dashboard"));
const HostHomestays = React.lazy(() => import("./pages/host/Homestays"));
const HostBookings = React.lazy(() => import("./pages/host/Bookings"));
const HostPromotions = React.lazy(() => import("./pages/host/Promotions"));
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
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/Admin") ||
      location.pathname.startsWith("/host") ||
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

            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/confirm"
              element={
                <ProtectedRoute>
                  <PaymentConfirmation />
                </ProtectedRoute>
              }
            />
            {/* News Routes */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />

            {/* About Us Route */}
            <Route path="/aboutus" element={<AboutUsPage />} />

            {/* Homestay Routes */}
            <Route path="/homestay" element={<HomestayIndex />} />
            <Route path="/homestay/detail/:id" element={<HomestayDetail />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="/admin/homestays"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminHomestays />
                </Suspense>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminBookings />
                </Suspense>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminUsers />
                </Suspense>
              }
            />
            <Route
              path="/admin/locations"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminLocations />
                </Suspense>
              }
            />
            <Route
              path="/admin/promotions"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminPromotions />
                </Suspense>
              }
            />
            <Route
              path="/admin/news"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminNews />
                </Suspense>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminReviews />
                </Suspense>
              }
            />
            <Route
              path="/admin/activity-logs"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminActivityLogs />
                </Suspense>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminSettings />
                </Suspense>
              }
            />

            {/* Host Routes */}
            <Route
              path="/host"
              element={<Navigate to="/host/dashboard" replace />}
            />
            <Route
              path="/host/dashboard"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HostDashboard />
                </Suspense>
              }
            />
            <Route
              path="/host/homestays"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HostHomestays />
                </Suspense>
              }
            />
            <Route
              path="/host/bookings"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HostBookings />
                </Suspense>
              }
            />
            <Route
              path="/host/promotions"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HostPromotions />
                </Suspense>
              }
            />
          </Routes>
        </div>
        {!hideLayout && <Footer />}
        {!hideLayout && <MessengerButton />}
        {!hideLayout && <AIChatButton />}
      </div>
    );
  }
}

export default App;
