import http from "./http";

// Public Amenities API
export const getAllAmenities = () => {
  return http.get(`/api/amenities`);
};
