import React, { useState } from "react";
import {
  useAreasOverview,
  usePromotionsOverview,
  useNewsOverview,
} from "../../hooks/admin/useDashboard";
import AreasSection from "../../components/admin/dashboard/AreasSection";
import PromotionsSection from "../../components/admin/dashboard/PromotionsSection";
import NewsSection from "../../components/admin/dashboard/NewsSection";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/common/AdminLayout";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import BookingOverview from "../../components/admin/dashboard/BookingOverview";
import RecentActivity from "../../components/admin/activity/RecentActivity";
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Gift,
  FileText,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Tổng quan", icon: DollarSign },
    { id: "areas", name: "Khu vực", icon: MapPin },
    { id: "promotions", name: "Khuyến mãi", icon: Gift },
    { id: "news", name: "Tin tức", icon: FileText },
  ];

  const renderOverviewContent = () => (
    <>
      {/* Stats Cards */}
      <DashboardStats period={selectedPeriod} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <BookingOverview period={selectedPeriod} />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </>
  );

  // Areas hook
  const {
    data: areas,
    loading: loadingAreas,
    error: errorAreas,
  } = useAreasOverview();
  const renderAreasContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Điểm đến phổ biến
        </h3>
        <AreasSection data={areas} loading={loadingAreas} error={errorAreas} />
      </div>
    </div>
  );

  // Promotions hook
  const {
    data: promotions,
    loading: loadingPromotions,
    error: errorPromotions,
  } = usePromotionsOverview();
  const renderPromotionsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Quản lý khuyến mãi
          </h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/admin/promotions")}
          >
            <Gift className="h-4 w-4" />
            <span>Tạo khuyến mãi</span>
          </button>
        </div>
        <PromotionsSection
          data={promotions}
          loading={loadingPromotions}
          error={errorPromotions}
        />
      </div>
    </div>
  );

  // News hook
  const {
    data: news,
    loading: loadingNews,
    error: errorNews,
  } = useNewsOverview();
  const renderNewsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Quản lý tin tức
          </h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/admin/news")}
          >
            <FileText className="h-4 w-4" />
            <span>Tạo bài viết</span>
          </button>
        </div>
        <NewsSection data={news} loading={loadingNews} error={errorNews} />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewContent();
      case "areas":
        return renderAreasContent();
      case "promotions":
        return renderPromotionsContent();
      case "news":
        return renderNewsContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tổng quan hệ thống
            </h1>
            <p className="text-gray-600 mt-1">
              Chào mừng trở lại! Đây là tình hình hoạt động hệ thống homestay
              của bạn.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>7 ngày qua</option>
              <option value={30}>30 ngày qua</option>
              <option value={90}>90 ngày qua</option>
              <option value={365}>Năm qua</option>
            </select>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">{renderTabContent()}</div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
