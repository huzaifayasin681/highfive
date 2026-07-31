export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  phone?: string | null;
  subjects: string[];
  qualifications: string[];
  rate: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  bio: string;
  status?: 'approved' | 'pending';
  city?: string;
  online?: boolean;
  responseTime?: string;
  experienceYears?: number;
  languages?: string[];
  studentsTaught?: number;
  mode?: 'online' | 'in-person' | 'both';
  videoUrl?: string;
}

export interface GlobalState {
  tutors: Tutor[];
}
