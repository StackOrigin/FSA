import { useRef, useEffect, useState, useCallback } from 'react';

// Frame file mapping - generated from actual file names
const FRAME_FILES = [
  'frame_000_delay-0.04s.gif',
  'frame_001_delay-0.04s.gif',
  'frame_002_delay-0.05s.gif',
  'frame_003_delay-0.04s.gif',
  'frame_004_delay-0.04s.gif',
  'frame_005_delay-0.04s.gif',
  'frame_006_delay-0.04s.gif',
  'frame_007_delay-0.04s.gif',
  'frame_008_delay-0.05s.gif',
  'frame_009_delay-0.04s.gif',
  'frame_010_delay-0.04s.gif',
  'frame_011_delay-0.04s.gif',
  'frame_012_delay-0.04s.gif',
  'frame_013_delay-0.04s.gif',
  'frame_014_delay-0.05s.gif',
  'frame_015_delay-0.04s.gif',
  'frame_016_delay-0.04s.gif',
  'frame_017_delay-0.04s.gif',
  'frame_018_delay-0.04s.gif',
  'frame_019_delay-0.04s.gif',
  'frame_020_delay-0.05s.gif',
  'frame_021_delay-0.04s.gif',
  'frame_022_delay-0.04s.gif',
  'frame_023_delay-0.04s.gif',
  'frame_024_delay-0.04s.gif',
  'frame_025_delay-0.04s.gif',
  'frame_026_delay-0.05s.gif',
  'frame_027_delay-0.04s.gif',
  'frame_028_delay-0.04s.gif',
  'frame_029_delay-0.04s.gif',
  'frame_030_delay-0.04s.gif',
  'frame_031_delay-0.04s.gif',
  'frame_032_delay-0.05s.gif',
  'frame_033_delay-0.04s.gif',
  'frame_034_delay-0.04s.gif',
  'frame_035_delay-0.04s.gif',
  'frame_036_delay-0.04s.gif',
  'frame_037_delay-0.04s.gif',
  'frame_038_delay-0.05s.gif',
  'frame_039_delay-0.04s.gif',
  'frame_040_delay-0.04s.gif',
  'frame_041_delay-0.04s.gif',
  'frame_042_delay-0.04s.gif',
  'frame_043_delay-0.04s.gif',
  'frame_044_delay-0.05s.gif',
  'frame_045_delay-0.04s.gif',
  'frame_046_delay-0.04s.gif',
  'frame_047_delay-0.04s.gif',
  'frame_048_delay-0.04s.gif',
  'frame_049_delay-0.04s.gif',
  'frame_050_delay-0.05s.gif',
  'frame_051_delay-0.04s.gif',
  'frame_052_delay-0.04s.gif',
  'frame_053_delay-0.04s.gif',
  'frame_054_delay-0.04s.gif',
  'frame_055_delay-0.04s.gif',
  'frame_056_delay-0.05s.gif',
  'frame_057_delay-0.04s.gif',
  'frame_058_delay-0.04s.gif',
  'frame_059_delay-0.04s.gif',
  'frame_060_delay-0.04s.gif',
  'frame_061_delay-0.04s.gif',
  'frame_062_delay-0.05s.gif',
  'frame_063_delay-0.04s.gif',
  'frame_064_delay-0.04s.gif',
  'frame_065_delay-0.04s.gif',
  'frame_066_delay-0.04s.gif',
  'frame_067_delay-0.04s.gif',
  'frame_068_delay-0.05s.gif',
  'frame_069_delay-0.04s.gif',
  'frame_070_delay-0.04s.gif',
  'frame_071_delay-0.04s.gif',
  'frame_072_delay-0.04s.gif',
  'frame_073_delay-0.04s.gif',
  'frame_074_delay-0.05s.gif',
  'frame_075_delay-0.04s.gif',
  'frame_076_delay-0.04s.gif',
  'frame_077_delay-0.04s.gif',
  'frame_078_delay-0.04s.gif',
  'frame_079_delay-0.04s.gif',
  'frame_080_delay-0.05s.gif',
  'frame_081_delay-0.04s.gif',
  'frame_082_delay-0.04s.gif',
  'frame_083_delay-0.04s.gif',
  'frame_084_delay-0.04s.gif',
  'frame_085_delay-0.04s.gif',
  'frame_086_delay-0.05s.gif',
  'frame_087_delay-0.04s.gif',
  'frame_088_delay-0.04s.gif',
  'frame_089_delay-0.04s.gif',
  'frame_090_delay-0.04s.gif',
  'frame_091_delay-0.04s.gif',
  'frame_092_delay-0.05s.gif',
  'frame_093_delay-0.04s.gif',
  'frame_094_delay-0.04s.gif',
  'frame_095_delay-0.04s.gif',
  'frame_096_delay-0.04s.gif',
  'frame_097_delay-0.04s.gif',
  'frame_098_delay-0.05s.gif',
  'frame_099_delay-0.04s.gif',
  'frame_100_delay-0.04s.gif',
  'frame_101_delay-0.04s.gif',
  'frame_102_delay-0.04s.gif',
  'frame_103_delay-0.04s.gif',
  'frame_104_delay-0.05s.gif',
  'frame_105_delay-0.04s.gif',
  'frame_106_delay-0.04s.gif',
  'frame_107_delay-0.04s.gif',
  'frame_108_delay-0.04s.gif',
  'frame_109_delay-0.04s.gif',
  'frame_110_delay-0.05s.gif',
  'frame_111_delay-0.04s.gif',
  'frame_112_delay-0.04s.gif',
  'frame_113_delay-0.04s.gif',
  'frame_114_delay-0.04s.gif',
  'frame_115_delay-0.04s.gif',
  'frame_116_delay-0.05s.gif',
  'frame_117_delay-0.04s.gif',
  'frame_118_delay-0.04s.gif',
  'frame_119_delay-0.04s.gif',
  'frame_120_delay-0.04s.gif',
  'frame_121_delay-0.04s.gif',
  'frame_122_delay-0.05s.gif',
  'frame_123_delay-0.04s.gif',
  'frame_124_delay-0.04s.gif',
  'frame_125_delay-0.04s.gif',
  'frame_126_delay-0.04s.gif',
  'frame_127_delay-0.04s.gif',
  'frame_128_delay-0.05s.gif',
  'frame_129_delay-0.04s.gif',
  'frame_130_delay-0.04s.gif',
  'frame_131_delay-0.04s.gif',
  'frame_132_delay-0.04s.gif',
  'frame_133_delay-0.04s.gif',
  'frame_134_delay-0.05s.gif',
  'frame_135_delay-0.04s.gif',
  'frame_136_delay-0.04s.gif',
  'frame_137_delay-0.04s.gif',
  'frame_138_delay-0.04s.gif',
  'frame_139_delay-0.04s.gif',
  'frame_140_delay-0.05s.gif',
  'frame_141_delay-0.04s.gif',
  'frame_142_delay-0.04s.gif',
  'frame_143_delay-0.04s.gif',
  'frame_144_delay-0.04s.gif',
  'frame_145_delay-0.04s.gif',
  'frame_146_delay-0.05s.gif',
  'frame_147_delay-0.04s.gif',
  'frame_148_delay-0.04s.gif',
  'frame_149_delay-0.04s.gif',
  'frame_150_delay-0.04s.gif',
  'frame_151_delay-0.04s.gif',
  'frame_152_delay-0.05s.gif',
  'frame_153_delay-0.04s.gif',
  'frame_154_delay-0.04s.gif',
  'frame_155_delay-0.04s.gif',
  'frame_156_delay-0.04s.gif',
  'frame_157_delay-0.04s.gif',
  'frame_158_delay-0.05s.gif',
  'frame_159_delay-0.04s.gif',
  'frame_160_delay-0.04s.gif',
  'frame_161_delay-0.04s.gif',
  'frame_162_delay-0.04s.gif',
  'frame_163_delay-0.04s.gif',
  'frame_164_delay-0.05s.gif',
  'frame_165_delay-0.04s.gif',
  'frame_166_delay-0.04s.gif',
  'frame_167_delay-0.04s.gif',
  'frame_168_delay-0.04s.gif',
  'frame_169_delay-0.04s.gif',
  'frame_170_delay-0.05s.gif',
  'frame_171_delay-0.04s.gif',
  'frame_172_delay-0.04s.gif',
  'frame_173_delay-0.04s.gif',
  'frame_174_delay-0.04s.gif',
  'frame_175_delay-0.04s.gif',
  'frame_176_delay-0.05s.gif',
  'frame_177_delay-0.04s.gif',
  'frame_178_delay-0.04s.gif',
  'frame_179_delay-0.04s.gif',
  'frame_180_delay-0.04s.gif',
  'frame_181_delay-0.04s.gif',
  'frame_182_delay-0.05s.gif',
  'frame_183_delay-0.04s.gif',
  'frame_184_delay-0.04s.gif',
  'frame_185_delay-0.04s.gif',
  'frame_186_delay-0.04s.gif',
  'frame_187_delay-0.04s.gif',
  'frame_188_delay-0.05s.gif',
  'frame_189_delay-0.04s.gif',
  'frame_190_delay-0.04s.gif',
  'frame_191_delay-0.04s.gif',
];

