import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Synapse3DScene
 * Ultra-subtle, elegant 3D ambient motion graphics (Linear / Apple aesthetic).
 * Features a dark, metallic fluid Torus Knot with soft studio specular lighting
 * and fine, gentle stardust particles reacting smoothly to cursor parallax.
 */
export default function Synapse3DScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06040d, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 90;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting (Subtle, Moody Purple & Rim Highlights)
    const ambientLight = new THREE.AmbientLight(0x0e091c, 2.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x9333ea, 2.8); // Primary soft purple
    dirLight1.position.set(40, 50, 40);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 1.5); // Indigo fill
    dirLight2.position.set(-50, -30, -20);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 150); // Subtle cyan rim
    rimLight.position.set(20, -40, 30);
    scene.add(rimLight);

    // 3. Main 3D Art: Smooth Dark Metallic Fluid Torus Knot
    const knotGroup = new THREE.Group();
    scene.add(knotGroup);

    const knotGeo = new THREE.TorusKnotGeometry(15, 3.2, 160, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x090515,
      roughness: 0.3,
      metalness: 0.88,
      wireframe: false,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotGroup.add(knotMesh);

    // Subtle outer halo ring (thin, elegant)
    const haloGeo = new THREE.TorusGeometry(26, 0.08, 16, 120);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.22,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 3;
    knotGroup.add(haloMesh);

    // Position subtly in the upper-right background
    knotGroup.position.set(32, 12, -20);

    // 4. Subtle, Fine Stardust Field (Soft circular motes, no chunky squares)
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const opacities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 260;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
      opacities[i] = Math.random() * 0.4 + 0.1;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom soft circular point texture generated via 2D canvas
    const createCircleTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 32;
      cvs.height = 32;
      const ctx = cvs.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(216, 180, 254, 0.9)');
      grad.addColorStop(0.4, 'rgba(168, 85, 247, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(cvs);
    };

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 5. Smooth Damped Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6. Smooth 60fps Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Damped mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.035;
      currentMouseY += (targetMouseY - currentMouseY) * 0.035;

      // Slow, mesmerizing organic rotation of the knot
      knotMesh.rotation.x = elapsed * 0.08;
      knotMesh.rotation.y = elapsed * 0.12;
      knotMesh.rotation.z = Math.sin(elapsed * 0.05) * 0.2;

      haloMesh.rotation.z = -elapsed * 0.06;
      haloMesh.rotation.y = Math.cos(elapsed * 0.04) * 0.15;

      // Subtle breathing scale
      const s = 1 + Math.sin(elapsed * 0.8) * 0.015;
      knotMesh.scale.set(s, s, s);

      // Subtle starfield drift
      stars.rotation.y = elapsed * 0.008;

      // Camera parallax
      camera.position.x = currentMouseX * 9;
      camera.position.y = -currentMouseY * 6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 60% 0%, #100a26 0%, #080514 45%, #04020a 100%)'
      }}
    />
  );
}
