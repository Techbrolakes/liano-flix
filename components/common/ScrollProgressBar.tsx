"use client";

import { useEffect, useState, useRef } from "react";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        // Use requestAnimationFrame to optimize performance
        window.requestAnimationFrame(() => {
          // Calculate how far down the page the user has scrolled
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY;
          
          // Calculate scroll percentage
          const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
          
          // Ensure the progress is between 0 and 100
          const clampedProgress = Math.min(Math.max(scrollPercentage, 0), 100);
          
          // Update state
          setScrollProgress(clampedProgress);
          
          // Directly update DOM for immediate visual feedback
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${clampedProgress}%`;
          }
          
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    // Add scroll event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    // Clean up event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent z-50">
      <div 
        ref={progressBarRef}
        className="h-full bg-gradient-to-r from-primary to-purple-500"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
