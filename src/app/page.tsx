import { identityProfile } from "@/data/identity";
import { photoLibrary } from "@/data/photos";
import { writings } from "@/data/writings";
import IdentityHeader from "@/components/identity/IdentityHeader";
import AboutStrip from "@/components/identity/AboutStrip";
import Section from "@/components/layout/Section";
import PhotoGrid from "@/components/photos/PhotoGrid";
import WritingList from "@/components/writing/WritingList";
import PinnedChapter from "@/components/animations/PinnedChapter";
import ParallaxBlock from "@/components/animations/ParallaxBlock";

export default function Home() {
  return (
    <>
      <IdentityHeader profile={identityProfile} />

      <AboutStrip />

      <PinnedChapter
        pinDurationFactor={1.5}
        heading="This space is allowed to be inconsistent"
        subheading="Scroll slowly"
      >
        <ParallaxBlock fromY={0} toY={-50}>
          <div className="max-w-2xl mx-auto px-6">
            <div className="rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 md:p-12 border border-neutral-800">
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed">
                This space is allowed to be inconsistent, unfinished, and deeply
                human. Scroll slowly.
              </p>
            </div>
          </div>
        </ParallaxBlock>
      </PinnedChapter>

      <Section id="photos" title="Photos" eyebrow="Visual fragments">
        <PhotoGrid photos={photoLibrary.all()} />
      </Section>

      <Section id="writing" title="Writing" eyebrow="Words that stuck around">
        <WritingList writings={writings} />
      </Section>
    </>
  );
}

