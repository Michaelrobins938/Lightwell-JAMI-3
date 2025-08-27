// src/voice-mode/components/NarratorOrb.tsx
import React from 'react';

const NarratorOrb = (props: any) => {
  console.log('NarratorOrb props:', props);
  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: props.coreColor || 'blue',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '2rem',
    }}>
      NarratorOrb
    </div>
  );
};

export default NarratorOrb;