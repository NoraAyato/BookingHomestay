import { useState, useEffect } from "react";
import {
  updateAvatar,
  updateUser,
  getCurrentUser,
  getMyBooking,
  setReceiveEmail,
} from "../api/users";
import { showToast } from "../components/common/Toast";
import { setUserInfoLocal } from "../utils/session";
import { APICache } from "../utils/cache";
export default function useUser() {
  const [currentUser, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsLimit, setBookingsLimit] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReceiveEmailStatus, setIsReceiveEmailStatus] = useState(false);
  // Hàm cập nhật user (có thể gọi API ở đây)
  const updateUserProfile = async (newData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        firstName: newData.firstName,
        lastName: newData.lastName,
        phoneNumber: newData.phone,
        gender: newData.gender,
        birthday: newData.dob,
      };
      const updated = await updateUser(payload);
      if (updated.success) {
        showToast(
          "success",
          updated.message || "Cập nhật thông tin thành công"
        );
        await handleReloadPage();
      } else {
        showToast("error", updated.message || "Có lỗi xảy ra");
      }
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      setLoading(false);
      return false;
    }
  };
  //hàm lấy danh sách lịch sử đặt phòng của user
  const getCurrentUserBooking = async (page = 1, limit = 3) => {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = `userBookings_page_${page}_limit_${limit}`;
      const cachedData = APICache.get(cacheKey);
      if (cachedData) {
        setBookings(cachedData.items);
        setBookingsPage(cachedData.page || page);
        setBookingsLimit(cachedData.limit || limit);
        setBookingsTotal(cachedData.total || 0);
        setLoading(false);
        return;
      }
      const res = await getMyBooking(page, limit);
      if (res.success) {
        setBookings(res.data?.items);
        setBookingsTotal(res.data?.total || 0);
        setBookingsPage(res.data?.page || page);
        setBookingsLimit(res.data?.limit || limit);
        APICache.set(cacheKey, res.data);
      } else {
        showToast("error", res.message || "Có lỗi xảy ra");
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      setLoading(false);
    }
  };
  // hàm update avatar user
  const uploadAvatar = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAvatar(file);
      if (updated.success) {
        showToast(
          "success",
          updated.message || "Cập nhật ảnh đại diện thành công"
        );
        const userData = await getCurrentUser();
        if (userData.success) {
          setUser(userData.data);
          setUserInfoLocal(userData.data);
        }
      } else {
        if (updated.message) {
          showToast("error", updated.message);
        }
      }
      setLoading(false);
      return true;
    } catch (err) {
      showToast("error", err.message || "Có lỗi xảy ra");
      setLoading(false);
      return false;
    }
  };
  const updateReceiveEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await setReceiveEmail(true);
      if (data && data.success) {
        showToast("success", data.message || "Cập nhật thành công");
        setIsReceiveEmailStatus(true);
        await handleReloadPage();
      } else {
        if (data.message) {
          showToast("error", data.message);
        }
        setUser(null);
      }
    } catch (err) {
      showToast("error", err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy user (có thể gọi API ở đây)
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentUser();
      if (data && data.success && data.data) {
        setUser(data.data);
        setUserInfoLocal(data.data);
      } else {
        setUser(null);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      setUser(null);
      setLoading(false);
    }
  };
  const handleReloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  useEffect(() => {
    // Chỉ fetch khi currentUser là null hoặc undefined
    if (!currentUser) {
      fetchUser();
    }
  }, []);

  return {
    currentUser,
    fetchUser,
    bookings,
    bookingsTotal,
    bookingsPage,
    bookingsLimit,
    setUser,
    updateUserProfile,
    uploadAvatar,
    updateReceiveEmail,
    isReceiveEmailStatus,
    getCurrentUserBooking,
    loading,
    error,
  };
}
