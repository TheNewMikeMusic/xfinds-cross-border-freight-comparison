export type HeroBackground =
  | { kind: "image"; src: string; alt?: string }
  | { kind: "css"; css: string };

export type HeroCopy = {
  title: string;
  subtitle: string;
  variants: { key: "A" | "B" | "C"; title: string; subtitle: string }[];
  background: HeroBackground;
};

export const HERO_COPY: HeroCopy = {
  title: "Search smarter, shop China.",
  subtitle:
    "The Ai Search Engine for China's Best.",
  variants: [
    {
      key: "A",
      title: "Search smarter, shop China.",
      subtitle:
        "The Ai Search Engine for China's Best.",
    },
    {
      key: "B",
      title: "Find It. Forward It.",
      subtitle:
        "Search products, compare agents and routes, and ship worldwide with confidence.",
    },
    {
      key: "C",
      title: "Smarter Sourcing, Simpler Shipping.",
      subtitle:
        "Discover products, check agent fees and delivery options — all in one place.",
    },
  ],
  // If /public/hero/xfinds-hero-default.jpg exists, use image; else use gradient css.
  // Default to CSS gradient - change to image when the file is available
  background: {
    kind: "css",
    css:
      "radial-gradient(1200px 600px at 20% 20%, rgba(93,139,255,0.35), transparent 60%), radial-gradient(1000px 500px at 80% 30%, rgba(146,86,255,0.35), transparent 60%), linear-gradient(180deg, #0A1220 0%, #0B1830 100%)",
  },
};

// Provide a fallback gradient for when the image is missing:
export const HERO_FALLBACK_BG: HeroBackground = {
  kind: "css",
  css:
    "radial-gradient(1200px 600px at 20% 20%, rgba(93,139,255,0.35), transparent 60%), radial-gradient(1000px 500px at 80% 30%, rgba(146,86,255,0.35), transparent 60%), linear-gradient(180deg, #0A1220 0%, #0B1830 100%)",
};

/**
 * Get a specific variant by key
 * @param key - Variant key ("A", "B", or "C")
 * @returns The variant copy, or the default if not found
 */
export function getHeroVariant(key: "A" | "B" | "C"): { title: string; subtitle: string } {
  const variant = HERO_COPY.variants.find((v) => v.key === key);
  return variant || { title: HERO_COPY.title, subtitle: HERO_COPY.subtitle };
}

/**
 * Update HERO_COPY to use a specific variant
 * This is a helper for quick switching - in production you might want to use a state management solution
 */
export function useHeroVariant(key: "A" | "B" | "C"): HeroCopy {
  const variant = getHeroVariant(key);
  return {
    ...HERO_COPY,
    title: variant.title,
    subtitle: variant.subtitle,
  };
}

