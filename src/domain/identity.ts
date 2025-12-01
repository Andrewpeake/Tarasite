export interface IdentityProfile {
  name: string;
  tagline: string;
  bio: string;
  location?: string;
  links: Record<string, string | undefined>;
}

