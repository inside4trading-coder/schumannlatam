import { Badge } from "@/components/ui/badge";

interface BadgeNivelActividadProps {
  nivel: string;
}

const getBadgeClass = (nivel: string): string => {
  const normalizado = nivel.toLowerCase().trim();
  
  if (normalizado === "baja") return "bg-badge-baja text-foreground";
  if (normalizado === "media") return "bg-badge-media text-foreground";
  if (normalizado === "alta") return "bg-badge-alta text-foreground";
  if (normalizado === "muy alta") return "bg-badge-muy-alta text-foreground";
  
  return "bg-secondary text-secondary-foreground";
};

export const BadgeNivelActividad = ({ nivel }: BadgeNivelActividadProps) => {
  return (
    <Badge className={`${getBadgeClass(nivel)} font-medium px-3 py-1`}>
      {nivel}
    </Badge>
  );
};
