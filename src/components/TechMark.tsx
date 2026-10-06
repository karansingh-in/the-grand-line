import type { CSSProperties } from "react";
import type { TechId } from "@/lib/game";

import instagram from "@/assets/tech/instagram.svg?raw";
import whatsapp from "@/assets/tech/whatsapp.svg?raw";
import youtube from "@/assets/tech/youtube.svg?raw";
import googlechrome from "@/assets/tech/googlechrome.svg?raw";
import gmail from "@/assets/tech/gmail.svg?raw";
import netflix from "@/assets/tech/netflix.svg?raw";
import google from "@/assets/tech/google.svg?raw";
import spotify from "@/assets/tech/spotify.svg?raw";
import facebook from "@/assets/tech/facebook.svg?raw";
import googlemaps from "@/assets/tech/googlemaps.svg?raw";
import snapchat from "@/assets/tech/snapchat.svg?raw";
import telegram from "@/assets/tech/telegram.svg?raw";
import amazon from "@/assets/tech/amazon.svg?raw";
import android from "@/assets/tech/android.svg?raw";
import x from "@/assets/tech/x.svg?raw";
import linkedin from "@/assets/tech/linkedin.svg?raw";
import samsung from "@/assets/tech/samsung.svg?raw";
import apple from "@/assets/tech/apple.svg?raw";
import openai from "@/assets/tech/openai.svg?raw";
import googlepay from "@/assets/tech/googlepay.svg?raw";

const MARKS: Record<TechId, string> = {
  instagram,
  whatsapp,
  youtube,
  googlechrome,
  gmail,
  netflix,
  google,
  spotify,
  facebook,
  googlemaps,
  snapchat,
  telegram,
  amazon,
  android,
  x,
  linkedin,
  samsung,
  apple,
  openai,
  googlepay,
};

/** Real brand mark, rendered in true brand colors on light specimen tiles. */
export function TechMark({
  id,
  size = 96,
  style,
}: {
  id: TechId;
  size?: number;
  style?: CSSProperties;
}) {
  const svg = MARKS[id] ?? MARKS.google;
  return (
    <span
      className="tech-mark"
      style={{ width: size, height: size, ...style }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
