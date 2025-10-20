"use client";
import { useEffect, useRef, useState } from "react";
import "./FadeInUp.scss";

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const FadeInUp = ({ children, delay = 0, duration = 600, className = "" }: FadeInUpProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`fade-in-up ${isVisible ? 'visible' : ''} ${className}`}
      style={{ '--animation-duration': `${duration}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default FadeInUp;
