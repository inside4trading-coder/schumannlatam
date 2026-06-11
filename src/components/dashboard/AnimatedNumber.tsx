import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  durationS?: number;
  className?: string;
}

/** Contador que anima de 0 al valor final; muestra el valor directo si el usuario prefiere menos movimiento. */
export const AnimatedNumber = ({
  value,
  decimals = 2,
  durationS = 1.2,
  className,
}: AnimatedNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reducedMotion) {
      node.textContent = value.toFixed(decimals);
      return;
    }

    const controls = animate(0, value, {
      duration: durationS,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = latest.toFixed(decimals);
      },
    });

    return () => controls.stop();
  }, [value, decimals, durationS, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
    </span>
  );
};
