import React, { useState } from 'react';

const MaskedText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span 
      className={`cursor-pointer inline-block mx-1 transition-all duration-300 ${revealed ? 'bg-transparent text-current' : 'bg-ash-light text-transparent select-none'}`} 
      onClick={() => setRevealed(true)}
    >
      {children}
    </span>
  );
};
export default MaskedText;
