import React from 'react';
import { RefreshCw } from 'lucide-react';
import { 
  BUILDER_TITLES, STACK_OPTIONS, FRAME_THEMES_A, 
  CARD_THEMES_B, BADGE_ROLE_OPTIONS 
} from '../constants/presetTitles';

export default function FormControls({
  formData,
  setFormData,
  photoState,
  setPhotoState,
  formatMode
}) {

  // Title Generator
  const rollRandomTitle = () => {
    const randomIndex = Math.floor(Math.random() * BUILDER_TITLES.length);
    setFormData(prev => ({
      ...prev,
      builderTitle: BUILDER_TITLES[randomIndex]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoAdjust = (field, value) => {
    setPhotoState(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="space-y-6">

      {/* SECTION 1: BUILDER CREDENTIAL DETAILS */}
      <div className="surface-card p-6 space-y-4">
        <div className="border-b border-[#E5E0D8] pb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-heading">
            {formatMode === 'ID_CARD' ? 'BUILDER CREDENTIAL DETAILS' : 'PFP FRAME DETAILS'}
          </h3>
          <span className="text-[10px] font-mono text-[#6B7280]">02 / DETAILS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NAME */}
          <div>
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5 font-heading">
              NAME
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-md px-3.5 py-2.5 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#111827] focus:bg-white transition-colors"
            />
          </div>

          {/* X HANDLE */}
          <div>
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5 font-heading">
              X / TWITTER HANDLE
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-[#6B7280] text-xs font-mono font-bold">@</span>
              <input
                type="text"
                value={formData.twitterHandle.replace(/^@/, '')}
                onChange={(e) => handleInputChange('twitterHandle', `@${e.target.value.replace(/^@/, '')}`)}
                placeholder="satoshi"
                className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-md pl-8 pr-3.5 py-2.5 text-xs text-[#111827] font-mono font-medium focus:outline-none focus:border-[#111827] focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* STACK / ROLE & BADGE STATUS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5 font-heading">
              STACK / ROLE
            </label>
            <select
              value={formData.stackRole}
              onChange={(e) => handleInputChange('stackRole', e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-md px-3 py-2.5 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#111827] focus:bg-white transition-colors"
            >
              {STACK_OPTIONS.map(stack => (
                <option key={stack} value={stack} className="bg-white text-[#111827]">
                  {stack}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5 font-heading">
              BADGE ROLE STATUS
            </label>
            <div className="flex flex-wrap gap-1.5">
              {BADGE_ROLE_OPTIONS.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleInputChange('badgeRole', b.id)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold font-mono transition-colors ${
                    formData.badgeRole === b.id
                      ? 'bg-[#111827] text-[#F4F0E7]'
                      : 'bg-[#FAF7F2] text-[#6B7280] hover:text-[#111827] border border-[#E5E0D8]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BUILDER TITLE GENERATOR */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider font-heading">
              BUILDER TITLE
            </label>
            <button
              type="button"
              onClick={rollRandomTitle}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] hover:underline font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>GENERATE ANOTHER ↻</span>
            </button>
          </div>
          <input
            type="text"
            value={formData.builderTitle}
            onChange={(e) => handleInputChange('builderTitle', e.target.value)}
            placeholder="Product Hacker"
            className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-md px-3.5 py-2.5 text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#059669] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* SECTION 2: COLOR SCHEME */}
      <div className="surface-card p-6 space-y-3">
        <div className="border-b border-[#E5E0D8] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-heading">
            COLOR PALETTE
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {formatMode === 'PFP' ? (
            FRAME_THEMES_A.map(theme => (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleInputChange('themeStyle', theme.id)}
                className={`p-3 rounded-md border text-left transition-colors ${
                  (formData.themeStyle === theme.id || (!FRAME_THEMES_A.some(t => t.id === formData.themeStyle) && theme.id === 'emerald_goa'))
                    ? 'border-[#111827] bg-[#111827] text-[#F4F0E7]'
                    : 'border-[#E5E0D8] bg-[#FAF7F2] text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: theme.primaryColor }} />
                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: theme.secondaryColor }} />
                </div>
                <p className="text-xs font-bold truncate font-heading">{theme.name}</p>
              </button>
            ))
          ) : (
            CARD_THEMES_B.map(theme => (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleInputChange('themeStyle', theme.id)}
                className={`p-3 rounded-md border text-left transition-colors ${
                  (formData.themeStyle === theme.id || (!CARD_THEMES_B.some(t => t.id === formData.themeStyle) && theme.id === 'ivory_navy'))
                    ? 'border-[#111827] bg-[#111827] text-[#F4F0E7]'
                    : 'border-[#E5E0D8] bg-[#FAF7F2] text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <div className="w-full h-2 rounded-sm mb-1.5" style={{ backgroundColor: theme.accentColor }} />
                <p className="text-xs font-bold truncate font-heading">{theme.name}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* SECTION 3: PHOTO FINE-TUNING */}
      <div className="surface-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-heading">
            PHOTO FINE-TUNING
          </h3>
          <button
            type="button"
            onClick={() => setPhotoState({ scale: 1, offsetX: 0, offsetY: 0, rotate: 0, brightness: 100, contrast: 100 })}
            className="text-[11px] font-semibold text-[#6B7280] hover:text-[#111827] underline"
          >
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scale */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#6B7280] mb-1">
              <span>Scale / Zoom</span>
              <span className="font-mono">{Math.round(photoState.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={photoState.scale}
              onChange={(e) => handlePhotoAdjust('scale', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#6B7280] mb-1">
              <span>Rotation</span>
              <span className="font-mono">{photoState.rotate}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={photoState.rotate}
              onChange={(e) => handlePhotoAdjust('rotate', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Offset X */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#6B7280] mb-1">
              <span>Horizontal Offset (X)</span>
              <span className="font-mono">{photoState.offsetX}px</span>
            </div>
            <input
              type="range"
              min="-250"
              max="250"
              step="5"
              value={photoState.offsetX}
              onChange={(e) => handlePhotoAdjust('offsetX', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Offset Y */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#6B7280] mb-1">
              <span>Vertical Offset (Y)</span>
              <span className="font-mono">{photoState.offsetY}px</span>
            </div>
            <input
              type="range"
              min="-250"
              max="250"
              step="5"
              value={photoState.offsetY}
              onChange={(e) => handlePhotoAdjust('offsetY', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
