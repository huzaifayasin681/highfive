export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  qualifications: string[];
  rate: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  bio: string;
  status?: 'approved' | 'pending';
}

export interface GlobalState {
  tutors: Tutor[];
}
