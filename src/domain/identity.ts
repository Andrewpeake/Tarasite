export interface IdentityProfile {
  name: string;
  tagline: string;
  bio: string;
  location?: string;
  links: Record<string, string | undefined>;
  roles?: string[]; // e.g., ["Senior Culture Editor", "Business Dev Intern"]
}

