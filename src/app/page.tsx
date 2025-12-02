import { identityProfile } from "@/data/identity";
import { photoLibrary } from "@/data/photos";
import { writings } from "@/data/writings";
import { experiences } from "@/data/experience";
import { artifacts } from "@/data/artifacts";
import LinkedInHero from "@/components/identity/LinkedInHero";
import AboutStrip from "@/components/identity/AboutStrip";
import SocialLinks from "@/components/identity/SocialLinks";
import ThreeGallerySection from "@/components/three/ThreeGallerySection";
import Section from "@/components/layout/Section";
import PhotoDiarySection from "@/components/photos/PhotoDiarySection";
import Carousel from "@/components/writing/Carousel";
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
      <PhotoDiarySection photos={photoLibrary.all()} />

      {/* Writing & Articles Section */}
      <Carousel writings={writings} />

      {/* Experience / Timeline Section */}
      <Section id="experience" title="Experience" eyebrow="Work & Roles">
        <ExperienceTimeline experiences={experiences} />
      </Section>
    </>
  );
}


