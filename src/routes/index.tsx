import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Grand Line — Technical Treasure Hunt" },
      { name: "description", content: "Navigate. Decode. Debug. Discover. A pirate-themed technical treasure hunt." },
      { property: "og:title", content: "The Grand Line — Technical Treasure Hunt" },
      { property: "og:description", content: "Navigate. Decode. Debug. Discover." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});
