import React from 'react';

export default function Header({ formatMode, setFormatMode }) {
  return (
    <header className="border-b border-[#E5E0D8] bg-[#F4F0E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left Event Masthead */}
        <div className="flex items-center gap-4">
          <div className="font-heading font-extrabold text-2xl tracking-tight text-[#111827]">
            HH GOA <span className="text-[#059669]">2026</span>
          </div>
          <div className="h-4 w-px bg-[#E5E0D8]" />
          <div className="text-xs font-mono font-bold tracking-widest text-[#6B7280]">
            GOA, INDIA · FEB 2026
          </div>
        </div>

        {/* Right Artifact Selector Tabs */}
        <div className="inline-flex bg-[#FAF7F2] p-1 rounded-lg border border-[#E5E0D8]">
          <button
            onClick={() => setFormatMode('PFP')}
            className={`px-4 py-2 rounded-md text-xs font-bold font-mono tracking-wider transition-colors ${
              formatMode === 'PFP'
                ? 'bg-[#111827] text-[#F4F0E7]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            01 / PFP FRAME
          </button>

          <button
            onClick={() => setFormatMode('ID_CARD')}
            className={`px-4 py-2 rounded-md text-xs font-bold font-mono tracking-wider transition-colors ${
              formatMode === 'ID_CARD'
                ? 'bg-[#111827] text-[#F4F0E7]'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            02 / BUILDER ID
          </button>
        </div>

      </div>
    </header>
  );
}
