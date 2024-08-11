import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/app/css/pageTransition.css";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`page-transition-wrapper ${!isAnimating ? "animate" : ""}`}>
      {children}
    </div>
  );
};

export default PageTransition;
