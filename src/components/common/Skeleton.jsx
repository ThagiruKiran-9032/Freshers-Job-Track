import React from 'react';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '', style = {} }) => {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};
