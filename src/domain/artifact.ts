export type ArtifactKind = "photo" | "article" | "project";

export interface Artifact {
  id: string;
  title: string;
  kind: ArtifactKind;
  imageUrl: string; // texture for the card
  label?: string; // short label shown in overlay (e.g., "TOKYO", "VIETNAM")
  count?: number; // optional number in parentheses
}

