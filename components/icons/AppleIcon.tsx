'use client';

interface IconProps {
  className?: string;
  width?: string;
  height?: string;
}

export function AppleIcon({ className = "w-4 h-4", width, height }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path d="M17.05 20.28c-.98.95-2.05.86-3.12.38-1.12-.5-2.16-.51-3.33 0-1.46.64-2.23.53-3.12-.38C3.21 15.89 3.68 8.12 8.52 7.9c1.54.05 2.4.89 3.22.89.8 0 2.3-1.1 3.88-.93 1.53.15 2.7.76 3.46 1.94-3.03 1.83-2.54 5.5.03 6.93-.65 1.4-1.51 2.82-2.06 3.55zm-2.89-17.67c-1.93.11-3.55 1.7-3.97 3.6-.38 1.66.34 3.38 1.26 4.1.43.33 1.02.55 1.71.55.71-.03 1.36-.28 1.9-.64.53-.36.98-.83 1.28-1.36-1.39-.81-2.28-2.29-2.28-3.97 0-.83.25-1.63.7-2.28z"/>
    </svg>
  );
}
