import React from 'react';

export const Container = ({ children, className = '', style = {} }) => {
  return (
    <div className={`container ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};
