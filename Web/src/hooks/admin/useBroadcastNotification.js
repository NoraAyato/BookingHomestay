import { useState, useCallback } from "react";
import { sendBroadcastNotification } from "../../api/admin/broadcastNotification";
import { handleApiResponse } from "../../utils/apiHelper";

/**
 * Custom hook for broadcasting notifications to all users
 * @returns {Object} Broadcast notification state and methods
 */
export const useBroadcastNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Send broadcast notification
   * @param {string} title - Notification title
   * @param {string} content - Notification content
   * @returns {Promise<boolean>} Success status
   */
  const sendNotification = useCallback(async (title, content) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await sendBroadcastNotification(title, content);
      console.log("Broadcast notification response:", response);
      if (
        handleApiResponse(
          response,
          "Gửi thông báo thành công!",
          "Không thể gửi thông báo"
        )
      ) {
        setSuccess(true);
        return true;
      } else {
        setError(response.message || "Không thể gửi thông báo");
        return false;
      }
    } catch (err) {
      const errorMessage = err.message || "Có lỗi xảy ra khi gửi thông báo";
      setError(errorMessage);
      handleApiResponse({ success: false }, "", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    sendNotification,
    reset,
  };
};

export default useBroadcastNotification;
