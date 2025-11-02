import { useState, useEffect } from "react";
import {
  updateAvatar,
  updateUser,
  getCurrentUser,
  getMyBooking,
  setReceiveEmail,
  getFavorites,
  addToFavorites,
} from "../api/users";
import { showToast } from "../components/common/Toast";
import {
  setUserInfoLocal,
  getAccessToken,
  getUserInfo,
} from "../utils/session";
import { APICache } from "../utils/cache";
import {
  isAuthError,
  showErrorToastIfNotAuth,
  handleApiResponse,
} from "../utils/apiHelper";
export default function useUser() {
  const [currentUser, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsLimit, setBookingsLimit] = useState(3);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReceiveEmailStatus, setIsReceiveEmailStatus] = useState(false);
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

      if (
        handleApiResponse(
          updated,
          "Cập nhật thông tin thành công",
          "Có lỗi xảy ra"
        )
      ) {
        await fetchUser();
      }

      setLoading(false);
      return updated.success;
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      showToast("error", err.message || "Có lỗi xảy ra");
      setLoading(false);
      return false;
    }
  };
  const getCurrentUserBooking = async (page = 1, limit = 3) => {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = `userBookings_page_${page}_limit_${limit}`;
      const cachedData = APICache.get(cacheKey);
      // if (cachedData) {
      //   setBookings(cachedData.items);
      //   setBookingsPage(cachedData.page || page);
      //   setBookingsLimit(cachedData.limit || limit);
      //   setBookingsTotal(cachedData.total || 0);
      //   setLoading(false);
      //   return;
      // }
      const res = await getMyBooking(page, limit);
      if (res.success) {
        setBookings(res.data?.items);
        setBookingsTotal(res.data?.total || 0);
        setBookingsPage(res.data?.page || page);
        setBookingsLimit(res.data?.limit || limit);
        APICache.set(cacheKey, res.data);
      } else {
        showErrorToastIfNotAuth(res, "Có lỗi xảy ra");
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      setLoading(false);
    }
  };

  const getUserFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFavorites();
      // console.log("Favorites response:", res);
      if (res.success) {
        // Check if data is an array or has items property
        const favoritesData = Array.isArray(res.data)
          ? res.data
          : res.data?.items || [];
        setFavorites(favoritesData);
      } else {
        showErrorToastIfNotAuth(
          res,
          "Có lỗi xảy ra khi lấy danh sách yêu thích"
        );
        setFavorites([]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      setLoading(false);
    }
  };

  const addFavorite = async (homestayId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addToFavorites(homestayId);
      if (handleApiResponse(res, "Đã thêm vào yêu thích", "Có lỗi xảy ra")) {
        // Refresh lại danh sách favorites sau khi thêm thành công
        await getUserFavorites();
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      showToast("error", err.message || "Có lỗi xảy ra");
      setLoading(false);
      return false;
    }
  };

  const removeFavorite = async (homestayId) => {
    setLoading(true);
    setError(null);
    try {
      // Assuming addToFavorites API works as toggle (add/remove)
      const res = await addToFavorites(homestayId);
      if (handleApiResponse(res, "Đã xóa khỏi yêu thích", "Có lỗi xảy ra")) {
        // Refresh lại danh sách favorites sau khi xóa thành công
        await getUserFavorites();
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      showToast("error", err.message || "Có lỗi xảy ra");
      setLoading(false);
      return false;
    }
  };

  // hàm update avatar user
  const uploadAvatar = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAvatar(file);

      if (
        handleApiResponse(
          updated,
          "Cập nhật ảnh đại diện thành công",
          "Có lỗi xảy ra"
        )
      ) {
        const userData = await getCurrentUser();
        if (userData.success) {
          setUser(userData.data);
          setUserInfoLocal(userData.data);
        }
      }

      setLoading(false);
      return updated.success;
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

      if (handleApiResponse(data, "Cập nhật thành công", "Có lỗi xảy ra")) {
        setIsReceiveEmailStatus(true);
        await fetchUser();
      } else {
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
      setError(err.message);
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
    const token = getAccessToken();
    const cachedUser = getUserInfo();

    // Ưu tiên dùng cached user từ localStorage
    if (cachedUser && !currentUser) {
      setUser(cachedUser);
    }

    // Fetch user mới từ API nếu có token và chưa có user
    if (token && !currentUser && !cachedUser) {
      fetchUser();
    }
  }, []); // Chỉ chạy 1 lần khi mount

  // Thêm function để force refresh user data
  const refreshUser = async () => {
    const token = getAccessToken();
    if (token) {
      await fetchUser();
    }
  };

  return {
    currentUser,
    fetchUser,
    refreshUser,
    bookings,
    bookingsTotal,
    bookingsPage,
    bookingsLimit,
    favorites,
    getUserFavorites,
    addFavorite,
    removeFavorite,
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
