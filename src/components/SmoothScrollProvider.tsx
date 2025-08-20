import React, { useEffect } from 'react';
import useLenis from '@/hooks/useLenis';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  // Initialize Lenis smooth scrolling
  useLenis();

  useEffect(() => {
    // Disable default scroll behavior on html and body
    const html = document.documentElement;
    const body = document.body;
    
    html.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';
    
    return () => {
      html.style.scrollBehavior = '';
      body.style.scrollBehavior = '';
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;