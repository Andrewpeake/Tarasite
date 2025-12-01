export interface Experience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string; // undefined means "Present"
  summary: string[];
  location?: string;
}

