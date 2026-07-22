import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "Economics",
  "Accounting",
  "Urdu",
  "Islamic Studies",
];

async function main() {
  console.log("Seeding database…");

  // Subjects -----------------------------------------------------------------
  await Promise.all(
    SUBJECTS.map((name) =>
      prisma.subject.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
  console.log(`  ✓ ${SUBJECTS.length} subjects`);

  const passwordHash = await bcrypt.hash("password123", 10);

  // Admin --------------------------------------------------------------------
  await prisma.user.upsert({
    where: { email: "admin@highfive.test" },
    update: { name: "Abid Maqsood" },
    create: {
      role: "ADMIN",
      name: "Abid Maqsood",
      email: "admin@highfive.test",
      passwordHash,
      emailVerified: true,
    },
  });
  console.log("  ✓ admin@highfive.test (Abid Maqsood)");

  // Student ------------------------------------------------------------------
  await prisma.user.upsert({
    where: { email: "student@highfive.test" },
    update: {},
    create: {
      role: "STUDENT",
      name: "Sara Ahmed",
      email: "student@highfive.test",
      passwordHash,
      emailVerified: true,
      registrationPaid: true,
      studentProfile: { create: { location: "Lahore, Pakistan" } },
    },
  });
  console.log("  ✓ student@highfive.test");

  // Teacher ------------------------------------------------------------------
  const math = await prisma.subject.findUnique({ where: { name: "Mathematics" } });
  const physics = await prisma.subject.findUnique({ where: { name: "Physics" } });

  await prisma.user.upsert({
    where: { email: "teacher@highfive.test" },
    update: {},
    create: {
      role: "TEACHER",
      name: "Ayesha Siddiqui",
      email: "teacher@highfive.test",
      passwordHash,
      emailVerified: true,
      teacherProfile: {
        create: {
          bio: "I specialize in making Mathematics and Physics easy to understand. My proven step-by-step method has helped over a hundred students improve their grades, build genuine confidence, and actually enjoy problem solving along the way.",
          qualifications: "MSc Physics, NUST Islamabad",
          experienceYears: 6,
          hourlyRate: 1200,
          location: "Islamabad, Pakistan",
          mode: "both",
          verified: true,
          verificationStatus: "approved",
          rating: 4.9,
          reviewsCount: 134,
          online: true,
          responseTime: "within 1 hour",
          studentsTaught: 420,
          photoUrl: "https://i.pravatar.cc/150?u=ayesha",
          subjects: {
            connect: [math, physics].filter(Boolean).map((s) => ({ id: s!.id })),
          },
        },
      },
    },
  });
  console.log("  ✓ teacher@highfive.test (Ayesha Siddiqui)");

  // Directory teachers ------------------------------------------------------
  await seedDirectoryTeachers(passwordHash);

  // Editable site content ----------------------------------------------------
  await seedContent();

  // Realistic activity -------------------------------------------------------
  await seedStudents(passwordHash);
  await seedReviews();
  await seedRequirements();
  await seedThreads();
  await seedContactMessages();
  await seedAuditLog();
  await seedPayments();

  console.log("\nSeed complete. All accounts use password: password123");
}

const CONTENT_DEFAULTS: Record<string, string> = {
  about_headline: "Empowering Pakistan to learn, one lesson at a time",
  about_mission:
    "HighFive exists to connect ambitious students across Pakistan with verified, high-quality tutors — no matter their city or budget. We believe great teaching should be accessible to everyone, from MDCAT hopefuls in Karachi to O-Level students in Peshawar.",
  about_story:
    "Founded in 2024, HighFive started with a simple idea: finding a trustworthy tutor in Pakistan shouldn't be a guessing game. Today thousands of students learn with us online and in person, and hundreds of tutors have built thriving teaching practices on the platform.",
  about_safety:
    "Every tutor is manually verified by our team before they appear in the directory. We review qualifications and profiles, and our moderation team acts quickly on any report — so students and parents can connect with confidence.",
};

async function seedContent() {
  for (const [key, value] of Object.entries(CONTENT_DEFAULTS)) {
    await prisma.contentBlock.upsert({
      where: { key },
      update: {}, // never clobber admin edits on re-seed
      create: { key, value },
    });
  }
  console.log(`  ✓ ${Object.keys(CONTENT_DEFAULTS).length} content blocks`);
}

type SeedTeacher = {
  name: string;
  avatar: string;
  subjects: string[];
  qualifications: string[];
  rate: number;
  rating: number;
  reviewsCount: number;
  bio: string;
  city: string;
  online: boolean;
  responseTime: string;
  experienceYears: number;
  studentsTaught: number;
  mode: string;
};

const DIRECTORY_TEACHERS: SeedTeacher[] = [
  {
    name: "Bilal Ahmed Qureshi",
    avatar: "https://i.pravatar.cc/150?u=bilal",
    subjects: ["Computer Science", "Web Development", "React"],
    qualifications: ["Senior Software Engineer @ Systems Ltd", "BSc CS, FAST NUCES Lahore"],
    rate: 1800,
    rating: 5.0,
    reviewsCount: 97,
    bio: "Learn coding from an industry professional. I focus on React, Node.js and real-world projects that will get you hired at top Pakistani tech companies.",
    city: "Lahore",
    online: true,
    responseTime: "within 2 hours",
    experienceYears: 5,
    studentsTaught: 260,
    mode: "online",
  },
  {
    name: "Fatima Zahra Malik",
    avatar: "https://i.pravatar.cc/150?u=fatima",
    subjects: ["English", "IELTS", "Communication Skills"],
    qualifications: ["MA English, University of Punjab Lahore", "IELTS Score 8.5"],
    rate: 900,
    rating: 4.8,
    reviewsCount: 218,
    bio: "Expert in IELTS preparation and English communication. My immersive approach builds fluency and confidence that gets students their target band scores.",
    city: "Lahore",
    online: true,
    responseTime: "within 30 mins",
    experienceYears: 9,
    studentsTaught: 640,
    mode: "both",
  },
  {
    name: "Usman Tariq",
    avatar: "https://i.pravatar.cc/150?u=usman",
    subjects: ["Chemistry", "Biology", "MDCAT Prep"],
    qualifications: ["MBBS Student, AIMC Lahore", "MDCAT Score 185/200"],
    rate: 1500,
    rating: 4.7,
    reviewsCount: 42,
    bio: "Helping students ace MDCAT and FSc exams. Chemistry and Biology are my passion, and I love making these subjects approachable and exciting.",
    city: "Faisalabad",
    online: false,
    responseTime: "within 3 hours",
    experienceYears: 3,
    studentsTaught: 130,
    mode: "both",
  },
  {
    name: "Sara Imran",
    avatar: "https://i.pravatar.cc/150?u=saraimran",
    subjects: ["Mathematics", "Statistics", "A-Levels"],
    qualifications: ["MSc Mathematics, QAU Islamabad", "A-Level Specialist, 8 years experience"],
    rate: 1400,
    rating: 4.9,
    reviewsCount: 178,
    bio: "Dedicated math tutor with a passion for turning confusion into clarity. A-Level and FSc students consistently achieve A grades under my guidance.",
    city: "Islamabad",
    online: true,
    responseTime: "within 1 hour",
    experienceYears: 8,
    studentsTaught: 510,
    mode: "online",
  },
  {
    name: "Hamid Raza",
    avatar: "https://i.pravatar.cc/150?u=hamidraza",
    subjects: ["Physics", "Engineering", "ECAT Prep"],
    qualifications: ["BSc Electrical Engineering, UET Lahore", "ECAT Score 98th Percentile"],
    rate: 1600,
    rating: 4.8,
    reviewsCount: 89,
    bio: "UET graduate helping students crack ECAT and master Physics. My problem-solving focused approach makes complex concepts click instantly.",
    city: "Lahore",
    online: true,
    responseTime: "within 2 hours",
    experienceYears: 4,
    studentsTaught: 200,
    mode: "both",
  },
  {
    name: "Mahnoor Abbasi",
    avatar: "https://i.pravatar.cc/150?u=mahnoor",
    subjects: ["Accounting", "Economics", "Business Studies"],
    qualifications: ["ACCA Affiliate", "BBA, IBA Karachi"],
    rate: 1300,
    rating: 4.9,
    reviewsCount: 156,
    bio: "ACCA-qualified tutor making Accounting and Economics intuitive for O/A-Level and BBA students. I focus on exam technique and real-world examples.",
    city: "Karachi",
    online: true,
    responseTime: "within 1 hour",
    experienceYears: 7,
    studentsTaught: 380,
    mode: "online",
  },
  {
    name: "Imran Shah",
    avatar: "https://i.pravatar.cc/150?u=imranshah",
    subjects: ["Islamic Studies", "Urdu", "Quran"],
    qualifications: ["MA Islamic Studies, IIUI Islamabad", "Hafiz-e-Quran"],
    rate: 800,
    rating: 5.0,
    reviewsCount: 203,
    bio: "Patient and structured Quran, Tajweed and Islamiat tutor for all ages. Trusted by families across Pakistan for online and home tuition.",
    city: "Peshawar",
    online: true,
    responseTime: "within 30 mins",
    experienceYears: 10,
    studentsTaught: 720,
    mode: "both",
  },
];

function emailFor(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join(".") + "@highfive.test"
  );
}

async function seedDirectoryTeachers(passwordHash: string) {
  for (const t of DIRECTORY_TEACHERS) {
    // Ensure every referenced subject exists, then collect their ids.
    const subjectIds: { id: string }[] = [];
    for (const name of t.subjects) {
      const subject = await prisma.subject.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      subjectIds.push({ id: subject.id });
    }

    const email = emailFor(t.name);
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        role: "TEACHER",
        name: t.name,
        email,
        passwordHash,
        emailVerified: true,
        image: t.avatar,
        teacherProfile: {
          create: {
            bio: t.bio,
            qualifications: t.qualifications.join("\n"),
            experienceYears: t.experienceYears,
            hourlyRate: t.rate,
            location: `${t.city}, Pakistan`,
            mode: t.mode,
            photoUrl: t.avatar,
            verified: true,
            verificationStatus: "approved",
            rating: t.rating,
            reviewsCount: t.reviewsCount,
            online: t.online,
            responseTime: t.responseTime,
            studentsTaught: t.studentsTaught,
            subjects: { connect: subjectIds },
          },
        },
      },
    });
  }
  console.log(`  ✓ ${DIRECTORY_TEACHERS.length} directory teachers`);
}

