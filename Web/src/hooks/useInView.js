import { useEffect, useRef, useState } from "react";

export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, inView];
}

// Hook mới để stagger animations
export function useStaggeredAnimation(delay = 0) {
  const [ref, inView] = useInView({
    threshold: 0.5,
    rootMargin: "50px",
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [inView, delay]);

  return [ref, shouldAnimate];
}
