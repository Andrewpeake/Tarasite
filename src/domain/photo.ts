export type PhotoCategory = "portrait" | "travel" | "everyday" | "experimental";

export interface Photo {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl: string;
  takenAt?: string;
  tags: string[];
  category?: PhotoCategory;
}

export class PhotoLibrary {
  private photos: Photo[];

  constructor(photos: Photo[]) {
    this.photos = photos;
  }

  all(): Photo[] {
    return [...this.photos];
  }

  byCategory(category: PhotoCategory): Photo[] {
    return this.photos.filter((photo) => photo.category === category);
  }

  tagged(tag: string): Photo[] {
    return this.photos.filter((photo) => photo.tags.includes(tag));
  }
}

