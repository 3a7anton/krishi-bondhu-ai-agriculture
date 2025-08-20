import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary' 
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (spinnerRef.current && leafRef.current) {
      // Create spinning animation
      gsap.to(leafRef.current, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1
      });

      // Add pulsing effect
      gsap.to(spinnerRef.current, {
        scale: 1.1,
        duration: 0.8,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });
    }

    return () => {
      gsap.killTweensOf([spinnerRef.current, leafRef.current]);
    };
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white'
  };

  return (
    <div 
      ref={spinnerRef}
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${colorClasses[color]}`}
    >
      <Leaf 
        ref={leafRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default LoadingSpinner;