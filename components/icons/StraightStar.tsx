import React from 'react';

interface StraightStarProps {
  size?: number;
  className?: string;
  fill?: string;
}

export const StraightStar: React.FC<StraightStarProps> = ({ size = 24, className = "", fill = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" />
  </svg>
);
