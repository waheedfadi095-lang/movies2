import fs from "fs";
import path from "path";
import { augmentHomeSnapshotWithTvIfMissing } from "@/lib/homeSnapshotTv.server";
import HomePageClient from "./HomePageClient";
import type { ServerHomeSnapshot } from "./HomePageClient";

export default function HomePage() {
  let serverSnapshot: ServerHomeSnapshot = null;
  try {
    const p = path.join(process.cwd(), "app", "data", "homeSnapshot.json");
    serverSnapshot = JSON.parse(fs.readFileSync(p, "utf8")) as ServerHomeSnapshot;
  } catch {
    serverSnapshot = null;
  }
  serverSnapshot = augmentHomeSnapshotWithTvIfMissing(
    serverSnapshot as Record<string, unknown> | null,
    16
  ) as ServerHomeSnapshot;
  return <HomePageClient serverSnapshot={serverSnapshot} />;
}
