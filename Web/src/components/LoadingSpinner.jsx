import React from "react";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <svg
      className="animate-spin h-8 w-8 text-rose-500 mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    <AnimatedDotsLoading />
  </div>
);

function AnimatedDotsLoading() {
  const [dots, setDots] = React.useState(1);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="text-sm text-gray-600 font-medium mt-2">
      Đang tải{".".repeat(dots)}
    </span>
  );
}

export default LoadingSpinner;
