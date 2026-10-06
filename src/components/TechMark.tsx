import type { CSSProperties } from "react";
import type { TechId } from "@/lib/game";

import github from "@/assets/tech/github.svg?raw";
import git from "@/assets/tech/git.svg?raw";
import docker from "@/assets/tech/docker.svg?raw";
import kubernetes from "@/assets/tech/kubernetes.svg?raw";
import redis from "@/assets/tech/redis.svg?raw";
import postgres from "@/assets/tech/postgres.svg?raw";
import mongodb from "@/assets/tech/mongodb.svg?raw";
import kafka from "@/assets/tech/kafka.svg?raw";
import claude from "@/assets/tech/claude.svg?raw";
import openai from "@/assets/tech/openai.svg?raw";
import perplexity from "@/assets/tech/perplexity.svg?raw";
import linux from "@/assets/tech/linux.svg?raw";
import python from "@/assets/tech/python.svg?raw";
import nodejs from "@/assets/tech/nodejs.svg?raw";
import react from "@/assets/tech/react.svg?raw";
import nginx from "@/assets/tech/nginx.svg?raw";
import aws from "@/assets/tech/aws.svg?raw";
import vscode from "@/assets/tech/vscode.svg?raw";
import npm from "@/assets/tech/npm.svg?raw";
import postman from "@/assets/tech/postman.svg?raw";

const MARKS: Record<TechId, string> = {
  github,
  git,
  docker,
  kubernetes,
  redis,
  postgres,
  mongodb,
  kafka,
  claude,
  openai,
  perplexity,
  linux,
  python,
  nodejs,
  react,
  nginx,
  aws,
  vscode,
  npm,
  postman,
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
