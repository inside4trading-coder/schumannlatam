import { TranslationKeys } from "@/i18n/translations";

export type ActivityLevel = 1 | 2 | 3 | 4;

/** Maps the raw (Spanish) nivelActividad value from the API to a 1–4 scale. */
export const nivelToNumber = (nivel: string): ActivityLevel => {
  const n = nivel.toLowerCase().trim();
  if (n === "baja") return 1;
  if (n === "media") return 2;
  if (n === "alta") return 3;
  if (n === "muy alta") return 4;
  return 2;
};

/** Tailwind color token (defined in index.css) for each activity level. */
export const nivelColorToken = (level: ActivityLevel): string => {
  const tokens: Record<ActivityLevel, string> = {
    1: "badge-baja",
    2: "badge-media",
    3: "badge-alta",
    4: "badge-muy-alta",
  };
  return tokens[level];
};

/** Localized state descriptor (Calmo / Activo / Elevado / Tormenta). */
export const nivelStateLabel = (level: ActivityLevel, t: TranslationKeys): string => {
  const labels: Record<ActivityLevel, string> = {
    1: t.dashboard.stateCalm,
    2: t.dashboard.stateActive,
    3: t.dashboard.stateElevated,
    4: t.dashboard.stateStorm,
  };
  return labels[level];
};

/** Localized level name (Baja / Media / Alta / Muy alta). */
export const nivelDisplayName = (level: ActivityLevel, t: TranslationKeys): string => {
  const names: Record<ActivityLevel, string> = {
    1: t.activityLevels.low,
    2: t.activityLevels.medium,
    3: t.activityLevels.high,
    4: t.activityLevels.veryHigh,
  };
  return names[level];
};