// ── Realistic activity seeding ──────────────────────────────────────────────

const STUDENTS: { name: string; city: string }[] = [
  { name: "Zara Khalid", city: "Islamabad" },
  { name: "Ali Hassan", city: "Lahore" },
  { name: "Sana Mehmood", city: "Karachi" },
  { name: "Hassan Raza", city: "Rawalpindi" },
  { name: "Ayesha Noor", city: "Lahore" },
  { name: "Bilal Khan", city: "Peshawar" },
  { name: "Maryam Tariq", city: "Faisalabad" },
  { name: "Ahmed Saeed", city: "Karachi" },
  { name: "Fatima Iqbal", city: "Multan" },
  { name: "Usman Ali", city: "Islamabad" },
  { name: "Hira Shah", city: "Lahore" },
  { name: "Danish Malik", city: "Sialkot" },
];

const REVIEW_COMMENTS = [
  "Explains every concept so clearly — my grades jumped from a C to an A in two months.",
  "Incredibly patient and always available for extra questions. Highly recommend!",
  "Best decision I made before my exams. Genuinely cares about students.",
  "Punctual, professional and makes learning actually enjoyable.",
  "The mock tests were exactly like the real thing. Helped me hit my target score.",
  "Cleared all my doubts and built my confidence. Worth every rupee.",
  "Friendly, knowledgeable and never makes you feel silly for asking.",
  "Uses real-world examples that make tough topics finally click.",
  "My child looks forward to every lesson now. Brilliant teacher.",
  "Structured, focused sessions with clear homework. Saw results fast.",
  "Went above and beyond to help me prepare. Can't thank them enough.",
  "Calm, clear and very encouraging. Made a huge difference for me.",
];

