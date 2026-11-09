'use client';

import React from 'react';

export default function WebGLHeroCanvas() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0f1115]" />
      <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-[#c89b3c]/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full bg-white/[0.02] blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
