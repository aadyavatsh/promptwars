import React, { useEffect, useRef } from 'react';
import { LivingNetworkConfig } from '../../types';

interface LivingNetworkProps extends LivingNetworkConfig {
  theme?: 'light' | 'dark';
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  colorType: 'blue' | 'purple' | 'pink' | 'emerald';
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  isAnchor: boolean;
  roleLabel?: string;
  clusterId?: number;
  targetX?: number;
  targetY?: number;
}

interface ActiveMatch {
  nodeA: Node;
  nodeB: Node;
  progress: number; // 0 to 1
  duration: number;
  startTime: number;
}

export const LivingNetwork: React.FC<LivingNetworkProps> = ({
  variant = 'default',
  intensity = 0.85,
  nodeCount,
  connectionDistance,
  speed = 0.65,
  opacity = 1,
  interactive = true,
  clusterMode = 'normal',
  pulseSignal = 0,
  theme = 'light',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const activeMatchesRef = useRef<ActiveMatch[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const themeRef = useRef<'light' | 'dark'>(theme);
  const reducedMotionRef = useRef<boolean>(false);
  const pulseTriggerRef = useRef<number>(pulseSignal);

  themeRef.current = theme;

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Handle pulse signal updates (e.g. search filter applied or team built)
  useEffect(() => {
    if (pulseSignal !== pulseTriggerRef.current) {
      pulseTriggerRef.current = pulseSignal;
      // Reorganize / jolt nodes gently
      if (nodesRef.current.length > 0) {
        const width = canvasRef.current?.width || window.innerWidth;
        const height = canvasRef.current?.height || window.innerHeight;

        nodesRef.current.forEach((node) => {
          node.vx += (Math.random() - 0.5) * 1.5;
          node.vy += (Math.random() - 0.5) * 1.5;
          node.alpha = Math.min(1, node.baseAlpha * 2);

          if (clusterMode === 'central-project') {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 220;
            node.targetX = width / 2 + Math.cos(angle) * dist;
            node.targetY = height / 2 + Math.sin(angle) * dist;
          } else if (clusterMode === 'campus-clusters') {
            const clusterCenters = [
              { x: width * 0.25, y: height * 0.35 },
              { x: width * 0.75, y: height * 0.4 },
              { x: width * 0.5, y: height * 0.75 },
            ];
            const chosen = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
            node.targetX = chosen.x + (Math.random() - 0.5) * 220;
            node.targetY = chosen.y + (Math.random() - 0.5) * 200;
          }
        });

        // Trigger 2 instant organic matches
        if (nodesRef.current.length >= 4) {
          const idx1 = Math.floor(Math.random() * nodesRef.current.length);
          const idx2 = (idx1 + 5) % nodesRef.current.length;
          activeMatchesRef.current.push({
            nodeA: nodesRef.current[idx1],
            nodeB: nodesRef.current[idx2],
            progress: 0,
            duration: 180,
            startTime: Date.now(),
          });
        }
      }
    }
  }, [pulseSignal, clusterMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    // Determine target node count based on screen width and variant
    const getCalculatedNodeCount = () => {
      if (nodeCount) return nodeCount;
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      let count = 85;
      if (variant === 'landing') count = 105;
      else if (variant === 'builder') count = 75;
      else if (variant === 'dashboard') count = 55;
      else if (variant === 'minimal') count = 35;
      else if (variant === 'explorer') count = 90;

      if (isMobile) count = Math.round(count * 0.4);
      else if (isTablet) count = Math.round(count * 0.7);

      return Math.max(20, count);
    };

    // Initialize nodes
    const totalNodes = getCalculatedNodeCount();
    const colors: ('blue' | 'purple' | 'pink' | 'emerald')[] = [
      'blue', 'blue', 'blue', 'purple', 'purple', 'purple', 'emerald', 'pink'
    ];

    const roles = ['Frontend', 'Backend', 'AI/ML', 'UI/UX', 'FullStack', 'DevOps', 'Mobile'];

    const newNodes: Node[] = [];
    for (let i = 0; i < totalNodes; i++) {
      const isAnchor = i % 7 === 0;
      const baseRadius = isAnchor ? 4.5 + Math.random() * 2.5 : 2 + Math.random() * 2;
      const colorType = colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = isAnchor ? 0.45 + Math.random() * 0.35 : 0.18 + Math.random() * 0.3;

      let initX = Math.random() * width;
      let initY = Math.random() * height;

      if (clusterMode === 'central-project') {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 280;
        initX = width / 2 + Math.cos(angle) * dist;
        initY = height / 2 + Math.sin(angle) * dist;
      }

      newNodes.push({
        x: initX,
        y: initY,
        vx: (Math.random() - 0.5) * speed * 0.6,
        vy: (Math.random() - 0.5) * speed * 0.6,
        baseRadius,
        radius: baseRadius,
        colorType,
        alpha: baseAlpha,
        baseAlpha,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        isAnchor,
        roleLabel: isAnchor ? roles[i % roles.length] : undefined,
        clusterId: Math.floor(Math.random() * 3),
      });
    }

    nodesRef.current = newNodes;

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouch = () => {
      // Disable mouse interaction on mobile touch
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouch, { passive: true });

    const handleResize = () => {
      updateSize();
    };

    window.addEventListener('resize', handleResize);

    // Color definitions
    const getColorRgb = (colorType: 'blue' | 'purple' | 'pink' | 'emerald', isDark: boolean) => {
      if (isDark) {
        switch (colorType) {
          case 'blue': return '96, 165, 250'; // blue-400
          case 'purple': return '167, 139, 250'; // purple-400
          case 'pink': return '244, 114, 182'; // pink-400
          case 'emerald': return '52, 211, 153'; // emerald-400
        }
      } else {
        switch (colorType) {
          case 'blue': return '37, 99, 235'; // blue-600
          case 'purple': return '124, 58, 237'; // purple-600
          case 'pink': return '219, 39, 119'; // pink-600
          case 'emerald': return '5, 150, 105'; // emerald-600
        }
      }
    };

    const maxDist = connectionDistance || (width < 640 ? 90 : 130);
    const maxDistSq = maxDist * maxDist;

    let lastMatchSpawnTime = Date.now();

    // Render loop
    const render = () => {
      const isDark = themeRef.current === 'dark';
      const isReducedMotion = reducedMotionRef.current;

      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Randomly spawn organic teammate connection match every 4-8 seconds
      const now = Date.now();
      if (!isReducedMotion && now - lastMatchSpawnTime > 5500 && nodes.length > 5) {
        lastMatchSpawnTime = now;
        const aIdx = Math.floor(Math.random() * nodes.length);
        let bestB: Node | null = null;
        let bestDistSq = Infinity;

        for (let j = 0; j < nodes.length; j++) {
          if (aIdx === j) continue;
          const dx = nodes[aIdx].x - nodes[j].x;
          const dy = nodes[aIdx].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 2500 && d2 < maxDistSq * 1.5 && d2 < bestDistSq) {
            bestDistSq = d2;
            bestB = nodes[j];
          }
        }

        if (bestB) {
          activeMatchesRef.current.push({
            nodeA: nodes[aIdx],
            nodeB: bestB,
            progress: 0,
            duration: 140, // frames
            startTime: now,
          });
        }
      }

      // Update and draw active matches (illuminating synergy lines)
      for (let i = activeMatchesRef.current.length - 1; i >= 0; i--) {
        const match = activeMatchesRef.current[i];
        match.progress += 1 / match.duration;

        if (match.progress >= 1) {
          activeMatchesRef.current.splice(i, 1);
          continue;
        }

        // Sinusoidal glow curve (0 -> 1 -> 0)
        const glowFactor = Math.sin(match.progress * Math.PI);
        const lineAlpha = glowFactor * (isDark ? 0.65 : 0.45) * intensity;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(match.nodeA.x, match.nodeA.y);
        ctx.lineTo(match.nodeB.x, match.nodeB.y);
        ctx.strokeStyle = isDark
          ? `rgba(147, 197, 253, ${lineAlpha})`
          : `rgba(79, 70, 229, ${lineAlpha})`;
        ctx.lineWidth = 1.2 + glowFactor * 1.2;
        ctx.stroke();

        // Glowing mid-point pulse
        const midX = (match.nodeA.x + match.nodeB.x) / 2;
        const midY = (match.nodeA.y + match.nodeB.y) / 2;
        const pulseR = 3 + glowFactor * 5;

        const grad = ctx.createRadialGradient(midX, midY, 0, midX, midY, pulseR * 2.5);
        grad.addColorStop(0, isDark ? `rgba(167, 139, 250, ${glowFactor * 0.8})` : `rgba(99, 102, 241, ${glowFactor * 0.6})`);
        grad.addColorStop(1, 'rgba(167, 139, 250, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(midX, midY, pulseR * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (!isReducedMotion) {
          // Organic drift
          n.pulsePhase += n.pulseSpeed;

          // Target attraction if rearranging or in special cluster mode
          if (n.targetX !== undefined && n.targetY !== undefined) {
            n.x += (n.targetX - n.x) * 0.03;
            n.y += (n.targetY - n.y) * 0.03;
            if (Math.hypot(n.targetX - n.x, n.targetY - n.y) < 5) {
              n.targetX = undefined;
              n.targetY = undefined;
            }
          } else {
            // Gentle wandering harmonic forces
            n.x += n.vx + Math.sin(n.pulsePhase) * 0.15;
            n.y += n.vy + Math.cos(n.pulsePhase) * 0.15;
          }

          // Soft screen wrapping with padding
          const pad = 40;
          if (n.x < -pad) n.x = width + pad;
          if (n.x > width + pad) n.x = -pad;
          if (n.y < -pad) n.y = height + pad;
          if (n.y > height + pad) n.y = -pad;

          // Subtle mouse attraction / repulsion (only if within 140px)
          if (mouse.active) {
            const mdx = n.x - mouse.x;
            const mdy = n.y - mouse.y;
            const mDist = Math.hypot(mdx, mdy);
            if (mDist < 130 && mDist > 5) {
              const force = (130 - mDist) / 130;
              // Gentle float towards cursor
              n.x -= (mdx / mDist) * force * 0.8;
              n.y -= (mdy / mDist) * force * 0.8;
              n.alpha = Math.min(1, n.baseAlpha + force * 0.4);
            }
          }
        }
      }

      // Draw connection lines
      ctx.lineWidth = 0.65;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const distRatio = 1 - Math.sqrt(distSq) / maxDist;
            const baseLineAlpha = distRatio * distRatio * (isDark ? 0.22 : 0.14) * intensity;

            if (baseLineAlpha > 0.01) {
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = isDark
                ? `rgba(147, 197, 253, ${baseLineAlpha})`
                : `rgba(99, 102, 241, ${baseLineAlpha})`;
              ctx.stroke();
            }
          }
        }

        // Draw line from mouse to very close nodes
        if (mouse.active && !isReducedMotion) {
          const mdx = n1.x - mouse.x;
          const mdy = n1.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 110) {
            const mAlpha = (1 - mDist / 110) * (isDark ? 0.4 : 0.28) * intensity;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n1.x, n1.y);
            ctx.strokeStyle = isDark
              ? `rgba(167, 139, 250, ${mAlpha})`
              : `rgba(79, 70, 229, ${mAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const rgb = getColorRgb(n.colorType, isDark);
        const pulse = isReducedMotion ? 1 : 1 + Math.sin(n.pulsePhase) * 0.2;
        const currentR = Math.max(1.5, n.baseRadius * pulse);
        const effectiveAlpha = Math.min(1, n.alpha * intensity);

        // Halo glow for anchor nodes
        if (n.isAnchor && effectiveAlpha > 0.1) {
          const haloRadius = currentR * (isDark ? 3.5 : 2.8);
          const haloGrad = ctx.createRadialGradient(n.x, n.y, currentR * 0.5, n.x, n.y, haloRadius);
          haloGrad.addColorStop(0, `rgba(${rgb}, ${effectiveAlpha * (isDark ? 0.45 : 0.25)})`);
          haloGrad.addColorStop(1, `rgba(${rgb}, 0)`);

          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(n.x, n.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Solid core
        ctx.fillStyle = `rgba(${rgb}, ${effectiveAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentR, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, intensity, nodeCount, connectionDistance, speed, interactive, clusterMode]);

  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* Subtle radial vignette/fade mask to ensure content readability */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 dark:opacity-60" />
    </div>
  );
};