async function seedStudents(passwordHash: string) {
  for (const s of STUDENTS) {
    const email = emailFor(s.name);
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        role: "STUDENT",
        name: s.name,
        email,
        passwordHash,
        emailVerified: true,
        registrationPaid: true,
        image: `https://i.pravatar.cc/100?u=${encodeURIComponent(email)}`,
        studentProfile: { create: { location: `${s.city}, Pakistan` } },
      },
    });
  }
  console.log(`  ✓ ${STUDENTS.length} students`);
}

async function seedReviews() {
  const teachers = await prisma.user.findMany({ where: { role: "TEACHER" } });
  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });
  if (students.length === 0) return;

  let total = 0;
  for (let t = 0; t < teachers.length; t++) {
    const teacher = teachers[t];
    // 5–10 reviews per teacher, from distinct students (deterministic rotation).
    const count = 5 + (t % 6);
    let sum = 0;
    let made = 0;
    for (let i = 0; i < count && i < students.length; i++) {
      const student = students[(t * 3 + i) % students.length];
      if (student.id === teacher.id) continue;
      // Mostly 5s, occasional 4 — believable distribution.
      const rating = (t + i) % 4 === 0 ? 4 : 5;
      const comment = REVIEW_COMMENTS[(t * 2 + i) % REVIEW_COMMENTS.length];
      const daysAgo = (i + 1) * 6 + t;
      await prisma.review.upsert({
        where: { authorId_targetId: { authorId: student.id, targetId: teacher.id } },
        update: {},
        create: {
          authorId: student.id,
          targetId: teacher.id,
          rating,
          comment,
          createdAt: new Date(Date.now() - daysAgo * 86_400_000),
        },
      });
      sum += rating;
      made++;
      total++;
    }
    if (made > 0) {
      await prisma.teacherProfile.updateMany({
        where: { userId: teacher.id },
        data: { rating: Math.round((sum / made) * 10) / 10, reviewsCount: made },
      });
    }
  }
  console.log(`  ✓ ${total} reviews (teacher ratings recomputed)`);
}

