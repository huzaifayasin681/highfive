export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  qualifications: string[];
  rate: number;
  schedule: Record<string, string[]>;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  bio: string;
  introVideoPlaceholder: string;
  status?: 'approved' | 'pending';
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  goals: string[];
  savedTutors: string[];
}

export interface Lesson {
  id: string;
  tutorId: string;
  studentId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}

export interface Payment {
  id: string;
  lessonId: string;
  amount: number;
  status: 'paid' | 'refunded' | 'pending';
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  content: string;
  attachments?: string[];
}

export interface CurrentUser {
  id: string;
  role: 'student' | 'tutor' | 'admin';
  name: string;
}

export interface GlobalState {
  tutors: Tutor[];
  students: Student[];
  lessons: Lesson[];
  payments: Payment[];
  messages: Message[];
  currentUser: CurrentUser | null;
}
