import { showToast } from "../components/common/Toast";

export const isAuthError = (response) => {
  return response && response.isAuthError === true;
};

export const isAccessDenied = (response) => {
  return (
    response &&
    (response.message?.toLowerCase().includes("access denied") ||
      response.message?.toLowerCase().includes("truy cập bị từ chối") ||
      response.message?.toLowerCase().includes("không có quyền") ||
      response.statusCode === 403 ||
      response.status === 403)
  );
};

export const handleAccessDenied = () => {
  // Redirect to access denied page
  window.location.href = "/access-denied";
};

export const showErrorToastIfNotAuth = (
  response,
  defaultMessage = "Có lỗi xảy ra"
) => {
  if (!isAuthError(response)) {
    // Check for access denied
    if (isAccessDenied(response)) {
      handleAccessDenied();
      return;
    }
    showToast("error", response?.message || defaultMessage);
  }
};

export const handleApiResponse = (response, successMessage, errorMessage) => {
  if (response.success) {
    if (successMessage) {
      showToast("success", response.message || successMessage);
    }
    return true;
  } else {
    // Check for access denied first
    if (isAccessDenied(response)) {
      handleAccessDenied();
      return false;
    }

    if (!isAuthError(response)) {
      showToast("error", response.message || errorMessage);
    }
    return false;
  }
};
