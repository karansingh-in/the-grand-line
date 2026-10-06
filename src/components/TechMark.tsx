import type { CSSProperties } from "react";
import type { TechId } from "@/lib/game";

import github from "@/assets/tech/github.svg?raw";
import git from "@/assets/tech/git.svg?raw";
import docker from "@/assets/tech/docker.svg?raw";
import kubernetes from "@/assets/tech/kubernetes.svg?raw";
import adobe from "@/assets/tech/adobe.svg?raw";
import postgres from "@/assets/tech/postgres.svg?raw";
import mongodb from "@/assets/tech/mongodb.svg?raw";
import antigravity from "@/assets/tech/antigravity.svg?raw";
import claude from "@/assets/tech/claude.svg?raw";
import openai from "@/assets/tech/openai.svg?raw";
import perplexity from "@/assets/tech/perplexity.svg?raw";
import linux from "@/assets/tech/linux.svg?raw";
import python from "@/assets/tech/python.svg?raw";
import nodejs from "@/assets/tech/nodejs.svg?raw";
import react from "@/assets/tech/react.svg?raw";
import gemini from "@/assets/tech/gemini.svg?raw";
import aws from "@/assets/tech/aws.svg?raw";
import vscode from "@/assets/tech/vscode.svg?raw";
import npm from "@/assets/tech/npm.svg?raw";
import spacex from "@/assets/tech/spacex.svg?raw";

const MARKS: Record<TechId, string> = {
  github,
  git,
  docker,
  kubernetes,
  adobe,
  postgres,
  mongodb,
  antigravity,
  claude,
  openai,
  perplexity,
  linux,
  python,
  nodejs,
  react,
  gemini,
  aws,
  vscode,
  npm,
  spacex,
};

/** Real brand mark, rendered monochrome via CSS for a consistent look. */
export function TechMark({
  id,
  size = 96,
  style,
}: {
  id: TechId;
  size?: number;
  style?: CSSProperties;
}) {
  const svg = MARKS[id] ?? MARKS.git;
  return (
    <span
      className="tech-mark"
      style={{ width: size, height: size, ...style }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
