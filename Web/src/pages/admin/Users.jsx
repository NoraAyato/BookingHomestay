import React, { useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { getImageUrl } from "../../utils/imageUrl";
import {
  Search,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import useAdminUsers from "../../hooks/admin/useAdminUsers";
import DataTable from "../../components/common/DataTable";
import UserDetailModal from "../../components/admin/usermanager/UserDetailModal";
import UserUpdateModal from "../../components/admin/usermanager/UserUpdateModal";

const Users = () => {
  const {
    roles,
    users,
    pagination,
    loading,
    fetchRoles,
    fetchUsers,
    setUserFilters,
    filters,
    userStats,
    loadingStats,
    fetchUserStats,
    updateRole,
    updateStatus,
  } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [detailUser, setDetailUser] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [updating, setUpdating] = useState(false);
  const pageSize = pagination.limit || 10;
  const total = pagination.total || 0;

  React.useEffect(() => {
    fetchRoles();
    fetchUserStats();
  }, [fetchRoles, fetchUserStats]);

  // Xử lý filter và phân trang
  React.useEffect(() => {
    fetchUsers({
      page,
      role: filters.role,
      status: filters.status,
      search: searchTerm,
    });
  }, [page, filters.role, filters.status, searchTerm]);

  const handleRoleChange = (e) => {
    setUserFilters({ role: e.target.value });
    setPage(1);
  };
  const handleStatusChange = (e) => {
    setUserFilters({ status: e.target.value });
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Quản trị",
      },
      host: { bg: "bg-blue-100", text: "text-blue-700", label: "Chủ nhà" },
      guest: { bg: "bg-gray-100", text: "text-gray-700", label: "Khách hàng" },
      user: { bg: "bg-gray-100", text: "text-gray-700", label: "Người dùng" },
    };
    const key = (role || "").toLowerCase();
    const config = roleConfig[key] || {
      bg: "bg-gray-100",
      text: "text-gray-400",
      label: role || "-",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Đang hoạt động",
        icon: "✓",
      },
      INACTIVE: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Bị khóa",
        icon: "✕",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        <span className="text-sm">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Hàm rút gọn id
  const shortId = (id) => {
    if (!id) return "-";
    return id.length > 12 ? id.slice(0, 12) + "..." : id;
  };

  // Hàm hiển thị giá trị hoặc "Chưa cập nhật"
  const displayValue = (value) =>
    value == null || value === "" ? "Chưa cập nhật" : value;

  const columns = [
    {
      key: "name",
      title: "Người dùng",
      render: (value, row) => (
        <div className="flex items-center">
          <img
            src={getImageUrl(row.avatar)}
            alt={row.name || row.email}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
              {displayValue(row.name || row.email)}
            </div>
            <div className="text-sm text-gray-500">ID: {shortId(row.id)}</div>
          </div>
        </div>
      ),
      minWidth: 200,
    },
    {
      key: "email",
      title: "Liên hệ",
      render: (value, row) => (
        <>
          <div className="text-sm text-gray-900">{displayValue(row.email)}</div>
          <div className="text-sm text-gray-500">{displayValue(row.phone)}</div>
        </>
      ),
      minWidth: 180,
    },
    {
      key: "role",
      title: "Vai trò",
      render: (value) => getRoleBadge(value),
      minWidth: 120,
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value) => getStatusBadge(value),
      minWidth: 120,
    },
    {
      key: "joinDate",
      title: "Ngày tham gia",
      render: (value) => displayValue(formatDate(value)),
      minWidth: 120,
    },
  ];

  const renderActions = (row) => (
    <div className="flex gap-2">
      <button
        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Xem chi tiết"
        onClick={() => {
          setDetailUser(row);
          setOpenDetail(true);
        }}
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
        title="Chỉnh sửa"
        onClick={() => {
          setEditUser(row);
          setOpenEdit(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản Lý Người Dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng người dùng</div>
                <div className="text-xl font-bold text-gray-900">
                  {loadingStats ? "..." : userStats.total}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-11 h-11 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <UserCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đang hoạt động</div>
                <div className="text-xl font-bold text-emerald-600">
                  {loadingStats ? "..." : userStats.active}
                </div>
                <div className="text-xs text-gray-500">
                  {userStats.total > 0
                    ? ((userStats.active / userStats.total) * 100).toFixed(1) +
                      "% tổng số"
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-11 h-11 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Bị khóa</div>
                <div className="text-xl font-bold text-red-600">
                  {loadingStats ? "..." : userStats.inactive}
                </div>
                <div className="text-xs text-gray-500">
                  {userStats.total > 0
                    ? ((userStats.inactive / userStats.total) * 100).toFixed(
                        1
                      ) + "% tổng số"
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filters.role}
                onChange={handleRoleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={handleStatusChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Bị khóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          page={pagination.page}
          pageSize={pageSize}
          total={total}
          onPageChange={(p) => {
            setPage(p);
          }}
          renderActions={renderActions}
          emptyText="Không có người dùng nào"
        />

        {/* Popup chi tiết user */}
        <UserDetailModal
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          user={detailUser}
        />
        {/* Popup cập nhật user */}
        <UserUpdateModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          user={editUser}
          roles={roles}
          loading={updating}
          onSubmit={async (changes) => {
            setUpdating(true);
            try {
              // Gọi API tương ứng với từng thay đổi
              const promises = [];

              if (changes.role !== undefined) {
                promises.push(updateRole(editUser.id, changes.role));
              }

              if (changes.status !== undefined) {
                promises.push(updateStatus(editUser.id, changes.status));
              }

              // Đợi tất cả các API hoàn thành
              await Promise.all(promises);

              // Đóng modal và refresh danh sách
              setOpenEdit(false);
              fetchUsers({
                page,
                role: filters.role,
                status: filters.status,
                search: searchTerm,
              });
            } catch (error) {
            } finally {
              setUpdating(false);
            }
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default Users;
