import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Compass, Pause, Play } from "lucide-react";
import type { Earthquake } from "@/hooks/useEarthquakes";

interface Props {
  events: Earthquake[];
  selected: Earthquake | null;
  onSelect: (e: Earthquake) => void;
  /** Epoch ms cutoff for the replay timeline. Only events with time <= cutoff render. */
  cutoff?: number | null;
}

const RADIUS = 1;
const VEN = { lat: 8.2, lng: -66.5 };
const RECENT_MS = 6 * 3600 * 1000;

const magHex = (m: number) =>
  m >= 7 ? 0xf87171 : m >= 6 ? 0xfb923c : m >= 5 ? 0xfacc15 : m >= 4 ? 0xa78bfa : 0x818cf8;
const magCss = (m: number) =>
  m >= 7 ? "#f87171" : m >= 6 ? "#fb923c" : m >= 5 ? "#facc15" : m >= 4 ? "#a78bfa" : "#818cf8";

function llToVec3(lat: number, lng: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta) * r,
    Math.cos(phi) * r,
    Math.sin(phi) * Math.sin(theta) * r,
  );
}

function radialTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.Texture(c);
  t.needsUpdate = true;
  return t;
}

interface Marker {
  quake: Earthquake;
  dot: THREE.Mesh;
  glow: THREE.Sprite;
  hit: THREE.Mesh;
  ring?: THREE.Mesh;
  baseGlow: number;
}

interface World {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  earth: THREE.Group;
  markerLayer: THREE.Group;
  selRing: THREE.Mesh;
  markers: Marker[];
  raf: number;
  disposables: Array<{ dispose: () => void }>;
  rebuild: (events: Earthquake[], cutoff: number | null) => void;
  applySelection: (sel: Earthquake | null) => void;
  centerVenezuela: () => void;
}

