import React from 'react';

export default function Logo({ width = 300, height = 200, className = '' }) 
{
  return (
    <img
      src="/assets/shama-logo.svg"
      alt="Shama Landscape Architects logo"
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}
