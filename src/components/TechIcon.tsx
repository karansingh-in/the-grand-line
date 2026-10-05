import type { TechId } from "@/lib/game";

function Base({ children, size = 96 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const PATHS: Record<TechId, (size: number) => React.ReactNode> = {
  github: (s) => (
    <Base size={s}>
      <path
        d="M24 6c-9.4 0-17 7.6-17 17 0 7.5 4.9 13.9 11.6 16.1.9.2 1.2-.4 1.2-.8v-2.8c-4.7 1-5.7-2.3-5.7-2.3-.8-1.9-1.9-2.5-1.9-2.5-1.5-1 .1-1 .1-1 1.7.1 2.6 1.7 2.6 1.7 1.5 2.6 4 1.9 5 1.4.2-1.1.6-1.9 1.1-2.3-3.8-.4-7.7-1.9-7.7-8.4 0-1.9.7-3.4 1.7-4.6-.2-.4-.7-2.2.2-4.5 0 0 1.4-.5 4.7 1.8a16 16 0 0 1 8.6 0c3.3-2.3 4.7-1.8 4.7-1.8.9 2.3.3 4.1.2 4.5 1 1.2 1.7 2.7 1.7 4.6 0 6.5-4 8-7.8 8.4.6.5 1.2 1.6 1.2 3.2v4.8c0 .4.3 1 1.2.8 6.7-2.2 11.6-8.6 11.6-16.1 0-9.4-7.6-17-17-17Z"
        fill="currentColor"
        stroke="none"
      />
    </Base>
  ),
  git: (s) => (
    <Base size={s}>
      <circle cx="14" cy="12" r="4" />
      <circle cx="14" cy="36" r="4" />
      <circle cx="34" cy="24" r="4" />
      <path d="M14 16v16M14 28c0-4 4-4 8-4h4" />
      <path d="M26 20h-2" />
    </Base>
  ),
  docker: (s) => (
    <Base size={s}>
      <rect x="10" y="26" width="8" height="6" />
      <rect x="19" y="26" width="8" height="6" />
      <rect x="28" y="26" width="8" height="6" />
      <rect x="14" y="19" width="8" height="6" />
      <rect x="23" y="19" width="8" height="6" />
      <rect x="19" y="12" width="8" height="6" />
      <path d="M8 36h32M10 40h28" />
    </Base>
  ),
  kubernetes: (s) => (
    <Base size={s}>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="4" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1="24"
          y1="24"
          x2={24 + 12 * Math.cos((i * 2 * Math.PI) / 7)}
          y2={24 + 12 * Math.sin((i * 2 * Math.PI) / 7)}
        />
      ))}
    </Base>
  ),
  redis: (s) => (
    <Base size={s}>
      <path d="M24 6 40 14 24 22 8 14Z" />
      <path d="M8 22l16 8 16-8" />
      <path d="M8 30l16 8 16-8" />
    </Base>
  ),
  postgres: (s) => (
    <Base size={s}>
      <path d="M14 40V16c0-4 3-7 7-7h9c4 0 7 3 7 7v3" />
      <path d="M37 19c2 8-1 15-8 18-2 1-2 3 1 3h4" />
      <circle cx="22" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <path d="M14 28h8M14 40h10" />
    </Base>
  ),
  mongodb: (s) => (
    <Base size={s}>
      <path d="M24 4c6 8 10 14 10 22a10 10 0 0 1-20 0c0-8 4-14 10-22Z" />
      <path d="M24 12v24M24 20l6-3M24 26l-6-3" />
    </Base>
  ),
  kafka: (s) => (
    <Base size={s}>
      <path d="M14 6v36M14 24l16-14M18 26l18 16M14 24l8 2" />
    </Base>
  ),
  terraform: (s) => (
    <Base size={s}>
      <path d="M8 14h32M8 24h32M8 34h20" />
      <path d="M18 14v20M30 14v10" />
    </Base>
  ),
  prometheus: (s) => (
    <Base size={s}>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 12c3 5 5 8 5 12a5 5 0 0 1-10 0c0-4 2-7 5-12Z" />
      <path d="M18 34h12" />
    </Base>
  ),
  grafana: (s) => (
    <Base size={s}>
      <path d="M10 30a14 14 0 1 0 4-10" />
      <path d="M14 30a10 10 0 1 0 3-7" />
      <circle cx="24" cy="30" r="2.4" fill="currentColor" stroke="none" />
    </Base>
  ),
  linux: (s) => (
    <Base size={s}>
      <path d="M24 6c5 0 8 4 8 9l3 4-3 2c1 3 2 6 1 9l-4 6c-1 2-4 3-5 3s-4-1-5-3l-4-6c-1-3 0-6 1-9l-3-2 3-4c0-5 3-9 8-9Z" />
      <circle cx="21" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="27" cy="16" r="1.4" fill="currentColor" stroke="none" />
      <path d="M18 34h12" />
    </Base>
  ),
  python: (s) => (
    <Base size={s}>
      <path d="M18 6h12a6 6 0 0 1 6 6v6H24v4h12v6a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6v-6h12v-4H12V12a6 6 0 0 1 6-6Z" />
      <circle cx="29" cy="13" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  ),
  nodejs: (s) => (
    <Base size={s}>
      <path d="M24 5 40 14v20L24 43 8 34V14Z" />
      <path d="M19 28l-2-2 4-7 3 1-3 5 4 1-2 5-4-3ZM29 20v10c0 2-2 3-4 2" />
    </Base>
  ),
  react: (s) => (
    <Base size={s}>
      <circle cx="24" cy="24" r="2.6" fill="currentColor" stroke="none" />
      <ellipse cx="24" cy="24" rx="17" ry="6.5" />
      <ellipse cx="24" cy="24" rx="17" ry="6.5" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="17" ry="6.5" transform="rotate(120 24 24)" />
    </Base>
  ),
  nginx: (s) => (
    <Base size={s}>
      <path d="M12 38V10l24 28V10" />
      <path d="M12 10h5M31 38h5" />
    </Base>
  ),
  aws: (s) => (
    <Base size={s}>
      <path d="M8 30c6 6 14 9 22 6 3-1 5-3 6-3" />
      <path d="M34 33l4 3 1-5" />
      <path d="M12 16c2-3 6-4 10-3M20 22c-4 0-8-2-9-5" />
    </Base>
  ),
  vscode: (s) => (
    <Base size={s}>
      <path d="M32 6 12 24l20 18 6-4V10Z" />
      <path d="M32 6 18 24l14 18" />
    </Base>
  ),
  npm: (s) => (
    <Base size={s}>
      <rect x="8" y="12" width="32" height="24" />
      <path d="M14 30V20h5l2 6 2-6h5v10M32 30v-6" />
    </Base>
  ),
  postman: (s) => (
    <Base size={s}>
      <circle cx="24" cy="18" r="9" />
      <path d="M15 18h18M24 9v18" />
      <path d="M12 36h24l-3 6H15Z" />
    </Base>
  ),
};

export function TechIcon({ id, size = 96 }: { id: TechId; size?: number }) {
  const render = PATHS[id] ?? PATHS.git;
  return render(size);
}
