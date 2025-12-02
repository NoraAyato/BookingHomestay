// Format price display
export const formatPrice = (price) => {
  return price.toLocaleString("vi-VN");
};
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};
