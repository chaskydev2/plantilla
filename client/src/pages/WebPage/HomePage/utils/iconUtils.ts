import type { LucideIcon } from "lucide-react";
import { Accessibility, Folder, TrafficCone } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Resolve backend-provided icon names to lucide icons with sensible fallbacks.
export const toLucideIcon = (iconName?: string): LucideIcon | undefined => {
  if (!iconName) return undefined;

  const raw = iconName.trim();

  // Explicit aliases for common backend names
  const aliasMap: Record<string, LucideIcon> = {
    LucideFolder: Folder,
    Folder,
    AccessibilityIcon: Accessibility,
    Accessibility,
    LucideTrafficCone: TrafficCone,
    TrafficCone,
  } as const;
  if (aliasMap[raw]) return aliasMap[raw];

  // Normalize names like "paintbrush_vertical" or "LucidePaintbrushVerticalIcon"
  const camel = raw
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s/g, "");

  const stripIcon = camel.endsWith("Icon") ? camel.slice(0, -4) : camel;
  const stripLucide = stripIcon.startsWith("Lucide") ? stripIcon.slice(6) : stripIcon;

  const candidates = [raw, camel, stripIcon, stripLucide]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  for (const name of candidates) {
    const candidate = (LucideIcons as Record<string, unknown>)[name];
    const maybe = candidate as any;
    // lucide-react components carry iconNode; also accept plain function components
    if (candidate && (Array.isArray(maybe?.iconNode) || typeof candidate === "function")) {
      return candidate as LucideIcon;
    }
  }

  return undefined;
};
