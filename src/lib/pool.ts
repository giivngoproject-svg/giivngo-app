import type { Campaign, Contribution, PoolMode } from "./types";

export const POOL_MODES: PoolMode[] = ["standard", "mystery", "blind", "tiers"];

export const POOL_MODE_LABELS: Record<PoolMode, string> = {
  standard: "Standard",
  mystery: "Mystery amount",
  blind: "Blind pool",
  tiers: "Fixed tiers",
};

export const POOL_MODE_DESCRIPTIONS: Record<PoolMode, string> = {
  standard: "Visible goal, open amounts, and a public gift wall.",
  mystery: "Hide the goal — contributors see only the occasion and your story.",
  blind: "Names and amounts stay private. Everyone sees progress only.",
  tiers: "Contributors pick from fixed amounts you set. No freeform input.",
};

/** Persisted campaigns from before pool modes existed have no `pool_mode`. */
export function poolMode(c: Pick<Campaign, "pool_mode">): PoolMode {
  return c.pool_mode ?? "standard";
}

/** Goal/raised figures are hidden from contributors. */
export function isGoalHidden(c: Pick<Campaign, "pool_mode">): boolean {
  return poolMode(c) === "mystery";
}

/** Contributor identities and amounts are hidden from everyone but the creator. */
export function isContributorsHidden(c: Pick<Campaign, "pool_mode">): boolean {
  return poolMode(c) === "blind";
}

/** Contributions are locked to the campaign's fixed tiers. */
export function isTiered(c: Pick<Campaign, "pool_mode" | "tiers">): boolean {
  return poolMode(c) === "tiers" && (c.tiers?.length ?? 0) > 0;
}

export function tipTotal(contributions: Contribution[]): number {
  return contributions.reduce((sum, c) => sum + (c.tip_amount || 0), 0);
}
