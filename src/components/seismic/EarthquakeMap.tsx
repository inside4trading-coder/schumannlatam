import { useEffect, useRef, useState } from "react";
import type { Earthquake } from "@/hooks/useEarthquakes";

interface Props {
  events: Earthquake[];
  selected: Earthquake | null;
  onSelect: (e: Earthquake) => void;
}

// Paleta Schumann: violeta/púrpura como primary, coherente con --gradient-cosmic
function getMagColor(mag: number): string {
  if (mag >= 7) return "#f87171";   // red-400
  if (mag >= 6) return "#fb923c";   // orange-400
  if (mag >= 5) return "#facc15";   // yellow-400
  if (mag >= 4) return "#a78bfa";   // violet-400 (primary del sitio)
  return "#818cf8";                  // indigo-400
}

function getMagRadius(mag: number): number {
  if (mag >= 7) return 18;
  if (mag >= 6) return 14;
  if (mag >= 5) return 10;
  if (mag >= 4) return 7;
  return 5;
}

function project(lat: number, lng: number, W: number, H: number) {
  return { x: ((lng + 180) / 360) * W, y: ((90 - lat) / 180) * H };
}

export function EarthquakeMap({ events, selected, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 450 });
  const [hovered, setHovered] = useState<Earthquake | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg";
    img.onload = () => { imgRef.current = img; setImgLoaded(true); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dims;
    ctx.clearRect(0, 0, w, h);
    // Fondo: azul muy oscuro como el dark mode del sitio hsl(240 20% 6%)
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, w, h);
    if (imgRef.current && imgLoaded) {
      ctx.globalAlpha = 0.25;
      ctx.drawImage(imgRef.current, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }
    // Grid con color primario del sitio (violeta tenue)
    ctx.strokeStyle = "rgba(167,139,250,0.07)";
    ctx.lineWidth = 0.5;
    for (let lat = -90; lat <= 90; lat += 30) {
      const { y } = project(lat, 0, w, h);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 60) {
      const { x } = project(0, lng, w, h);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    events.forEach((eq) => {
      const { x, y } = project(eq.lat, eq.lng, w, h);
      const r = getMagRadius(eq.mag);
      const color = getMagColor(eq.mag);
      const isSelected = selected?.id === eq.id;
      const isHovered = hovered?.id === eq.id;
      if (isSelected || isHovered) {
        ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = color + "33"; ctx.fill();
      }
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
      grd.addColorStop(0, color + "88"); grd.addColorStop(1, color + "00");
      ctx.beginPath(); ctx.arc(x, y, r * 2, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color + (isSelected ? "ff" : "cc"); ctx.fill();
      ctx.strokeStyle = isSelected ? "#c4b5fd" : color + "66";
      ctx.lineWidth = isSelected ? 2 : 1; ctx.stroke();
    });
  }, [events, selected, hovered, dims, imgLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const h = Math.round(width / 2);
      setDims({ w: width, h });
      canvas.width = width;
      canvas.height = h;
    });
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, []);

  const hitTest = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { w, h } = dims;
    for (const eq of events) {
      const { x, y } = project(eq.lat, eq.lng, w, h);
      if (Math.hypot(mx - x, my - y) <= getMagRadius(eq.mag) + 4) return eq;
    }
    return null;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border/50 bg-[#0a0a12]">
      <canvas
        ref={canvasRef}
        width={dims.w}
        height={dims.h}
        className="w-full block"
        onMouseMove={(e) => {
          const found = hitTest(e);
          setHovered(found);
          setTooltip({ x: e.clientX - e.currentTarget.getBoundingClientRect().left, y: e.clientY - e.currentTarget.getBoundingClientRect().top });
          e.currentTarget.style.cursor = found ? "pointer" : "default";
        }}
        onMouseLeave={() => setHovered(null)}
        onClick={(e) => { const eq = hitTest(e); if (eq) onSelect(eq); }}
      />
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 bg-card/95 border border-border rounded-xl px-3 py-2 text-sm shadow-xl backdrop-blur-sm"
          style={{ left: tooltip.x + 14, top: tooltip.y - 44, maxWidth: 220 }}
        >
          <p className="font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            M {hovered.mag.toFixed(1)}
          </p>
          <p className="text-muted-foreground text-xs leading-snug">{hovered.place}</p>
          <p className="text-muted-foreground text-xs">{hovered.depth.toFixed(0)} km prof.</p>
        </div>
      )}
      {/* Leyenda con estilo del sitio */}
      <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
        {([["M2+","#818cf8"],["M4+","#a78bfa"],["M5+","#facc15"],["M6+","#fb923c"],["M7+","#f87171"]] as [string,string][]).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-[10px] text-white/80 font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
