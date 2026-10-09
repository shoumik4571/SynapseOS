import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Synapse3DScene
 * High-performance 3D WebGL background powered by Three.js.
 * Renders an interactive, floating 3D neural core, rotating gyroscopic cyber-rings,
 * and 1,800 cosmic nebula particles responding to mouse parallax.
 */
export default function Synapse3DScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030014, 0.0018); // Deep obsidian purple fog

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. 3D Objects Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // A. 3D Floating Geometric Neural Core (Icosahedron Wireframe + Inner Glow)
    const coreGeo = new THREE.IcosahedronGeometry(14, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea, // Vivid purple
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(7, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc, // Soft neon purple
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // B. Gyroscopic Orbital Cyber Rings (Torus)
    const ring1Geo = new THREE.TorusGeometry(22, 0.25, 12, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6, // Violet
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(26, 0.2, 12, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xd946ef, // Cyber magenta
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // Subtle third ring in NVIDIA green accent
    const ring3Geo = new THREE.TorusGeometry(30, 0.15, 8, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x76b900, // NVIDIA green accent
      transparent: true,
      opacity: 0.25,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 5;
    coreGroup.add(ring3);

    // Position the core slightly offset towards the top-right / background
    coreGroup.position.set(30, 10, -25);

    // C. 3D Cosmic Neural Particles (1,600 floating nodes)
    const particleCount = 1600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0xc084fc), // Light purple
      new THREE.Color(0xd946ef), // Magenta
      new THREE.Color(0x00e5ff), // Nebius cyan
      new THREE.Color(0x76b900), // NVIDIA green
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 250;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. Mouse Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 4. Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 5. 60fps Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping (Lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Rotate 3D Core & Rings
      coreMesh.rotation.y = elapsedTime * 0.15;
      coreMesh.rotation.x = elapsedTime * 0.08;

      innerCore.rotation.y = -elapsedTime * 0.25;
      innerCore.rotation.z = elapsedTime * 0.12;

      ring1.rotation.z = elapsedTime * 0.2;
      ring1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.1;

      ring2.rotation.y = -elapsedTime * 0.25;
      ring2.rotation.x = -Math.PI / 6 + Math.cos(elapsedTime * 0.4) * 0.1;

      ring3.rotation.z = -elapsedTime * 0.15;

      // Breathing scale pulse (Cognitive rhythm)
      const pulseScale = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Rotate particle nebula very slowly
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = elapsedTime * 0.01;

      // Parallax camera displacement
      camera.position.x = currentMouseX * 12;
      camera.position.y = -currentMouseY * 8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 10%, #150938 0%, #08031d 40%, #030014 90%)'
      }}
    />
  );
}
