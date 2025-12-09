import { useState, useEffect } from "react";
import { getTopReviews } from "../api/reviews";
import { getImageUrl } from "../utils/imageUrl";
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTopReviews();

      // API response structure: { success, message, data: [...] }
      const reviewsData = response.data.data || response.data || [];

      // Transform API data to match component structure
      const transformedData = reviewsData.map((review) => ({
        id: review.id,
        name: review.name || "Khách hàng",
        avatar: getImageUrl(review.avatar),
        role: "Khách hàng",
        location: review.location || "Việt Nam",
        content: review.content || "",
        rating: review.rating || 5,
        homestay: review.homestay || "Homestay",
        date: review.date
          ? new Date(review.date).toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })
          : "Gần đây",
        image: review.image
          ? review.image.startsWith("http")
            ? review.image
            : `${import.meta.env.VITE_API_URL || "http://localhost:8080"}${
                review.image
              }`
          : "https://images.unsplash.com/photo-1586611292717-f828b167408c",
      }));

      setReviews(transformedData);
    } catch (err) {
      console.error("Error fetching top reviews:", err);
      setError(err.message || "Không thể tải đánh giá");
      // Set empty array on error to prevent component breaking
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopReviews();
  }, []);

  return {
    reviews,
    loading,
    error,
    refetch: fetchTopReviews,
  };
};
