import { useRef, useEffect, useState, useCallback } from 'react';
import './ScrollSequence.css';

// -- Configuration --
const TOTAL_FRAMES = 196;
const FRAME_DIR = './animation';
const SCROLL_HEIGHT = 6000; // inner spacer height: more = smoother scrubbing

/**
 * Build the path for frame N.
 * Frames at /public/animation/frame_000_delay-0.03s.gif ... frame_195_delay-0.03s.gif
 */
function getFramePath(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `${FRAME_DIR}/frame_${padded}_delay-0.03s.gif`;
}

// -- Component --
interface ScrollSequenceProps {
  className?: string;
}

export function ScrollSequence({ className = '' }: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // -- Draw a specific frame onto the canvas --
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[frameIndex];
    if (!canvas || !ctx || !img) return;

    // Match canvas bitmap to CSS size x devicePixelRatio for sharp rendering
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // Cover-fit the image (CSS object-fit: cover equivalent)
    const imgAspect = img.width / img.height;
    const canAspect = w / h;
    let dw: number, dh: number, dx: number, dy: number;

    if (imgAspect > canAspect) {
      dh = h;
      dw = dh * imgAspect;
      dx = (w - dw) / 2;
      dy = 0;
    } else {
      dw = w;
      dh = dw / imgAspect;
      dx = 0;
      dy = (h - dh) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // -- Preload all frames --
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const loadImage = (i: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          images[i] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load frame ${i}`);
          loadedCount++;
          resolve();
        };
        img.src = getFramePath(i);
      });

    // Load first frame fast, then batch the rest
    loadImage(0).then(() => {
      imagesRef.current = images;
      drawFrame(0);

      const loadRemaining = async () => {
        const BATCH = 15;
        for (let i = 1; i < TOTAL_FRAMES; i += BATCH) {
          const batch: Promise<void>[] = [];
          for (let j = i; j < Math.min(i + BATCH, TOTAL_FRAMES); j++) {
            batch.push(loadImage(j));
          }
          await Promise.all(batch);
          imagesRef.current = images;
        }
        setIsLoading(false);
      };
      loadRemaining();
    });
  }, [drawFrame]);

  // -- Map container scrollTop to frame index --
  //
  //   frameIndex = floor( (scrollTop / maxScroll) * (TOTAL_FRAMES - 1) )
  //
  //   maxScroll = scrollHeight - clientHeight
  //
  //   scrollTop = 0        -> frame 0   (first)
  //   scrollTop = maxScroll -> frame 195 (last)
  //
  //   Scroll up   = rewind  (earlier frames)
  //   Scroll down = forward (later frames)
  //
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll <= 0) return;

        const progress = scrollTop / maxScroll; // 0 to 1
        const frameIndex = Math.min(
          Math.floor(progress * (TOTAL_FRAMES - 1)),
          TOTAL_FRAMES - 1,
        );

        if (frameIndex !== currentFrameRef.current && imagesRef.current[frameIndex]) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  // -- Resize handler --
  useEffect(() => {
    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame]);

  // -- Render --
  return (
    <div className={`scroll-sequence-wrapper ${className}`}>
      <h2 className="scroll-sequence-title">Scroll to Explore</h2>
      <p className="scroll-sequence-subtitle">
        Scroll inside the frame below to scrub through the animation
      </p>

      {/* Outer "video frame" border */}
      <div className="scroll-sequence-frame">
        {/*
          Scrollable container: fixed height, overflow-y scroll.
          A tall spacer creates the scroll range.
          The canvas is position: sticky so it stays visible while
          the user scrolls through the spacer.
        */}
        <div ref={containerRef} className="scroll-sequence-container">
          <canvas ref={canvasRef} className="scroll-sequence-canvas" />
          <div
            className="scroll-sequence-spacer"
            style={{ height: `${SCROLL_HEIGHT}px` }}
          />
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="scroll-sequence-loading">
            <div className="scroll-sequence-spinner" />
            <span className="scroll-sequence-loading-text">
              Loading frames... {loadProgress}%
            </span>
            <div className="scroll-sequence-progress-bar">
              <div
                className="scroll-sequence-progress-fill"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scroll hint (visible after loading) */}
        {!isLoading && (
          <div className="scroll-sequence-scroll-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
            </svg>
            <span>Scroll inside</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
