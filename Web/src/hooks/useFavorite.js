import { useState, useCallback, useEffect } from "react";
import { addToFavorites, getFavorites } from "../api/users";
import { showToast } from "../components/common/Toast";
import { useAuth } from "./useAuth";

export const useFavorite = (homestayId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();
  const [shouldRecheck, setShouldRecheck] = useState(0);

  const checkIsFavorite = useCallback(async () => {
    // Nếu chưa có user, đợi user load xong
    if (!user) {
      setIsChecking(false);
      setIsFavorite(false);
      return;
    }

    if (!homestayId) {
      setIsChecking(false);
      setIsFavorite(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await getFavorites(1, 1000); // Lấy max để check

      if (response.success) {
        const favoritesData = Array.isArray(response.data)
          ? response.data
          : response.data?.items || [];

        const found = favoritesData.some((fav) => {
          const match =
            String(fav.id) === String(homestayId) ||
            String(fav.homestayId) === String(homestayId) ||
            String(fav.idHomestay) === String(homestayId);
          return match;
        });

        setIsFavorite(found);
      }
    } catch (error) {
      console.error("❌ Error checking favorite status:", error);
    } finally {
      setIsChecking(false);
    }
  }, [homestayId, user]);

  const toggleFavorite = useCallback(async () => {
    if (!user) {
      showToast("warning", "Vui lòng đăng nhập để sử dụng tính năng này");
      return false;
    }

    if (isLoading) return false;

    setIsLoading(true);
    try {
      const response = await addToFavorites(homestayId);

      if (response.success) {
        // Toggle state
        const newState = !isFavorite;
        setIsFavorite(newState);
        return true;
      } else {
        showToast("error", response.message || "Có lỗi xảy ra");
        return false;
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showToast("error", "Có lỗi xảy ra. Vui lòng thử lại!");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [homestayId, isFavorite, isLoading, user]);

  useEffect(() => {
    if (user && homestayId) {
      checkIsFavorite();
    }
  }, [user, homestayId, checkIsFavorite]);

  useEffect(() => {
    if (user && homestayId && shouldRecheck > 0) {
      checkIsFavorite();
    }
  }, [user, shouldRecheck, homestayId, checkIsFavorite]);

  useEffect(() => {
    if (user) {
      setShouldRecheck((prev) => prev + 1);
    }
  }, [user]);

  return {
    isFavorite,
    isLoading,
    isChecking,
    toggleFavorite,
    refreshFavoriteStatus: checkIsFavorite,
  };
};

export default useFavorite;
