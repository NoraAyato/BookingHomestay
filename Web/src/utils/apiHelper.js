import { showToast } from "../components/common/Toast";

export const isAuthError = (response) => {
  return response && response.isAuthError === true;
};

export const showErrorToastIfNotAuth = (
  response,
  defaultMessage = "Có lỗi xảy ra"
) => {
  if (!isAuthError(response)) {
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
    if (!isAuthError(response)) {
      showToast("error", response.message || errorMessage);
    }
    return false;
  }
};
