import { Badge } from "@/components/ui/badge";

interface BadgeNivelActividadProps {
  nivel: string;
}

const getBadgeClass = (nivel: string): string => {
  const normalizado = nivel.toLowerCase().trim();
  
  if (normalizado === "baja") return "bg-badge-baja text-gray-900";
  if (normalizado === "media") return "bg-badge-media text-gray-900";
  if (normalizado === "alta") return "bg-badge-alta text-gray-900";
  if (normalizado === "muy alta") return "bg-badge-muy-alta text-gray-900";
  
  return "bg-secondary text-secondary-foreground";
};

export const BadgeNivelActividad = ({ nivel }: BadgeNivelActividadProps) => {
  return (
    <Badge className={`${getBadgeClass(nivel)} font-medium px-3 py-1`}>
      {nivel}
    </Badge>
  );
};