const TOTAL_FRAMES = FRAME_FILES.length;

interface ScrollSequenceProps {
  className?: string;
}

export function ScrollSequence({ className = '' }: ScrollSequenceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const progressRef = useRef(0);
  const isLockedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Draw frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[frameIndex];

    if (!canvas || !ctx || !img) return;

    // Set canvas size
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // Draw image centered and covering the canvas
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Preload images progressively
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          images[index] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load frame ${index}`);
          resolve();
        };
        img.src = `/animation/${FRAME_FILES[index]}`;
      });
    };

    loadImage(0).then(() => {
      imagesRef.current = images;
      drawFrame(0);
      setIsLoading(false);
    });

    const loadRemainingFrames = async () => {
      const batchSize = 10;
      for (let i = 1; i < TOTAL_FRAMES; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
        imagesRef.current = [...images];
      }
    };

    loadRemainingFrames();
  }, [drawFrame]);

  // Handle wheel events for animation control
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || isLoading) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if wrapper is in view (visible in viewport)
      const isInView = rect.top < viewportHeight && rect.bottom > 0;
      
      // Activate when scrolling down into the section (section top is approaching viewport center)
      const isEnteringFromTop = rect.top <= viewportHeight * 0.5 && rect.top > -viewportHeight * 0.5;
      
      // Already locked - handle animation
      if (isLockedRef.current) {
        e.preventDefault();
        
        // Update progress based on wheel delta
        const sensitivity = 0.003;
        progressRef.current = Math.max(0, Math.min(1, progressRef.current + e.deltaY * sensitivity));
        setScrollProgress(progressRef.current);
        
        // Draw the appropriate frame
        const frameIndex = Math.min(
          Math.floor(progressRef.current * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );
        
        if (frameIndex !== currentFrameRef.current && imagesRef.current[frameIndex]) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
        
        // Unlock when complete (scrolling down at end) - mark as completed so it won't replay
        if (progressRef.current >= 1 && e.deltaY > 0) {
          isLockedRef.current = false;
          hasCompletedRef.current = true;
          document.body.style.overflow = '';
          setIsActive(false);
          setHasCompleted(true);
        }
        // Allow scrolling back up at start (but don't mark as completed)
        if (progressRef.current <= 0 && e.deltaY < 0) {
          isLockedRef.current = false;
          document.body.style.overflow = '';
          setIsActive(false);
        }
        return;
      }
      
      // Not locked yet - check if we should activate (only if not already completed)
      if (isInView && isEnteringFromTop && e.deltaY > 0 && !hasCompletedRef.current) {
        // Scrolling down into the section - lock and start animation
        e.preventDefault();
        isLockedRef.current = true;
        document.body.style.overflow = 'hidden';
        setIsActive(true);
        progressRef.current = 0;
        currentFrameRef.current = 0;
        drawFrame(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = '';
    };
  }, [isLoading, drawFrame]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Cleanup
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Wrapper styles - always visible, 100vh height
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    background: '#000',
    overflow: 'hidden',
  };

  // Canvas styles
  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease',
  };

  return (
    <div ref={wrapperRef} className={className} style={wrapperStyle}>
      {/* Canvas shows animation frames */}
      <canvas ref={canvasRef} style={canvasStyle} />
      
      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'white' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span>Loading experience... {loadProgress}%</span>
          </div>
        </div>
      )}

      {/* Scroll hint - only when active */}
      {!isLoading && isActive && (
        <>
          <div style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white',
            opacity: 0.8,
            zIndex: 20,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            <span>Scroll to explore</span>
          </div>
          
          {/* Progress bar */}
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '9999px',
            overflow: 'hidden',
            zIndex: 20,
          }}>
            <div style={{
              height: '100%',
              width: `${scrollProgress * 100}%`,
              background: 'white',
              borderRadius: '9999px',
              transition: 'width 0.05s linear',
            }} />
          </div>
        </>
      )}

      {/* Idle hint - when visible but not yet active and not completed */}
      {!isLoading && !isActive && !hasCompleted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          color: 'white',
          textAlign: 'center',
          zIndex: 20,
          pointerEvents: 'none',
        }}>
          <div style={{
            animation: 'bounce 1.5s infinite',
            opacity: 0.9,
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Scroll down to start experience</span>
        </div>
      )}
    </div>
  );
}

