import { Photo, PhotoLibrary } from "@/domain/photo";

const photos: Photo[] = [
  {
    id: "1",
    title: "Tokyo crosswalk",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-08-15",
    tags: ["travel", "neon", "night"],
    category: "travel",
  },
  {
    id: "2",
    title: "Beach, 2023",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2023-07-20",
    tags: ["beach", "friends", "sunset"],
    category: "travel",
  },
  {
    id: "3",
    title: "Nightlife",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-10-05",
    tags: ["nightlife", "blur", "35mm"],
    category: "everyday",
  },
  {
    id: "4",
    title: "Crowded streets",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-09-12",
    tags: ["travel", "urban", "film"],
    category: "travel",
  },
  {
    id: "5",
    title: "Pink bikini",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2023-08-01",
    tags: ["beach", "friends", "warm"],
    category: "everyday",
  },
  {
    id: "6",
    title: "Soft sunset",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-07-18",
    tags: ["sunset", "travel", "grain"],
    category: "travel",
  },
];

export const photoLibrary = new PhotoLibrary(photos);

