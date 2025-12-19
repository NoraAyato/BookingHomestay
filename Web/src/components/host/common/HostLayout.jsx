import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Building,
  Calendar,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  Star,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Briefcase,
  LayoutGrid,
  DoorOpen,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../utils/session";
import { getImageUrl } from "../../../utils/imageUrl";
import MessengerButton from "../../chat/MessengerButton";

const HostLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [homestayMenuOpen, setHomestayMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  // Check if current route is in homestay submenu to keep it open
  useEffect(() => {
    const homestayRoutes = ["/host/homestays", "/host/rooms", "/host/services"];
    if (homestayRoutes.some((route) => location.pathname.startsWith(route))) {
      setHomestayMenuOpen(true);
    }
  }, [location.pathname]);

  const menuItems = [
    { path: "/host/dashboard", name: "Tổng quan", icon: Home },
    {
      name: "Quản lý Homestay",
      icon: Building,
      hasDropdown: true,
      subItems: [
        { path: "/host/homestays", name: "Homestay của tôi", icon: Building },
        { path: "/host/rooms", name: "Quản lý Phòng", icon: DoorOpen },
        { path: "/host/services", name: "Quản lý Dịch vụ", icon: Briefcase },
      ],
    },
    { path: "/host/bookings", name: "Quản lý đặt phòng", icon: Calendar },
    { path: "/host/promotions", name: "Khuyến mãi", icon: Gift },
    { path: "/host/reviews", name: "Đánh giá", icon: Star },
    // { path: "/host/revenue", name: "Doanh thu", icon: DollarSign },
    // { path: "/host/messages", name: "Tin nhắn", icon: MessageSquare },
    // { path: "/host/analytics", name: "Phân tích", icon: BarChart3 },
    // { path: "/host/settings", name: "Cài đặt", icon: Settings },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-xl font-bold text-white">Host Dashboard</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-white" />
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

            // Menu item thông thường không có dropdown
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
              <Menu className="h-6 w-6 text-gray-600" />
            </button>

            <div className="flex-1 lg:ml-0 ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Chào mừng trở lại, {userInfo?.userName || "Host"}! 👋
              </h2>
              <p className="text-sm text-gray-500">
                Quản lý homestay của bạn dễ dàng hơn
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 border-l pl-4">
                {userInfo?.picture ? (
                  <img
                    src={getImageUrl(userInfo.picture)}
                    alt="Host avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {userInfo?.userName?.[0]?.toUpperCase() || "H"}
                    </span>
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {userInfo?.userName || "Host Name"}
                  </p>
                  <p className="text-xs text-gray-500">Chủ homestay</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Messenger Button */}
      <MessengerButton />
    </div>
  );
};

export default HostLayout;
