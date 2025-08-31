import http from "./http";
import { mockNewsData, mockNewsDetail } from "./mockNewsData";

// Using mock data for now - replace with real API calls when ready
export const getNewsList = (params = {}) => {
  // Return mock data with a delay to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNewsData);
    }, 500);
  });

  // Uncomment below when real API is ready
  // return http.get('/api/news', { params });
};

export const getNewsDetail = (id) => {
  // Return mock data with a delay to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNewsDetail);
    }, 500);
  });

  // Uncomment below when real API is ready
  // return http.get(`/api/news/${id}`);
};
