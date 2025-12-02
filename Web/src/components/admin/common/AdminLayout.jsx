import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Building,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  MapPin,
  Gift,
  FileText,
  Activity,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../utils/session";
import { getImageUrl } from "../../../utils/imageUrl";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  const menuItems = [
    { path: "/admin/dashboard", name: "Tổng quan", icon: Home },
    { path: "/admin/homestays", name: "Quản lý Homestay", icon: Building },
    { path: "/admin/bookings", name: "Đặt chỗ", icon: Calendar },
    { path: "/admin/users", name: "Người dùng", icon: Users },
    { path: "/admin/locations", name: "Khu vực", icon: MapPin },
    { path: "/admin/promotions", name: "Khuyến mãi", icon: Gift },
    { path: "/admin/news", name: "Tin tức", icon: FileText },
    { path: "/admin/reviews", name: "Đánh giá", icon: MessageSquare },
    { path: "/admin/activity-logs", name: "Lịch sử hoạt động", icon: Activity },
    { path: "/admin/settings", name: "Cài đặt", icon: Settings },
  ];

  const handleLogout = () => {
    // Implement logout logic here
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Quản trị HomeStay</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 mb-1 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="flex items-center space-x-3">
                {userInfo?.picture ? (
                  <img
                    src={getImageUrl(userInfo.picture)}
                    alt="Admin avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userInfo?.userName?.[0]?.toUpperCase() || "A"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {userInfo?.userName || "Quản trị viên"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userInfo?.email || "admin@homestay.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
