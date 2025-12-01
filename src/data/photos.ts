import { Photo, PhotoLibrary } from "@/domain/photo";

const photos: Photo[] = [
  {
    id: "1",
    title: "Morning Light",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-01-15",
    tags: ["minimal", "interior"],
    category: "everyday",
  },
  {
    id: "2",
    title: "City Streets",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-02-20",
    tags: ["urban", "street"],
    category: "travel",
  },
  {
    id: "3",
    title: "Portrait Study",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-03-10",
    tags: ["portrait", "bw"],
    category: "portrait",
  },
  {
    id: "4",
    title: "Abstract",
    url: "/sample-photos/study.jpg",
    thumbnailUrl: "/sample-photos/study.jpg",
    takenAt: "2024-03-25",
    tags: ["abstract", "experimental"],
    category: "experimental",
  },
];

export const photoLibrary = new PhotoLibrary(photos);

