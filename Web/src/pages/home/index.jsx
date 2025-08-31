import React, { Suspense } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
const HeroSection = React.lazy(() =>
  import("../../components/home/HeroSection")
);
const FeaturedHomestays = React.lazy(() =>
  import("../../components/home/FeaturedHomestays")
);
const PopularDestinations = React.lazy(() =>
  import("../../components/home/PopularDestinations")
);
const Testimonials = React.lazy(() =>
  import("../../components/home/Testimonials")
);
const Benefits = React.lazy(() => import("../../components/home/Benefits"));
const Newsletter = React.lazy(() => import("../../components/home/Newsletter"));

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
      <Suspense fallback={<LoadingSpinner />}>
        <Newsletter />
      </Suspense>
    </div>
  );
};

export default HomePage;
