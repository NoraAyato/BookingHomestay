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
      <HeroSection />

      {/* Featured Homestays Section */}
      <FeaturedHomestays />
      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Benefits Section */}
      <Benefits />

      <Suspense fallback={<LoadingSpinner />}>
        <Testimonials />
      </Suspense>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default HomePage;
