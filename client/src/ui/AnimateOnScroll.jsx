import React, { useEffect, useRef, useState } from "react";

/**
 * A reusable component that animates its children when they enter the viewport
 */
const AnimateOnScroll = ({
  children,
  animation = "fade-up",
  threshold = 0.1,
  delay = 0,
  className = "",
  rootMargin = "0px",
  once = true,
}) => {
  const elementRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const currentRef = elementRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay) {
              currentRef.style.transitionDelay = `${delay}ms`;
            }

            currentRef.classList.add("animate-in", animation);
            currentRef.style.opacity = "";
            currentRef.style.transform = "";
            setHasAnimated(true);

            if (once) observer.unobserve(currentRef);
          } else if (!once) {
            currentRef.classList.remove("animate-in", animation);
            currentRef.style.opacity = "0";
            currentRef.style.transform = animation.includes("up")
              ? "translateY(20px)"
              : animation.includes("down")
              ? "translateY(-20px)"
              : animation.includes("left")
              ? "translateX(20px)"
              : animation.includes("right")
              ? "translateX(-20px)"
              : "none";
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animation, threshold, delay, rootMargin, once]);

  return (
    <div
      ref={elementRef}
      className={`animate-on-scroll ${className}`}
      style={{
        opacity: hasAnimated ? undefined : 0,
        transform: hasAnimated
          ? undefined
          : animation.includes("up")
          ? "translateY(20px)"
          : animation.includes("down")
          ? "translateY(-20px)"
          : animation.includes("left")
          ? "translateX(20px)"
          : animation.includes("right")
          ? "translateX(-20px)"
          : "none",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
