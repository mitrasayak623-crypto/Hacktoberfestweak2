import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Shield, Eye, RotateCw, Sparkles, Sliders } from 'lucide-react';

export const Vault3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState<number>(1);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);

  const animStateRef = useRef({
    rotateSpeed: 1,
    explodedFactor: 0,
    targetExplodedFactor: 0,
    pointerX: 0,
    pointerY: 0,
    targetRotX: 0,
    targetRotY: 0,
  });

  useEffect(() => {
    animStateRef.current.rotateSpeed = rotateSpeed;
  }, [rotateSpeed]);

  useEffect(() => {
    animStateRef.current.targetExplodedFactor = explodedFactor;
  }, [explodedFactor]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    // Deep midnight black with a hint of navy blue
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 5.2);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Procedural Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Fog with subtle sapphire-blue tone
    scene.fog = new THREE.FogExp2(0x030712, 0.12);

    // 4. Procedural Canvas Texture for Vault Dial Markings
    const dialCanvas = document.createElement('canvas');
    dialCanvas.width = 1024;
    dialCanvas.height = 1024;
    const ctx = dialCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#050a16';
      ctx.fillRect(0, 0, 1024, 1024);

      // Outer gold ring
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(512, 512, 480, 0, Math.PI * 2);
      ctx.stroke();

      // Degree Tick marks
      for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI) / 30;
        const isMajor = i % 5 === 0;
        const innerR = isMajor ? 420 : 450;
        const outerR = 475;
        ctx.strokeStyle = isMajor ? '#FEF08A' : '#38BDF8';
        ctx.lineWidth = isMajor ? 8 : 4;
        ctx.beginPath();
        ctx.moveTo(512 + Math.cos(angle) * innerR, 512 + Math.sin(angle) * innerR);
        ctx.lineTo(512 + Math.cos(angle) * outerR, 512 + Math.sin(angle) * outerR);
        ctx.stroke();
      }

      ctx.fillStyle = '#FACC15';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VAULTLEDGER AI · ZERO-CLOUD ENCRYPTED', 512, 520);
    }

    const dialTexture = new THREE.CanvasTexture(dialCanvas);
    dialTexture.colorSpace = THREE.SRGBColorSpace;
    dialTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 5. Procedural Composite 3D Model: "The Sovereign Vault" (7 distinct procedural parts)
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // Materials Library with high-contrast PBR variation
    const goldMirrorMat = new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    const brushedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      metalness: 0.85,
      roughness: 0.38,
    });

    const titaniumBlackMat = new THREE.MeshStandardMaterial({
      color: 0x0a101f,
      metalness: 0.8,
      roughness: 0.45,
    });

    const coreEnergyMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    const sapphireEnergyMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    // Part 1: Outer Heavy Chassis (Beveled Cylinder)
    const chassisGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.35, 64);
    const chassisMesh = new THREE.Mesh(chassisGeo, titaniumBlackMat);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    vaultGroup.add(chassisMesh);

    // Part 2: Outer Vault Bezel Ring with Teeth (Torus)
    const bezelGeo = new THREE.TorusGeometry(1.7, 0.08, 16, 64);
    const bezelMesh = new THREE.Mesh(bezelGeo, goldMirrorMat);
    vaultGroup.add(bezelMesh);

    // Part 3: Dial Plate Face with Procedural Markings
    const dialPlateGeo = new THREE.CylinderGeometry(1.45, 1.45, 0.06, 64);
    const dialPlateMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      metalness: 0.75,
      roughness: 0.25,
    });
    const dialPlateMesh = new THREE.Mesh(dialPlateGeo, dialPlateMat);
    dialPlateMesh.rotation.x = Math.PI / 2;
    dialPlateMesh.position.z = 0.18;
    vaultGroup.add(dialPlateMesh);

    // Part 4: Rotating 3-Spoke Vault Steering Wheel (Group)
    const wheelGroup = new THREE.Group();
    wheelGroup.position.z = 0.32;
    vaultGroup.add(wheelGroup);

    const wheelHubGeo = new THREE.CylinderGeometry(0.3, 0.34, 0.2, 32);
    const wheelHubMesh = new THREE.Mesh(wheelHubGeo, goldMirrorMat);
    wheelHubMesh.rotation.x = Math.PI / 2;
    wheelGroup.add(wheelHubMesh);

    // 4 spokes + handles
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const spokeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.9, 16);
      const spokeMesh = new THREE.Mesh(spokeGeo, brushedGoldMat);
      spokeMesh.position.x = Math.cos(angle) * 0.45;
      spokeMesh.position.y = Math.sin(angle) * 0.45;
      spokeMesh.rotation.z = angle + Math.PI / 2;
      wheelGroup.add(spokeMesh);

      const tipGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const tipMesh = new THREE.Mesh(tipGeo, goldMirrorMat);
      tipMesh.position.x = Math.cos(angle) * 0.95;
      tipMesh.position.y = Math.sin(angle) * 0.95;
      wheelGroup.add(tipMesh);
    }

    // Part 5: Central Glowing Encryption Token
    const tokenGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24);
    const tokenMesh = new THREE.Mesh(tokenGeo, coreEnergyMat);
    tokenMesh.rotation.x = Math.PI / 2;
    tokenMesh.position.z = 0.45;
    wheelGroup.add(tokenMesh);

    // Part 6: Stacked Gold Bullion Bars beneath Vault
    const goldBarsGroup = new THREE.Group();
    goldBarsGroup.position.set(0, -1.35, 0.5);
    vaultGroup.add(goldBarsGroup);

    const barGeo = new THREE.BoxGeometry(0.55, 0.14, 0.28);
    for (let i = -1; i <= 1; i++) {
      const barMesh = new THREE.Mesh(barGeo, goldMirrorMat);
      barMesh.position.set(i * 0.6, 0, 0);
      barMesh.castShadow = true;
      goldBarsGroup.add(barMesh);
    }
    for (let i = -0.5; i <= 0.5; i += 1) {
      const barMesh = new THREE.Mesh(barGeo, goldMirrorMat);
      barMesh.position.set(i * 0.6, 0.15, 0);
      barMesh.castShadow = true;
      goldBarsGroup.add(barMesh);
    }

    // Part 7: Dual Orbital Rings: One Gold, One Sapphire Blue
    const ringGeo = new THREE.TorusGeometry(2.35, 0.016, 12, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo, goldMirrorMat);
    ringMesh1.rotation.x = Math.PI / 3;
    vaultGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, sapphireEnergyMat);
    ringMesh2.rotation.y = Math.PI / 3;
    vaultGroup.add(ringMesh2);

    // 6. Contact Ground Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      grad.addColorStop(0.5, 'rgba(2, 6, 23, 0.5)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const groundShadowGeo = new THREE.PlaneGeometry(5.5, 5.5);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.5;
    scene.add(groundShadow);

    // 7. Studio PBR Lighting Rig with Touch of Luminous Sapphire Blue
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const warmKeyLight = new THREE.DirectionalLight(0xfff0aa, 2.8);
    warmKeyLight.position.set(3, 4, 4);
    warmKeyLight.castShadow = true;
    warmKeyLight.shadow.mapSize.width = 1024;
    warmKeyLight.shadow.mapSize.height = 1024;
    warmKeyLight.shadow.bias = -0.0005;
    scene.add(warmKeyLight);

    // Cool Sapphire Fill Light
    const sapphireFillLight = new THREE.HemisphereLight(0x0284c7, 0x030712, 1.2);
    scene.add(sapphireFillLight);

    // Deep Sapphire Rim Backlight (User requested touch of blue)
    const sapphireBacklight = new THREE.PointLight(0x2563eb, 3.5, 12);
    sapphireBacklight.position.set(0, 0.5, -2.5);
    scene.add(sapphireBacklight);

    const goldRimLight = new THREE.DirectionalLight(0xfacc15, 2.0);
    goldRimLight.position.set(-4, -2, -2);
    scene.add(goldRimLight);

    // 8. Mouse / Pointer Interaction with Damped Camera Tilt
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      animStateRef.current.targetRotY = x * 0.45;
      animStateRef.current.targetRotX = -y * 0.25;
    };

    container.addEventListener('mousemove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Lossless 60fps Animation Loop with Exponential Damping
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const state = animStateRef.current;

      vaultGroup.rotation.y = THREE.MathUtils.damp(
        vaultGroup.rotation.y,
        state.targetRotY,
        4.0,
        delta
      );
      vaultGroup.rotation.x = THREE.MathUtils.damp(
        vaultGroup.rotation.x,
        state.targetRotX,
        4.0,
        delta
      );

      wheelGroup.rotation.z += 0.8 * state.rotateSpeed * delta;
      ringMesh1.rotation.z += 0.4 * state.rotateSpeed * delta;
      ringMesh2.rotation.x += 0.35 * state.rotateSpeed * delta;

      state.explodedFactor = THREE.MathUtils.damp(
        state.explodedFactor,
        state.targetExplodedFactor,
        5.0,
        delta
      );

      wheelGroup.position.z = 0.32 + state.explodedFactor * 0.9;
      dialPlateMesh.position.z = 0.18 + state.explodedFactor * 0.45;
      tokenMesh.position.z = 0.45 + state.explodedFactor * 1.2;
      goldBarsGroup.position.z = 0.5 + state.explodedFactor * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      renderer.dispose();
      dialTexture.dispose();
      shadowTex.dispose();
      chassisGeo.dispose();
      bezelGeo.dispose();
      dialPlateGeo.dispose();
      wheelHubGeo.dispose();
      barGeo.dispose();
      ringGeo.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[650px] bg-[#030712] rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl ring-1 ring-yellow-400/20">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Floating Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none select-none">
        <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs uppercase tracking-wider font-bold">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Interactive 3D Sovereign Vault</span>
        </div>
        <h2 className="text-2xl font-extrabold font-display text-white mt-1">
          Zero-Cloud Cryptographic Core
        </h2>
        <p className="text-xs text-neutral-300 max-w-sm mt-0.5 leading-relaxed">
          Procedural 3D simulation with studio PBR reflections, sapphire backlighting, and physical gold finishes.
        </p>
      </div>

      {/* Top-Right Telemetry Badge */}
      <div className="absolute top-6 right-6 hidden md:flex items-center gap-2 p-2 px-3 rounded-xl bg-black/80 border border-blue-500/40 text-xs font-mono text-cyan-300 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span>PBR ACES Filmic · Sapphire & Gold</span>
      </div>

      {/* Unified Collapsible Bottom Control Dock */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-black/85 border border-blue-500/30 rounded-2xl p-3 shadow-2xl transition-all duration-300 backdrop-blur-md ring-1 ring-yellow-400/20">
        <div className="flex items-center justify-between gap-4 text-xs">
          {/* Exploded Assembly Slider */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[150px]">
            <Sliders className="w-4 h-4 text-yellow-400 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
                <span>Exploded View</span>
                <span className="text-yellow-400 font-bold">{Math.round(explodedFactor * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodedFactor}
                onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                className="w-full accent-yellow-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setRotateSpeed(rotateSpeed === 0 ? 1 : rotateSpeed === 1 ? 2.5 : 0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-[#0A1326] hover:bg-blue-900/40 text-neutral-200 font-mono text-xs transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-yellow-400" />
              <span>{rotateSpeed === 0 ? 'Paused' : `${rotateSpeed}x Speed`}</span>
            </button>
          </div>

          {/* Cinema Mode Toggle */}
          <button
            onClick={() => setIsCinemaMode(!isCinemaMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-[#0A1326] hover:bg-blue-900/40 text-neutral-200 font-mono text-xs transition-colors shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-yellow-400" />
            <span>{isCinemaMode ? 'Dock' : 'Cinema'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
