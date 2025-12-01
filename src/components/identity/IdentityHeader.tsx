"use client";

import { IdentityProfile } from "@/domain/identity";
import SplitTextReveal from "../animations/SplitTextReveal";

interface IdentityHeaderProps {
  profile: IdentityProfile;
}

export default function IdentityHeader({ profile }: IdentityHeaderProps) {
  const linkEntries = Object.entries(profile.links).filter(
    ([, url]) => url !== undefined
  );

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-medium text-neutral-100 mb-4">
            {profile.name}
          </h1>
          <SplitTextReveal
            text={profile.tagline}
            as="p"
            className="text-xl md:text-2xl text-neutral-400 mb-6"
          />
          <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
            {profile.bio}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {profile.location && (
            <div className="text-sm text-neutral-400 mb-2">
              {profile.location}
            </div>
          )}
          {linkEntries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {linkEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 transition-colors"
                >
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

