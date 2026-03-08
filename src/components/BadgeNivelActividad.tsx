import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface BadgeNivelActividadProps {
  nivel: string;
}

const getBadgeStyles = (nivel: string) => {
  const n = nivel.toLowerCase().trim();
  if (n === "baja") return "bg-badge-baja/15 text-badge-baja border-badge-baja/30";
  if (n === "media") return "bg-badge-media/15 text-badge-media border-badge-media/30";
  if (n === "alta") return "bg-badge-alta/15 text-badge-alta border-badge-alta/30";
  if (n === "muy alta") return "bg-badge-muy-alta/15 text-badge-muy-alta border-badge-muy-alta/30";
  return "bg-secondary text-secondary-foreground border-border";
};

export const BadgeNivelActividad = ({ nivel }: BadgeNivelActividadProps) => {
  return (
    <Badge className={`${getBadgeStyles(nivel)} font-medium px-3 py-1 gap-1.5`}>
      <Zap className="h-3 w-3" />
      {nivel}
    </Badge>
  );
};