const REQUIREMENTS: { subject: string; level: string; mode: string; budget: string; city: string; description: string }[] = [
  { subject: "MDCAT Chemistry", level: "FSc Part 2", mode: "online", budget: "Rs 1500/hr", city: "Lahore", description: "Need an experienced tutor for MDCAT Chemistry, focusing on organic chemistry and past papers. Looking for 3 sessions a week before the test." },
  { subject: "O-Level Mathematics", level: "O-Level", mode: "either", budget: "Rs 1200/hr", city: "Karachi", description: "My son needs help with O-Level Maths (D1-D4). Struggling with algebra and trigonometry. Prefer evenings." },
  { subject: "IELTS Preparation", level: "Band 7 target", mode: "online", budget: "Rs 1000/hr", city: "Islamabad", description: "Preparing for IELTS Academic, aiming for band 7+. Need focused help with writing task 2 and speaking practice." },
  { subject: "A-Level Physics", level: "A-Level", mode: "in-person", budget: "Rs 2000/hr", city: "Lahore", description: "Looking for an A-Level Physics tutor in Lahore for in-person tuition. Need help with mechanics and electromagnetism." },
  { subject: "Web Development", level: "Beginner", mode: "online", budget: "Rs 1800/hr", city: "Rawalpindi", description: "Want to learn React and Node.js to build a portfolio and apply for jobs. Complete beginner but very motivated." },
  { subject: "Quran & Tajweed", level: "All ages", mode: "online", budget: "Rs 800/hr", city: "Peshawar", description: "Seeking a patient Quran tutor for my two kids (ages 8 and 11) for daily online Tajweed lessons after Maghrib." },
  { subject: "ECAT Mathematics", level: "Entry test", mode: "online", budget: "Rs 1600/hr", city: "Faisalabad", description: "Need ECAT Maths preparation, especially calculus and trigonometry. Test is in three months." },
  { subject: "Accounting (ACCA)", level: "ACCA F3", mode: "either", budget: "Rs 1400/hr", city: "Karachi", description: "Studying for ACCA Financial Accounting (F3) and need help understanding double entry and financial statements." },
];

