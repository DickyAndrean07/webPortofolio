import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface RotaryDial3DProps {
  progress: number; // 0 to 1
  activeIndex: number; // 0 to 4
  onSelectIndex: (index: number) => void;
}

export function RotaryDial3D({
  progress,
  activeIndex,
  onSelectIndex,
}: RotaryDial3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const knobRef = useRef<THREE.Object3D | null>(null);
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Update target angle when progress changes (when not user dragging)
  useEffect(() => {
    if (!isDraggingRef.current) {
      targetAngleRef.current = progress * Math.PI * 2;
    }
  }, [progress]);

  // Pulse point light on active index change
  useEffect(() => {
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 4.8;
      const timer = setTimeout(() => {
        if (pointLightRef.current) pointLightRef.current.intensity = 2.8;
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // High-angle 3/4 isometric perspective
    camera.position.set(0, 6.8, 5.4);
    camera.lookAt(0, 0.35, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedb, 2.6);
    keyLight.position.set(4, 9, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffa844, 1.6);
    fillLight.position.set(-5, 6, -3);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xff9922, 2.8, 9);
    pointLight.position.set(0, 1.4, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // Load Model
    let isDisposed = false;
    const loader = new GLTFLoader();
    loader.load(
      "./models/rotary-dial.glb",
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;
        scene.add(model);

        const knob = model.getObjectByName("Knob_Pivot");
        if (knob) {
          knobRef.current = knob;
          knob.rotation.y = currentAngleRef.current;
        }

        // Material enhancement
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
              if (
                mesh.name.includes("indicator") ||
                mesh.name.includes("glow")
              ) {
                mat.emissive = new THREE.Color(0xff8811);
                mat.emissiveIntensity = 3.2;
              } else if (
                mesh.name.includes("pins") ||
                mesh.name.includes("ring")
              ) {
                mat.metalness = 0.85;
                mat.roughness = 0.25;
              } else if (
                mesh.name.includes("shell") ||
                mesh.name.includes("grip")
              ) {
                mat.metalness = 0.65;
                mat.roughness = 0.45;
              }
            }
          }
        });
      },
      undefined,
      (err) => {
        console.error("Failed to load rotary-dial.glb:", err);
      }
    );

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth lerp angle
      const target = targetAngleRef.current;
      currentAngleRef.current += (target - currentAngleRef.current) * 0.12;

      if (knobRef.current) {
        knobRef.current.rotation.y = currentAngleRef.current;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Pointer Drag Handlers
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      dragStartAngleRef.current = targetAngleRef.current;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      const deltaAngle = (dx / (container.clientWidth || 400)) * Math.PI * 2;
      targetAngleRef.current = dragStartAngleRef.current + deltaAngle;

      // Calculate nearest skill index
      const normalized =
        (((targetAngleRef.current % (Math.PI * 2)) + Math.PI * 2) %
          (Math.PI * 2)) /
        (Math.PI * 2);
      const newIdx = Math.min(4, Math.floor(normalized * 5));
      if (newIdx !== activeIndex) {
        onSelectIndex(newIdx);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}

      // Snap to nearest of the 5 skill angles
      const twoPi = Math.PI * 2;
      const step = twoPi / 5;
      const current = targetAngleRef.current;
      const snapped = Math.round(current / step) * step;
      targetAngleRef.current = snapped;

      const norm = (((snapped % twoPi) + twoPi) % twoPi) / twoPi;
      const finalIdx = Math.min(4, Math.round(norm * 5) % 5);
      onSelectIndex(finalIdx);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="rotary-dial-container"
      role="region"
      aria-label="3D Rotary Dial Selector"
    >
      <canvas ref={canvasRef} className="rotary-dial-canvas" />
      <div className="rotary-dial-badge">
        <span className="dial-badge-dot" />
        <span className="dial-badge-text">
          SLOT 0{activeIndex + 1} ·{" "}
          {Math.round((((progress % 1) + 1) % 1) * 360)}°
        </span>
        <span className="dial-badge-hint">DRAG / SCROLL TO TUNE</span>
      </div>
    </div>
  );
}
