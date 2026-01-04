"use client";
import React, { useState, useEffect } from 'react';

export const ChannelAvatar = ({ 
  url, 
  name 
}: { 
  url: string | null, 
  name: string 
}) => {
  // Logic: Try the real URL first. If it's missing, use the generator.
  const [src, setSrc] = useState(
    url || `https://ui-avatars.com/api/?name=${name}&background=111&color=fff`
  );

  useEffect(() => {
    // If the prop changes (e.g. real-time update), update the state
    setSrc(url || `https://ui-avatars.com/api/?name=${name}&background=111&color=fff`);
  }, [url, name]);

  return (
    <img 
      src={src} 
      alt={name}
      className="w-full h-full object-cover"
      // This is the event handler that requires "use client"
      onError={() => {
        setSrc(`https://ui-avatars.com/api/?name=${name}&background=111&color=fff`);
      }}
    />
  );
};