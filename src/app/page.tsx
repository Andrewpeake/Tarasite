import { identityProfile } from "@/data/identity";
import { photoLibrary } from "@/data/photos";
import { writings } from "@/data/writings";
import { experiences } from "@/data/experience";
import { artifacts } from "@/data/artifacts";
import LinkedInHero from "@/components/identity/LinkedInHero";
import AboutStrip from "@/components/identity/AboutStrip";
import ThreeGallerySection from "@/components/three/ThreeGallerySection";
import Section from "@/components/layout/Section";
import PhotoGrid from "@/components/photos/PhotoGrid";
import EditorialGrid from "@/components/writing/EditorialGrid";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";

export default function Home() {
  return (
    <>
      {/* LinkedIn-style Hero */}
      <LinkedInHero profile={identityProfile} />

      {/* About / Identity Strip */}
      <AboutStrip />

      {/* 3D Gallery Wheel Section */}
      <ThreeGallerySection artifacts={artifacts} />

      {/* Photo Diary Section */}
      <Section id="photos" title="Photo Diary" eyebrow="Fragments">
        <PhotoGrid photos={photoLibrary.all()} />
      </Section>

      {/* Writing & Articles Section */}
      <Section
        id="writing"
        title="Writing & Editing"
        eyebrow="Culture, internet, brain stuff"
      >
        <EditorialGrid writings={writings} />
      </Section>

      {/* Experience / Timeline Section */}
      <Section id="experience" title="Experience" eyebrow="Work & Roles">
        <ExperienceTimeline experiences={experiences} />
      </Section>
    </>
  );
}


