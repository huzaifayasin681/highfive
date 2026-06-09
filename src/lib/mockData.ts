import { GlobalState, Tutor, Student, Lesson, Payment, Message } from '@/types';

const mockTutors: Tutor[] = [
  {
    id: 't1',
    name: 'Ayesha Siddiqui',
    avatar: 'https://i.pravatar.cc/150?u=ayesha',
    subjects: ['Mathematics', 'Physics'],
    qualifications: ['MSc Physics, NUST Islamabad', '6+ years tutoring experience'],
    rate: 1200,
    schedule: {
      '2026-06-08': ['10:00', '11:00', '14:00', '15:00'],
      '2026-06-09': ['09:00', '13:00'],
    },
    rating: 4.9,
    reviewsCount: 134,
    isFeatured: true,
    bio: 'I specialize in making Mathematics and Physics easy to understand. My proven 5-step method guarantees a grade improvement for every student.',
    introVideoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    status: 'approved'
  },
  {
    id: 't2',
    name: 'Bilal Ahmed Qureshi',
    avatar: 'https://i.pravatar.cc/150?u=bilal',
    subjects: ['Computer Science', 'Web Development', 'React'],
    qualifications: ['Senior Software Engineer @ Systems Ltd', 'BSc CS, FAST NUCES Lahore'],
    rate: 1800,
    schedule: {
      '2026-06-08': ['18:00', '19:00', '20:00'],
      '2026-06-10': ['17:00', '18:00'],
    },
    rating: 5.0,
    reviewsCount: 97,
    isFeatured: true,
    bio: 'Learn coding from an industry professional. I focus on React, Node.js and real-world projects that will get you hired at top Pakistani tech companies.',
    introVideoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    status: 'approved'
  },
  {
    id: 't3',
    name: 'Fatima Zahra Malik',
    avatar: 'https://i.pravatar.cc/150?u=fatima',
    subjects: ['English Literature', 'IELTS', 'Communication Skills'],
    qualifications: ['MA English, University of Punjab Lahore', 'IELTS Score 8.5', 'Native Bilingual Speaker'],
    rate: 900,
    schedule: {
      '2026-06-08': ['08:00', '09:00'],
      '2026-06-11': ['10:00', '11:00', '12:00'],
    },
    rating: 4.8,
    reviewsCount: 218,
    isFeatured: true,
    bio: 'Expert in IELTS preparation and English communication. My immersive approach builds fluency and confidence that gets students their target band scores.',
    introVideoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    status: 'approved'
  },
  {
    id: 't4',
    name: 'Usman Tariq',
    avatar: 'https://i.pravatar.cc/150?u=usman',
    subjects: ['Chemistry', 'Biology', 'Entry Test Prep'],
    qualifications: ['MBBS Student, AIMC Lahore', 'MDCAT Score 185/200'],
    rate: 1500,
    schedule: {},
    rating: 0,
    reviewsCount: 0,
    isFeatured: false,
    bio: 'Helping students ace MDCAT and FSc exams. Chemistry and Biology are my passion, and I love making these subjects approachable and exciting.',
    introVideoPlaceholder: '',
    status: 'pending'
  }
];

const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Hamza Rehman',
    grade: 'FSc Pre-Engineering',
    goals: ['MDCAT/ECAT preparation', 'Learn web development'],
    savedTutors: ['t1', 't2']
  }
];

const mockLessons: Lesson[] = [
  {
    id: 'l1',
    tutorId: 't1',
    studentId: 's1',
    date: '2026-06-08',
    time: '14:00',
    status: 'confirmed',
    notes: 'Focus on Calculus: limits and derivatives review.'
  },
  {
    id: 'l2',
    tutorId: 't2',
    studentId: 's1',
    date: '2026-06-10',
    time: '18:00',
    status: 'pending',
    notes: 'Introduction to React components and props.'
  }
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 's1',
    receiverId: 't1',
    timestamp: '2026-06-07T10:00:00Z',
    content: 'Hi Ayesha, can we review derivatives in tomorrow\'s session?'
  },
  {
    id: 'm2',
    senderId: 't1',
    receiverId: 's1',
    timestamp: '2026-06-07T10:15:00Z',
    content: 'Absolutely Hamza! I have prepared some practice problems for us. See you then!'
  }
];

const mockPayments: Payment[] = [
  {
    id: 'p1',
    lessonId: 'l1',
    amount: 1200,
    status: 'paid',
    date: '2026-06-06T15:30:00Z'
  }
];

export const initialMockData: GlobalState = {
  tutors: mockTutors,
  students: mockStudents,
  lessons: mockLessons,
  payments: mockPayments,
  messages: mockMessages,
  currentUser: { id: 's1', role: 'student', name: 'Hamza Rehman' }
};
