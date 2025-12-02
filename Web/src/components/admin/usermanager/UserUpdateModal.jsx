import React, { useState } from "react";
import { getImageUrl } from "../../../utils/imageUrl";

const badgeStyle = {
  base: "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
  status: {
    ACTIVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    INACTIVE: "bg-red-100 text-red-700 border border-red-200",
  },
  role: {
    Admin: "bg-purple-100 text-purple-700 border border-purple-200",
    Host: "bg-blue-100 text-blue-700 border border-blue-200",
    Guest: "bg-gray-100 text-gray-700 border border-gray-200",
    User: "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

function getStatusBadge(status) {
  const map = {
    ACTIVE: { label: "Hoạt động", style: badgeStyle.status.ACTIVE },
    INACTIVE: { label: "Khóa", style: badgeStyle.status.INACTIVE },
  };
  const s = map[status] || map.ACTIVE;
  return <span className={`${badgeStyle.base} ${s.style}`}>{s.label}</span>;
}
function getRoleBadge(role) {
  const map = {
    Admin: { label: "Quản trị", style: badgeStyle.role.Admin },
    Host: { label: "Chủ nhà", style: badgeStyle.role.Host },
    Guest: { label: "Khách hàng", style: badgeStyle.role.Guest },
    User: { label: "Người dùng", style: badgeStyle.role.User },
  };
  const r = map[(role || "").toLowerCase()] || {
    label: role || "-",
    style: badgeStyle.role.User,
  };
  return <span className={`${badgeStyle.base} ${r.style}`}>{r.label}</span>;
}

const UserUpdateModal = ({ open, onClose, user, roles, onSubmit, loading }) => {
  const [form, setForm] = useState({
    role: user?.role || "",
    status: user?.status || "",
  });

  React.useEffect(() => {
    setForm({ role: user?.role || "", status: user?.status || "" });
  }, [user]);

  // Kiểm tra xem có thay đổi gì không
  const hasChanges = React.useMemo(() => {
    if (!user) return false;
    return form.role !== user.role || form.status !== user.status;
  }, [form, user]);

  // Xử lý submit - chỉ gọi API cho các trường đã thay đổi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges || !onSubmit) return;

    const changes = {};
    if (form.role !== user.role) {
      // Tìm roleId từ role name đã chọn
      const selectedRole = roles?.find((r) => r.name === form.role);
      if (selectedRole) {
        changes.role = selectedRole.id;
      }
    }
    if (form.status !== user.status) {
      changes.status = form.status;
    }

    onSubmit(changes);
  };

  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadein">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-0 relative animate-slideup">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b">
          <div className="text-lg font-bold text-gray-900">
            Cập nhật người dùng
          </div>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        {/* Avatar & Name */}
        <div className="flex flex-col items-center px-6 pt-6 pb-2">
          <img
            src={getImageUrl(user.avatar)}
            alt={user.name || user.email}
            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow -mt-10 bg-gray-100"
          />
          <div className="mt-3 text-xl font-semibold text-gray-900">
            {user.name || user.email}
          </div>
          <div className="flex gap-2 mt-2">
            {getRoleBadge(user.role)}
            {getStatusBadge(user.status)}
          </div>
        </div>
        {/* Info grid */}
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">ID</div>
              <div className="font-mono text-sm text-gray-700 break-all">
                {user.id}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="text-sm text-gray-700">
                {user.email || "Chưa cập nhật"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
              <div className="text-sm text-gray-700">
                {user.phone || "Chưa cập nhật"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Ngày tham gia</div>
              <div className="text-sm text-gray-700">
                {user.joinDate
                  ? new Date(user.joinDate).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Vai trò
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  required
                >
                  {roles?.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Trạng thái
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  required
                >
                  {["ACTIVE", "INACTIVE"].map((s) => (
                    <option key={s} value={s}>
                      {s === "ACTIVE" ? "Hoạt động" : "Khóa"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading || !hasChanges}
                title={!hasChanges ? "Không có thay đổi" : ""}
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        .animate-fadein { animation: fadein .2s; }
        .animate-slideup { animation: slideup .25s cubic-bezier(.4,1.4,.6,1) }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideup { from { transform: translateY(40px); opacity:0; } to { transform: none; opacity:1; } }
      `}</style>
    </div>
  );
};

export default UserUpdateModal;
