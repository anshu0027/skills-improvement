import type { DesignTrack } from "./types";
import { systemDesignTrack } from "./system-design";
import { dbDesignTrack } from "./db-design";

export const designTracks: DesignTrack[] = [systemDesignTrack, dbDesignTrack];

export function getDesignTrack(slug: string): DesignTrack | undefined {
  return designTracks.find((track) => track.slug === slug);
}

export { systemDesignTrack, dbDesignTrack };
