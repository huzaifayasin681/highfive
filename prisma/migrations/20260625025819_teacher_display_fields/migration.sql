-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeacherProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "qualifications" TEXT,
    "experienceYears" INTEGER,
    "hourlyRate" REAL,
    "location" TEXT,
    "mode" TEXT,
    "photoUrl" TEXT,
    "idDocUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "online" BOOLEAN NOT NULL DEFAULT true,
    "responseTime" TEXT,
    "studentsTaught" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TeacherProfile" ("bio", "experienceYears", "hourlyRate", "id", "idDocUrl", "location", "mode", "photoUrl", "qualifications", "rating", "reviewsCount", "userId", "verificationStatus", "verified") SELECT "bio", "experienceYears", "hourlyRate", "id", "idDocUrl", "location", "mode", "photoUrl", "qualifications", "rating", "reviewsCount", "userId", "verificationStatus", "verified" FROM "TeacherProfile";
DROP TABLE "TeacherProfile";
ALTER TABLE "new_TeacherProfile" RENAME TO "TeacherProfile";
CREATE UNIQUE INDEX "TeacherProfile_userId_key" ON "TeacherProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
