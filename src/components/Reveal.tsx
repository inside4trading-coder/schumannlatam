import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayS?: number;
}

/** Reveal sutil al entrar en viewport; sin movimiento si el usuario lo prefiere. */
export const Reveal = ({ children, className, delayS = 0 }: RevealProps) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: delayS, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
