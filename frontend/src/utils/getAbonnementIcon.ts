import * as icons from "simple-icons";

export const getAbonnementIcon = (name: string): string | null => {
  const formatted = name.toLowerCase().replace(/\s+/g, "");
  const iconKey = Object.keys(icons).find((key) =>
    key.toLowerCase().includes(formatted)
  );

  if (iconKey && (icons as any)[iconKey]) {
    const icon = (icons as any)[iconKey];
    return `data:image/svg+xml;utf8,${encodeURIComponent(icon.svg)}`;
  }

  return null;
};
