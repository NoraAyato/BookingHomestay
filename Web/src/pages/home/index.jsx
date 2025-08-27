import React, { Suspense } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Lazy load các component
const HeroSection = React.lazy(() => import("./components/HeroSection"));
const FeaturedHomestays = React.lazy(() =>
  import("./components/FeaturedHomestays")
);
const PopularDestinations = React.lazy(() =>
  import("./components/PopularDestinations")
);
const Testimonials = React.lazy(() => import("./components/Testimonials"));
const Benefits = React.lazy(() => import("./components/Benefits"));
const Newsletter = React.lazy(() => import("./components/Newsletter"));

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section with Search */}
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      {/* Featured Homestays Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedHomestays />
      </Suspense>

      {/* Popular Destinations */}
      <Suspense fallback={<LoadingSpinner />}>
        <PopularDestinations />
      </Suspense>

      {/* Benefits Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <Benefits />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <Testimonials />
      </Suspense>

      {/* Newsletter Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <Newsletter />
      </Suspense>
    </div>
  );
};

export default HomePage;
