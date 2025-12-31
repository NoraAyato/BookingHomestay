import { useState, useCallback } from "react";
import { showToast } from "../components/common/Toast";

/**
 * Hook để xử lý chia sẻ content
 * Sử dụng Web Share API (mobile/modern browsers) hoặc fallback sang Copy to Clipboard
 */
export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  /**
   * Check if Web Share API is supported
   */
  const isShareSupported = useCallback(() => {
    return typeof navigator !== "undefined" && !!navigator.share;
  }, []);

  /**
   * Copy link to clipboard (fallback method)
   */
  const copyToClipboard = useCallback(async (url) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        showToast("success", "Đã sao chép link vào clipboard!");
        return true;
      } else {
        // Fallback cho browsers cũ
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          showToast("success", "Đã sao chép link vào clipboard!");
          return true;
        } else {
          throw new Error("Copy command failed");
        }
      }
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      showToast("error", "Không thể sao chép link. Vui lòng thử lại!");
      return false;
    }
  }, []);

  /**
   * Share using Web Share API or fallback to clipboard
   * @param {Object} options - Share options
   * @param {string} options.title - Title to share
   * @param {string} options.text - Text description to share
   * @param {string} options.url - URL to share (optional, defaults to current URL)
   */
  const share = useCallback(
    async ({ title, text, url = window.location.href }) => {
      if (isSharing) return;

      setIsSharing(true);

      try {
        // Try Web Share API first (native share on mobile/modern browsers)
        if (isShareSupported()) {
          try {
            await navigator.share({
              title: title,
              text: text,
              url: url,
            });
            // showToast("success", "Chia sẻ thành công!");
            return { success: true, method: "native" };
          } catch (err) {
            // User cancelled the share or share failed
            if (err.name === "AbortError") {
              // User cancelled - không hiển thị error
              return { success: false, cancelled: true };
            }
            // Share API failed - fallback to clipboard
            console.warn(
              "Web Share API failed, falling back to clipboard:",
              err
            );
            const copied = await copyToClipboard(url);
            return { success: copied, method: "clipboard" };
          }
        } else {
          // Web Share API not supported - use clipboard
          const copied = await copyToClipboard(url);
          return { success: copied, method: "clipboard" };
        }
      } catch (err) {
        console.error("Share error:", err);
        showToast("error", "Không thể chia sẻ. Vui lòng thử lại!");
        return { success: false, error: err.message };
      } finally {
        setIsSharing(false);
      }
    },
    [isSharing, isShareSupported, copyToClipboard]
  );

  /**
   * Share homestay details
   */
  const shareHomestay = useCallback(
    async ({ id, name, location, price }) => {
      const url = `${window.location.origin}/homestay/detail/${id}`;
      const title = `${name} - BookingHomeStay`;
      const text = `Xem homestay ${name}${location ? ` tại ${location}` : ""}${
        price ? ` - Giá từ ${price}` : ""
      }`;

      return await share({ title, text, url });
    },
    [share]
  );

  /**
   * Share current page
   */
  const shareCurrentPage = useCallback(
    async ({ title, description }) => {
      return await share({
        title: title || document.title,
        text: description || "",
        url: window.location.href,
      });
    },
    [share]
  );

  return {
    share,
    shareHomestay,
    shareCurrentPage,
    isSharing,
    isShareSupported: isShareSupported(),
  };
};

export default useShare;
