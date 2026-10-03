import { describe, expect, it } from "vitest";
import { parseScannedTarget, isScannablePath } from "@/lib/qr";

const ORIGIN = "https://the-grand-line-tqyy.vercel.app";

describe("parseScannedTarget", () => {
  it("accepts same-origin game links", () => {
    expect(parseScannedTarget(`${ORIGIN}/fragment?id=3`, ORIGIN)).toEqual({
      path: "/fragment",
      search: { id: "3" },
    });
    expect(parseScannedTarget(`${ORIGIN}/decoy`, ORIGIN)).toEqual({
      path: "/decoy",
      search: {},
    });
  });

  it("rejects other origins and non-URLs", () => {
    expect(parseScannedTarget("https://evil.example/fragment?id=1", ORIGIN)).toBeNull();
    expect(parseScannedTarget("not a qr", ORIGIN)).toBeNull();
    expect(parseScannedTarget("", ORIGIN)).toBeNull();
  });
});

describe("isScannablePath", () => {
  it("allows game routes only", () => {
    expect(isScannablePath("/fragment")).toBe(true);
    expect(isScannablePath("/admin")).toBe(false);
  });
});
