"use client";
import React from 'react';

interface FolderProps {
  color?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

// Utility to darken hex color
const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({ color = '#5227FF', size = 1, className = '', onClick }) => {
  const folderBackColor = darkenColor(color, 0.08);

  const folderStyle: React.CSSProperties = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
  } as React.CSSProperties;

  const scaleStyle = { transform: `scale(${size})` };

  return (
    <div style={scaleStyle} className={className}>
      <div
        onClick={onClick}
        className="group relative transition-all duration-200 ease-in cursor-pointer hover:-translate-y-2"
        style={folderStyle}
      >
        <div
          className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          {/* Folder Tab */}
          <span
            className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
            style={{ backgroundColor: folderBackColor }}
          ></span>

          {/* Paper Hint (Visual only, suggests content inside) */}
          <div className="absolute z-10 bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[10%] bg-white opacity-20 rounded-t-md group-hover:h-[30%] transition-all duration-300"></div>
          
          {/* Front Flaps */}
          <div
            className="absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out group-hover:[transform:skew(15deg)_scaleY(0.6)]"
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
            }}
          ></div>
          <div
            className="absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out group-hover:[transform:skew(-15deg)_scaleY(0.6)]"
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;