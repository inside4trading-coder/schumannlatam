/**
 * Onda electromagnética 2D ligera (SVG + CSS) para el fondo del hero.
 * Tres armónicos desplazándose en bucle; estática con prefers-reduced-motion.
 */
export const WaveAnimation = () => {
  // Cada path es una sinusoide de 1440px que se repite dos veces (ancho 2880)
  // para poder desplazarla -1440px en bucle sin costuras.
  const buildWave = (amplitude: number, wavelength: number, y: number): string => {
    const segments: string[] = [`M 0 ${y}`];
    for (let x = 0; x <= 2880; x += wavelength / 2) {
      const cpY = y + (Math.round(x / (wavelength / 2)) % 2 === 0 ? -amplitude : amplitude);
      segments.push(`Q ${x + wavelength / 4} ${cpY}, ${x + wavelength / 2} ${y}`);
    }
    return segments.join(" ");
  };

  const waves = [
    { d: buildWave(18, 360, 60), className: "schumann-wave schumann-wave-1", opacity: 0.35 },
    { d: buildWave(10, 180, 60), className: "schumann-wave schumann-wave-2", opacity: 0.25 },
    { d: buildWave(5, 90, 60), className: "schumann-wave schumann-wave-3", opacity: 0.18 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
      >
        {waves.map((wave) => (
          <path
            key={wave.className}
            d={wave.d}
            className={wave.className}
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            strokeOpacity={wave.opacity}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
};