export function EarthquakeGlobe({ events, selected, onSelect, cutoff = null }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const tipNameRef = useRef<HTMLParagraphElement>(null);
  const tipMetaRef = useRef<HTMLParagraphElement>(null);
  const worldRef = useRef<World | null>(null);

  // latest props for use inside the imperative loop / handlers
  const propsRef = useRef({ events, selected, onSelect, cutoff });
  propsRef.current = { events, selected, onSelect, cutoff };

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [paused, setPaused] = useState<boolean>(prefersReduced);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // ---- one-time setup ----
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;

    const W = mount.clientWidth || 640;
    const H = mount.clientHeight || 440;
    const disposables: World["disposables"] = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.z = 3.05;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // WebGL unavailable — page keeps the 2D map as fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const earth = new THREE.Group();
    scene.add(earth);

    // opaque inner sphere occludes the far-side wireframe → reads as 3D
    const coreGeo = new THREE.SphereGeometry(RADIUS * 0.992, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x0c0c1a });
    earth.add(new THREE.Mesh(coreGeo, coreMat));
    disposables.push(coreGeo, coreMat);

    // graticule (holographic violet)
    const gridMat = new THREE.LineBasicMaterial({ color: 0x7c6df0, transparent: true, opacity: 0.3 });
    const eqMat = new THREE.LineBasicMaterial({ color: 0x9b8bf0, transparent: true, opacity: 0.55 });
    disposables.push(gridMat, eqMat);
    const addLine = (pts: THREE.Vector3[], mat: THREE.LineBasicMaterial) => {
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      disposables.push(g);
      earth.add(new THREE.Line(g, mat));
    };
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let a = 0; a <= 360; a += 4) pts.push(llToVec3(lat, a - 180, RADIUS));
      addLine(pts, lat === 0 ? eqMat : gridMat);
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let a = -90; a <= 90; a += 4) pts.push(llToVec3(a, lng, RADIUS));
      addLine(pts, gridMat);
    }

    // atmosphere halo behind the globe
    const haloTex = radialTexture([
      [0, "rgba(139,92,246,0)"],
      [0.62, "rgba(139,92,246,0.5)"],
      [0.78, "rgba(96,165,250,0.28)"],
      [1, "rgba(139,92,246,0)"],
    ]);
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(3.7, 3.7, 1);
    halo.position.set(0, 0, -0.4);
    scene.add(halo);
    disposables.push(haloTex, haloMat);

    const glowTex = radialTexture([
      [0, "rgba(255,255,255,1)"],
      [0.25, "rgba(255,255,255,0.85)"],
      [1, "rgba(255,255,255,0)"],
    ]);
    disposables.push(glowTex);

    // reusable selection ring (hidden until something is selected)
    const selGeo = new THREE.RingGeometry(0.045, 0.06, 40);
    const selMat = new THREE.MeshBasicMaterial({
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const selRing = new THREE.Mesh(selGeo, selMat);
    selRing.visible = false;
    earth.add(selRing);
    disposables.push(selGeo, selMat);

    const markerLayer = new THREE.Group();
    earth.add(markerLayer);

    const world: World = {
      renderer,
      scene,
      camera,
      earth,
      markerLayer,
      selRing,
      markers: [],
      raf: 0,
      disposables,
      rebuild: () => {},
      applySelection: () => {},
      centerVenezuela: () => {},
    };

    // ---- markers ----
    world.rebuild = (evs: Earthquake[], cut: number | null) => {
      // clear previous
      world.markers.forEach((m) => {
        markerLayer.remove(m.dot, m.glow, m.hit);
        if (m.ring) markerLayer.remove(m.ring);
        m.dot.geometry.dispose();
        (m.dot.material as THREE.Material).dispose();
        (m.glow.material as THREE.Material).dispose();
        m.hit.geometry.dispose();
        (m.hit.material as THREE.Material).dispose();
        if (m.ring) {
          m.ring.geometry.dispose();
          (m.ring.material as THREE.Material).dispose();
        }
      });
      world.markers = [];
      const now = Date.now();
      const list = cut == null ? evs : evs.filter((e) => e.time <= cut);
      list.forEach((q) => {
        const hex = magHex(q.mag);
        const pos = llToVec3(q.lat, q.lng, RADIUS * 1.004);

        const dotGeo = new THREE.SphereGeometry(0.008 + (q.mag - 2) * 0.0045, 12, 12);
        const dotMat = new THREE.MeshBasicMaterial({ color: hex });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pos);

        const baseGlow = 0.05 + (q.mag - 2) * 0.024;
        const glowMat = new THREE.SpriteMaterial({
          map: glowTex,
          color: hex,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const glow = new THREE.Sprite(glowMat);
        glow.scale.set(baseGlow, baseGlow, 1);
        glow.position.copy(pos);

        const hitGeo = new THREE.SphereGeometry(0.05, 8, 8);
        // colorWrite/depthWrite off → invisible but still raycastable.
        // (visible:false would make Raycaster skip the mesh entirely.)
        const hitMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
        const hit = new THREE.Mesh(hitGeo, hitMat);
        hit.position.copy(pos);
        hit.userData.quake = q;

        markerLayer.add(dot, glow, hit);

        let ring: THREE.Mesh | undefined;
        const isRecent = now - q.time < RECENT_MS;
        if (isRecent || q.mag >= 4.5) {
          const rGeo = new THREE.RingGeometry(0.02, 0.032, 28);
          const rMat = new THREE.MeshBasicMaterial({
            color: hex,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          ring = new THREE.Mesh(rGeo, rMat);
          ring.position.copy(pos);
          ring.lookAt(pos.clone().multiplyScalar(2));
          ring.userData.phase = Math.random();
          markerLayer.add(ring);
        }
        world.markers.push({ quake: q, dot, glow, hit, ring, baseGlow });
      });
      world.applySelection(propsRef.current.selected);
    };

    world.applySelection = (sel: Earthquake | null) => {
      let found: Marker | undefined;
      world.markers.forEach((m) => {
        const on = !!sel && m.quake.id === sel.id;
        m.glow.scale.setScalar(on ? m.baseGlow * 1.8 : m.baseGlow);
        (m.glow.material as THREE.SpriteMaterial).opacity = on ? 1 : 0.9;
        if (on) found = m;
      });
      if (found) {
        selRing.position.copy(found.dot.position);
        selRing.lookAt(found.dot.position.clone().multiplyScalar(2));
        (selMat as THREE.MeshBasicMaterial).color.set(magHex(found.quake.mag));
        selRing.visible = true;
      } else {
        selRing.visible = false;
      }
    };

    // ---- orientation / interaction ----
    const target = { x: 0.1, y: 0 };
    let centering = false;
    let dragging = false;
    let dragMoved = false;
    let px = 0;
    let py = 0;

    world.centerVenezuela = () => {
      target.y = ((VEN.lng - 90) * Math.PI) / 180;
      target.x = 0.12;
      centering = true;
    };
    // initial framing
    earth.rotation.y = ((VEN.lng - 90) * Math.PI) / 180;
    earth.rotation.x = 0.12;
    target.y = earth.rotation.y;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hoveredId: string | null = null;

    const showTip = (m: Marker, clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const tip = tipRef.current;
      if (!tip) return;
      if (hoveredId !== m.quake.id) {
        hoveredId = m.quake.id;
        if (tipNameRef.current)
          tipNameRef.current.textContent = `M ${m.quake.mag.toFixed(1)} · ${m.quake.place}`;
        if (tipMetaRef.current)
          tipMetaRef.current.textContent = `${m.quake.depth.toFixed(0)} km de profundidad`;
        (tipNameRef.current as HTMLElement).style.color = magCss(m.quake.mag);
      }
      tip.style.opacity = "1";
      tip.style.left = `${clientX - rect.left + 14}px`;
      tip.style.top = `${clientY - rect.top - 10}px`;
    };
    const hideTip = () => {
      hoveredId = null;
      if (tipRef.current) tipRef.current.style.opacity = "0";
    };

    const pick = (clientX: number, clientY: number): Marker | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(world.markers.map((m) => m.hit), false);
      const camDir = camera.position.clone().normalize();
      for (const h of hits) {
        const wp = h.object.getWorldPosition(new THREE.Vector3()).normalize();
        if (wp.dot(camDir) > 0.05) {
          return world.markers.find((m) => m.hit === h.object) || null;
        }
      }
      return null;
    };

    const onMove = (e: PointerEvent) => {
      if (dragging) {
        dragMoved = true;
        earth.rotation.y += (e.clientX - px) * 0.005;
        earth.rotation.x = Math.max(-1.2, Math.min(1.2, earth.rotation.x + (e.clientY - py) * 0.005));
        px = e.clientX;
        py = e.clientY;
        target.x = earth.rotation.x;
        target.y = earth.rotation.y;
        return;
      }
      const m = pick(e.clientX, e.clientY);
      renderer.domElement.style.cursor = m ? "pointer" : "grab";
      if (m) showTip(m, e.clientX, e.clientY);
      else hideTip();
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      dragMoved = false;
      centering = false;
      px = e.clientX;
      py = e.clientY;
      renderer.domElement.style.cursor = "grabbing";
    };
    const onUp = (e: PointerEvent) => {
      if (dragging && !dragMoved) {
        const m = pick(e.clientX, e.clientY);
        if (m) propsRef.current.onSelect(m.quake);
      }
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", hideTip);

    // ---- animation loop ----
    let lastT = performance.now();
    let elapsed = 0;
    const animate = () => {
      world.raf = requestAnimationFrame(animate);
      const nowT = performance.now();
      const dt = Math.min(0.05, (nowT - lastT) / 1000);
      lastT = nowT;
      elapsed += dt;
      const autoRotate = !pausedRef.current && !dragging && !centering;
      if (autoRotate) {
        earth.rotation.y += dt * 0.09;
        target.y = earth.rotation.y;
      }
      earth.rotation.x += (target.x - earth.rotation.x) * 0.08;
      if ((pausedRef.current || centering) && !dragging) {
        earth.rotation.y += (target.y - earth.rotation.y) * 0.08;
        if (centering && Math.abs(target.y - earth.rotation.y) < 0.005) centering = false;
      }
      if (!prefersReduced) {
        for (const m of world.markers) {
          if (!m.ring) continue;
          const phase = ((m.ring.userData.phase as number) + elapsed * 0.4) % 1;
          const sc = 1 + phase * 5;
          m.ring.scale.set(sc, sc, sc);
          (m.ring.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - phase);
        }
        (selMat as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(elapsed * 3) * 0.3;
      }
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      if (disposed) return;
      const w = mount.clientWidth || W;
      const h = mount.clientHeight || H;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    worldRef.current = world;
    world.rebuild(propsRef.current.events, propsRef.current.cutoff);

    return () => {
      disposed = true;
      cancelAnimationFrame(world.raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerleave", hideTip);
      world.markers.forEach((m) => {
        m.dot.geometry.dispose();
        (m.dot.material as THREE.Material).dispose();
        (m.glow.material as THREE.Material).dispose();
        m.hit.geometry.dispose();
        (m.hit.material as THREE.Material).dispose();
        if (m.ring) {
          m.ring.geometry.dispose();
          (m.ring.material as THREE.Material).dispose();
        }
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // rebuild markers when the event set or replay cutoff changes
  useEffect(() => {
    worldRef.current?.rebuild(events, cutoff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, cutoff]);

  // reflect external selection
  useEffect(() => {
    worldRef.current?.applySelection(selected);
  }, [selected]);

  return (
    <div className="relative w-full">
      <div
        ref={mountRef}
        className="w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-border/50"
        style={{ background: "radial-gradient(ellipse at 50% 42%, hsl(245 40% 12%) 0%, hsl(240 20% 5%) 70%)" }}
      />

      {/* hover tooltip (imperatively positioned) */}
      <div
        ref={tipRef}
        className="pointer-events-none absolute top-0 left-0 z-10 max-w-[220px] rounded-xl border border-border bg-card/95 px-3 py-2 shadow-xl backdrop-blur-sm transition-opacity duration-150"
        style={{ opacity: 0 }}
      >
        <p ref={tipNameRef} className="text-sm font-bold leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }} />
        <p ref={tipMetaRef} className="text-xs text-muted-foreground" />
      </div>

      {/* controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          onClick={() => worldRef.current?.centerVenezuela()}
          aria-label="Centrar en Venezuela"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card/85 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Compass className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Reanudar rotación" : "Pausar rotación"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card/85 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {([["M2+", "#818cf8"], ["M4+", "#a78bfa"], ["M5+", "#facc15"], ["M6+", "#fb923c"], ["M7+", "#f87171"]] as [string, string][]).map(
          ([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 rounded-full border border-border/40 bg-black/55 px-2.5 py-1 backdrop-blur-sm">
              <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: color }} />
              <span className="text-[10px] font-medium text-white/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default EarthquakeGlobe;
