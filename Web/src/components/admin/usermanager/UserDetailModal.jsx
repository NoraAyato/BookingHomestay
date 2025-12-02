import { getImageUrl } from "../../../utils/imageUrl";

const badgeStyle = {
  base: "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
  status: {
    ACTIVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    INACTIVE: "bg-red-100 text-red-700 border border-red-200",
  },
  role: {
    admin: "bg-purple-100 text-purple-700 border border-purple-200",
    host: "bg-blue-100 text-blue-700 border border-blue-200",
    guest: "bg-gray-100 text-gray-700 border border-gray-200",
    user: "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

function getStatusBadge(status) {
  const map = {
    ACTIVE: { label: "Đang hoạt động", style: badgeStyle.status.ACTIVE },
    INACTIVE: { label: "Bị khóa", style: badgeStyle.status.INACTIVE },
  };
  const s = map[status] || map.ACTIVE;
  return <span className={`${badgeStyle.base} ${s.style}`}>{s.label}</span>;
}
function getRoleBadge(role) {
  const map = {
    admin: { label: "Quản trị", style: badgeStyle.role.admin },
    host: { label: "Chủ nhà", style: badgeStyle.role.host },
    guest: { label: "Khách hàng", style: badgeStyle.role.guest },
    user: { label: "Người dùng", style: badgeStyle.role.user },
  };
  const r = map[(role || "").toLowerCase()] || {
    label: role || "-",
    style: badgeStyle.role.user,
  };
  return <span className={`${badgeStyle.base} ${r.style}`}>{r.label}</span>;
}

const UserDetailModal = ({ open, onClose, user }) => {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadein">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-0 relative animate-slideup">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b">
          <div className="text-lg font-bold text-gray-900">
            Thông tin người dùng
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
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
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fadein { animation: fadein .2s; }
        .animate-slideup { animation: slideup .25s cubic-bezier(.4,1.4,.6,1) }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideup { from { transform: translateY(40px); opacity:0; } to { transform: none; opacity:1; } }
      `}</style>
    </div>
  );
};

export default UserDetailModal;
