import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Activity } from 'lucide-react';

/**
 * SynapseCore3D
 * Compact interactive 3D WebGL widget.
 * Renders an interactive 3D holographic neural lattice sphere with orbital rings.
 * Users can drag to rotate the 3D model, and it responds with cybernetic glow effects.
 */
export default function SynapseCore3D({ metrics, isDemoMode }) {
  const mountRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 110;
    const height = 110;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Polyhedral Core
    const coreGeo = new THREE.DodecahedronGeometry(5.2, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7, // Neon Purple
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(3.0, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc, // Hyper Violet
      transparent: true,
      opacity: 0.85,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    group.add(inner);

    // 2. Dual Concentric Cyber Rings
    const ring1Geo = new THREE.TorusGeometry(7.2, 0.14, 8, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(8.4, 0.12, 8, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 3. Orbiting Data Points
    const pointsCount = 32;
    const pointsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 6.5 + Math.random() * 2.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({
      color: 0x00e5ff, // Cyan data packets
      size: 0.5,
      transparent: true,
      opacity: 0.9,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    group.add(points);

    // Drag / Touch Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      group.rotation.y += deltaX * 0.03;
      group.rotation.x += deltaY * 0.03;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const speed = hovered ? 2.5 : 1.0;

      core.rotation.y += delta * 0.6 * speed;
      core.rotation.x += delta * 0.3 * speed;

      inner.rotation.y -= delta * 0.8 * speed;

      ring1.rotation.z += delta * 0.7 * speed;
      ring2.rotation.y += delta * 0.5 * speed;

      points.rotation.y += delta * 0.4 * speed;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
    };
  }, [hovered]);

  return (
    <div 
      className="relative flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-obsidian-900/80 border border-purple-500/30 backdrop-blur-xl shadow-lg shadow-purple-950/50 hover:border-purple-400/60 transition-all duration-300 group cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Interactive 3D Holographic Core - Click and drag to rotate!"
    >
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-[58px] h-[58px] flex items-center justify-center relative z-10"
      />

      {/* Holographic Pulse Glow behind the 3D orb */}
      <div className="absolute left-3 top-2 w-12 h-12 bg-purple-600/25 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/40 transition-all" />

      {/* 3D Core Status Text */}
      <div className="flex flex-col pr-1 select-none">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider text-purple-300">
          <Activity className="w-3 h-3 text-synapse-purple animate-pulse" />
          <span>3D QUANTUM CORE</span>
        </div>
        <div className="text-xs font-bold text-white flex items-center gap-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-300 to-white">
            {metrics?.tokens_per_second ? `${metrics.tokens_per_second} tok/s` : '165.3 tok/s'}
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
            H100
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-nvidia-green animate-ping inline-block" />
          <span>Synced • Drag 3D</span>
        </span>
      </div>
    </div>
  );
}
