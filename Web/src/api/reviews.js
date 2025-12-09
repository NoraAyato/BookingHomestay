import http from "./http";

export const getTopReviews = () => {
  return http.get(`/api/reviews/top`);
};
