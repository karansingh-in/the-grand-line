import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hack the Hunt — organized by SHAIDS" },
      {
        name: "description",
        content:
          "Set sail. Name the pirates. Find the One Piece. A technical treasure hunt organized by SHAIDS.",
      },
      { property: "og:title", content: "Hack the Hunt — organized by SHAIDS" },
      { property: "og:description", content: "Set sail. Name the pirates. Find the One Piece." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});
