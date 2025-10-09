import http from "./http";
// Amenities API functions
export const getAllAmenities = () => {
  return http.get(`/api/amenities`);
};
