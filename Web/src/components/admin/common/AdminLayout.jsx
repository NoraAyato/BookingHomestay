import React, { useState, useEffect } from "react";
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
  ChevronDown,
  ChevronRight,
  Sparkles,
  Briefcase,
  LayoutGrid,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../utils/session";
import { getImageUrl } from "../../../utils/imageUrl";
import { useAuth } from "../../../hooks/useAuth";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [homestayMenuOpen, setHomestayMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const { logout } = useAuth();

  // Check if current route is in homestay submenu to keep it open
  useEffect(() => {
    const homestayRoutes = [
      "/admin/homestays",
      "/admin/amenities",
      "/admin/services",
      "/admin/room-types",
    ];
    if (homestayRoutes.some((route) => location.pathname.startsWith(route))) {
      setHomestayMenuOpen(true);
    }
  }, [location.pathname]);

  const menuItems = [
    { path: "/admin/dashboard", name: "Tổng quan", icon: Home },
    {
      name: "Quản lý Homestay",
      icon: Building,
      hasDropdown: true,
      subItems: [
        { path: "/admin/homestays", name: "Quản lý Homestay", icon: Building },
        { path: "/admin/amenities", name: "Quản lý Tiện nghi", icon: Sparkles },
        { path: "/admin/services", name: "Quản lý Dịch vụ", icon: Briefcase },
        {
          path: "/admin/room-types",
          name: "Quản lý Loại phòng",
          icon: LayoutGrid,
        },
      ],
    },
    { path: "/admin/bookings", name: "Đặt chỗ", icon: Calendar },
    { path: "/admin/users", name: "Người dùng", icon: Users },
    { path: "/admin/locations", name: "Khu vực", icon: MapPin },
    { path: "/admin/promotions", name: "Khuyến mãi", icon: Gift },
    { path: "/admin/news", name: "Tin tức", icon: FileText },
    { path: "/admin/reviews", name: "Đánh giá", icon: MessageSquare },
    { path: "/admin/activity-logs", name: "Lịch sử hoạt động", icon: Activity },
    // { path: "/admin/settings", name: "Cài đặt", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
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

        <nav className="mt-4 px-3 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            // Nếu có dropdown
            if (item.hasDropdown) {
              const isAnySubItemActive = item.subItems.some(
                (subItem) => location.pathname === subItem.path
              );

              return (
                <div key={index} className="mb-0.5">
                  <button
                    onClick={() => setHomestayMenuOpen(!homestayMenuOpen)}
                    className={`flex items-center justify-between w-full px-2.5 py-2 rounded-md transition-colors text-sm ${
                      isAnySubItemActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2.5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {homestayMenuOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Dropdown menu */}
                  {homestayMenuOpen && (
                    <div className="mt-0.5 ml-3 pl-3 border-l-2 border-gray-200">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isActive = location.pathname === subItem.path;

                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-2 py-1.5 mb-0.5 rounded-md transition-colors text-sm ${
                              isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <SubIcon className="h-3.5 w-3.5 mr-2" />
                            <span className="text-xs">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Menu item thông thường
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2.5 py-2 mb-0.5 rounded-md transition-colors text-sm ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4 mr-2.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2.5 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors text-sm"
          >
            <LogOut className="h-4 w-4 mr-2.5" />
            <span>Đăng xuất</span>
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
