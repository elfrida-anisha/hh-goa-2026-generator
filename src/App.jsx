import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PhotoUploader from './components/PhotoUploader';
import FormControls from './components/FormControls';
import CanvasRenderer from './components/CanvasRenderer';
import ShareModal from './components/ShareModal';
import { SAMPLE_AVATAR, BUILDER_TITLES } from './constants/presetTitles';

export default function App() {
  const [formatMode, setFormatMode] = useState('ID_CARD'); // Format B default
  const [userImage, setUserImage] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Elfrida Anisha',
    twitterHandle: '@elfrida_dev',
    stackRole: 'AI / LLMs / Autonomous Agents',
    badgeRole: 'BUILDER',
    builderTitle: BUILDER_TITLES[0], // Product Hacker
    themeStyle: 'ivory_navy'
  });

  const [photoState, setPhotoState] = useState({
    scale: 1.05,
    offsetX: 0,
    offsetY: -10,
    rotate: 0,
    brightness: 100,
    contrast: 100
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Auto-load sample photo on initial page load
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUserImage(img);
    };
    img.src = SAMPLE_AVATAR;
  }, []);

  const handleResetPhotoAdjustments = () => {
    setPhotoState({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
      brightness: 100,
      contrast: 100
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F4F0E7] text-[#111827] font-sans antialiased selection:bg-[#059669] selection:text-white overflow-hidden">
      
      {/* Visual Signature Background Element */}
      <div className="absolute top-24 right-[-4%] select-none pointer-events-none text-[160px] lg:text-[240px] font-black text-[#111827]/[0.03] font-heading leading-none tracking-tighter hidden sm:block">
        GOA '26
      </div>

      {/* Editorial Header Masthead */}
      <Header formatMode={formatMode} setFormatMode={setFormatMode} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10">

        {/* Hero Introduction */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#111827] text-[#F4F0E7] text-xs font-mono font-bold tracking-widest uppercase">
            <span>CHOOSE YOUR ARTIFACT</span>
            <span className="text-[#059669]">•</span>
            <span className="text-[#059669]">HH GOA 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827] font-heading uppercase leading-[1.05]">
            CREATE YOUR <br />
            <span className="text-[#059669]">BUILDER IDENTITY.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#6B7280] font-medium leading-relaxed max-w-xl">
            Upload a photo, tell us what you build, and leave with something worth putting on your profile.
          </p>
        </div>

        {/* 2-Column Desktop Grid / Stacked Mobile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Upload & Customization Form (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step 1: Upload Photo */}
            <div className="surface-card p-6 space-y-3">
              <div className="border-b border-[#E5E0D8] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-heading">
                    BRING A PHOTO
                  </h3>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Portrait, landscape or anything in between.</p>
                </div>
                <span className="text-[10px] font-mono text-[#6B7280]">01 / UPLOAD</span>
              </div>

              <PhotoUploader
                onImageLoaded={(img) => setUserImage(img)}
                currentImage={userImage}
                onResetImage={handleResetPhotoAdjustments}
              />
            </div>

            {/* Step 2: Customization Details */}
            <FormControls
              formData={formData}
              setFormData={setFormData}
              photoState={photoState}
              setPhotoState={setPhotoState}
              formatMode={formatMode}
            />

          </div>

          {/* Right Column: High-Res Live Preview (6 Cols Sticky on Desktop - Visually Dominant) */}
          <div className="lg:col-span-6 lg:sticky lg:top-8 space-y-4">
            
            <div className="surface-card p-6 text-center space-y-4 bg-white">
              <div className="border-b border-[#E5E0D8] pb-3 flex items-center justify-between text-left">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-heading">
                    EVENT CREDENTIAL PREVIEW
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">High-resolution 1080×1350 px social media artwork</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#059669] uppercase tracking-wider">
                  {formatMode === 'ID_CARD' ? '02 / BUILDER ID' : '01 / PFP FRAME'}
                </span>
              </div>

              {/* Canvas Render Component */}
              <CanvasRenderer
                formatMode={formatMode}
                userImage={userImage}
                formData={formData}
                photoState={photoState}
                setPhotoState={setPhotoState}
                onOpenShareModal={() => setIsShareModalOpen(true)}
              />

            </div>

          </div>

        </div>

      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E5E0D8] py-8 text-center text-xs text-[#6B7280] font-mono space-y-1 mt-16 bg-[#FAF7F2]">
        <p className="font-bold text-[#111827]">HACKER HOUSE GOA 2026 • GOA, INDIA</p>
        <p className="text-[11px] text-[#6B7280]">BUILD · SHIP · SHARE • #FrameInGoa</p>
      </footer>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        formatMode={formatMode}
        formData={formData}
      />

    </div>
  );
}
