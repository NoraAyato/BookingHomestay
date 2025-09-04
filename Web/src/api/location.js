import http from "./http";

export const getTop5Location = () => {
  return http.get(`/api/locations/top`);
};
export const getAllLocation = () => {
  return http.get(`/api/locations`);
};

// Tìm kiếm địa điểm theo prefix
export const searchLocationByPrefix = (prefix) => {
  return http.get(
    `/api/locations/search/suggest?prefix=${encodeURIComponent(prefix)}`
  );
};