async function seedRequirements() {
  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });
  if (students.length === 0) return;
  const existing = await prisma.requirement.count();
  if (existing > 0) {
    console.log(`  • requirements already present (${existing}); skipping`);
    return;
  }
  for (let i = 0; i < REQUIREMENTS.length; i++) {
    const r = REQUIREMENTS[i];
    const student = students[i % students.length];
    await prisma.requirement.create({
      data: {
        studentId: student.id,
        subject: r.subject,
        level: r.level,
        mode: r.mode,
        budget: r.budget,
        location: r.city,
        description: r.description,
        status: "open",
        createdAt: new Date(Date.now() - (i + 1) * 2 * 86_400_000),
      },
    });
  }
  console.log(`  ✓ ${REQUIREMENTS.length} student requirements`);
}

function threadId(a: string, b: string) {
  return [a, b].sort().join("__");
}

async function seedThreads() {
  const student = await prisma.user.findUnique({ where: { email: "student@highfive.test" } });
  if (!student) return;
  const ayesha = await prisma.user.findUnique({ where: { email: "teacher@highfive.test" } });
  const bilal = await prisma.user.findUnique({ where: { email: emailFor("Bilal Ahmed Qureshi") } });
  const existing = await prisma.message.count({ where: { OR: [{ senderId: student.id }, { receiverId: student.id }] } });
  if (existing > 0) {
    console.log("  • conversations already present; skipping");
    return;
  }

  const convos: { other: typeof ayesha; lines: { fromStudent: boolean; text: string }[] }[] = [
    {
      other: ayesha,
      lines: [
        { fromStudent: true, text: "Assalam o Alaikum! I'm preparing for FSc Physics and saw your profile. Are you taking new students?" },
        { fromStudent: false, text: "Walaikum Assalam Sara! Yes, I have a couple of evening slots free. Which topics are you finding difficult?" },
        { fromStudent: true, text: "Mostly electromagnetism and modern physics. Could we start with a trial this week?" },
        { fromStudent: false, text: "Of course. How about Thursday 6pm? We can do a free 30-minute trial to see if it's a good fit." },
      ],
    },
    {
      other: bilal,
      lines: [
        { fromStudent: true, text: "Hi Bilal, I want to learn React to build a portfolio. Do you teach complete beginners?" },
        { fromStudent: false, text: "Hi! Absolutely — most of my students start from zero. We'll build a real project step by step." },
        { fromStudent: true, text: "That sounds perfect. What's your availability on weekends?" },
      ],
    },
  ];

  let count = 0;
  for (const convo of convos) {
    if (!convo.other) continue;
    const tid = threadId(student.id, convo.other.id);
    for (let i = 0; i < convo.lines.length; i++) {
      const line = convo.lines[i];
      const sender = line.fromStudent ? student : convo.other;
      const receiver = line.fromStudent ? convo.other : student;
      await prisma.message.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          threadId: tid,
          content: line.text,
          // teacher replies left unread for the student to mimic a live inbox
          readAt: line.fromStudent ? new Date() : null,
          createdAt: new Date(Date.now() - (convo.lines.length - i) * 3_600_000),
        },
      });
      count++;
    }
  }
  console.log(`  ✓ ${count} messages across ${convos.length} conversations`);
}

const CONTACT_MESSAGES = [
  { name: "Imran Sheikh", email: "imran.sheikh@gmail.com", subject: "Partnership enquiry", message: "Assalam o Alaikum, I run a coaching centre in Gujranwala and would love to list our teachers on HighFive. Who can I speak to?" },
  { name: "Nadia Aslam", email: "nadia.aslam@outlook.com", subject: "Question about payments", message: "Hi, how do tutor payouts work and do you support EasyPaisa? Considering joining as an IELTS tutor." },
  { name: "Kamran Yousuf", email: "kamran.y@yahoo.com", subject: "", message: "Great platform! Is there an app coming soon for Android?" },
];

async function seedContactMessages() {
  const existing = await prisma.contactMessage.count();
  if (existing > 0) {
    console.log("  • contact messages already present; skipping");
    return;
  }
  for (let i = 0; i < CONTACT_MESSAGES.length; i++) {
    const c = CONTACT_MESSAGES[i];
    await prisma.contactMessage.create({
      data: {
        name: c.name,
        email: c.email,
        subject: c.subject || null,
        message: c.message,
        read: i === CONTACT_MESSAGES.length - 1, // leave the latest two unread
        createdAt: new Date(Date.now() - (i + 1) * 36 * 3_600_000),
      },
    });
  }
  console.log(`  ✓ ${CONTACT_MESSAGES.length} contact messages`);
}

async function seedAuditLog() {
  const admin = await prisma.user.findUnique({ where: { email: "admin@highfive.test" } });
  if (!admin) return;
  const existing = await prisma.auditLog.count();
  if (existing > 0) {
    console.log("  • audit log already present; skipping");
    return;
  }
  const teachers = await prisma.user.findMany({ where: { role: "TEACHER" }, take: 3 });
  for (let i = 0; i < teachers.length; i++) {
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "TEACHER_APPROVED",
        targetType: "TeacherProfile",
        targetId: teachers[i].id,
        detail: teachers[i].name,
        createdAt: new Date(Date.now() - (i + 1) * 5 * 86_400_000),
      },
    });
  }
  console.log(`  ✓ ${teachers.length} audit log entries`);
}

function paymentRef() {
  return `HF-${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
}

async function seedPayments() {
  const existing = await prisma.payment.count();
  if (existing > 0) {
    console.log("  • payments already present; skipping");
    return;
  }

  const sara = await prisma.user.findUnique({ where: { email: "student@highfive.test" } });
  const ayesha = await prisma.user.findUnique({ where: { email: "teacher@highfive.test" } });
  const bilal = await prisma.user.findUnique({ where: { email: emailFor("Bilal Ahmed Qureshi") } });
  if (!sara || !ayesha) return;

  const day = 86_400_000;
  const records: {
    userId: string;
    type: string;
    description: string;
    amount: number;
    status: string;
    method: string | null;
    targetId: string | null;
    daysAgo: number;
  }[] = [
    {
      userId: sara.id,
      type: "REGISTRATION",
      description: "Student registration fee",
      amount: 500,
      status: "paid",
      method: "jazzcash",
      targetId: null,
      daysAgo: 40,
    },
    {
      userId: sara.id,
      type: "UNLOCK_TUTOR",
      description: `Unlock contact with ${ayesha.name}`,
      amount: 200,
      status: "paid",
      method: "easypaisa",
      targetId: ayesha.id,
      daysAgo: 12,
    },
    // Active subscription so the demo teacher can browse leads immediately.
    {
      userId: ayesha.id,
      type: "TEACHER_SUBSCRIPTION",
      description: "Teacher subscription (30 days)",
      amount: 2000,
      status: "paid",
      method: "jazzcash",
      targetId: null,
      daysAgo: 3,
    },
  ];

  if (bilal) {
    records.push({
      userId: sara.id,
      type: "UNLOCK_TUTOR",
      description: `Unlock contact with ${bilal.name}`,
      amount: 200,
      status: "paid",
      method: "jazzcash",
      targetId: bilal.id,
      daysAgo: 8,
    });
    records.push({
      userId: sara.id,
      type: "SESSION_BOOKING",
      description: `Session booking with ${bilal.name}`,
      amount: 1800,
      status: "paid",
      method: "easypaisa",
      targetId: bilal.id,
      daysAgo: 5,
    });
  }

  for (const r of records) {
    const at = new Date(Date.now() - r.daysAgo * day);
    await prisma.payment.create({
      data: {
        userId: r.userId,
        type: r.type,
        description: r.description,
        amount: r.amount,
        status: r.status,
        method: r.method,
        mobileNumber: "03001234567",
        reference: paymentRef(),
        targetId: r.targetId,
        createdAt: at,
        paidAt: r.status === "paid" ? at : null,
      },
    });
  }
  console.log(`  ✓ ${records.length} payments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
