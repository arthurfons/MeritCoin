-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ALUNO', 'PROFESSOR', 'EMPRESA', 'ESCOLA', 'ADMIN');

-- CreateEnum
CREATE TYPE "MissionScope" AS ENUM ('SCHOOL', 'CLASS');

-- CreateEnum
CREATE TYPE "MissionCompletionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WalletTxType" AS ENUM ('SEMESTER_CREDIT', 'TRANSFER_OUT', 'TRANSFER_IN', 'REDEMPTION', 'MISSION_REWARD');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ATIVO', 'UTILIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EmailOutboxStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gradeYear" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "studentNumber" TEXT,
    "gradeYear" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "institutionId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "classId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherClass" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "TeacherClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherSemesterCredit" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherSemesterCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinTransfer" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "type" "WalletTxType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "teacherId" TEXT,
    "studentId" TEXT,
    "redemptionId" TEXT,
    "transferId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "costCoins" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "costCoins" INTEGER NOT NULL,
    "couponCode" TEXT NOT NULL,
    "status" "CouponStatus" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailOutbox" (
    "id" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "status" "EmailOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "createdById" TEXT,

    CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewardCoins" INTEGER NOT NULL,
    "scope" "MissionScope" NOT NULL,
    "institutionId" TEXT NOT NULL,
    "classId" TEXT,
    "teacherId" TEXT,
    "createdById" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3),
    "repeatable" BOOLEAN NOT NULL DEFAULT false,
    "maxPerWeek" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionCompletion" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "MissionCompletionStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "reviewedById" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "MissionCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- CreateIndex
CREATE INDEX "Department_institutionId_idx" ON "Department"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_institutionId_key" ON "Department"("name", "institutionId");

-- CreateIndex
CREATE INDEX "Course_institutionId_idx" ON "Course"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_institutionId_key" ON "Course"("name", "institutionId");

-- CreateIndex
CREATE INDEX "SchoolClass_institutionId_idx" ON "SchoolClass"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolClass_name_institutionId_key" ON "SchoolClass"("name", "institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolProfile_userId_key" ON "SchoolProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_cpf_key" ON "StudentProfile"("cpf");

-- CreateIndex
CREATE INDEX "StudentProfile_institutionId_idx" ON "StudentProfile"("institutionId");

-- CreateIndex
CREATE INDEX "StudentProfile_courseId_idx" ON "StudentProfile"("courseId");

-- CreateIndex
CREATE INDEX "StudentProfile_classId_idx" ON "StudentProfile"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentNumber_institutionId_key" ON "StudentProfile"("studentNumber", "institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherProfile_userId_key" ON "TeacherProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherProfile_cpf_key" ON "TeacherProfile"("cpf");

-- CreateIndex
CREATE INDEX "TeacherProfile_institutionId_idx" ON "TeacherProfile"("institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherClass_teacherId_classId_key" ON "TeacherClass"("teacherId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "CompanyProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_cnpj_key" ON "CompanyProfile"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSemesterCredit_teacherId_semester_key" ON "TeacherSemesterCredit"("teacherId", "semester");

-- CreateIndex
CREATE INDEX "CoinTransfer_teacherId_createdAt_idx" ON "CoinTransfer"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinTransfer_studentId_createdAt_idx" ON "CoinTransfer"("studentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_redemptionId_key" ON "WalletTransaction"("redemptionId");

-- CreateIndex
CREATE INDEX "WalletTransaction_teacherId_createdAt_idx" ON "WalletTransaction"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_studentId_createdAt_idx" ON "WalletTransaction"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Reward_companyId_active_idx" ON "Reward"("companyId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Redemption_couponCode_key" ON "Redemption"("couponCode");

-- CreateIndex
CREATE INDEX "Redemption_studentId_createdAt_idx" ON "Redemption"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Redemption_rewardId_idx" ON "Redemption"("rewardId");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "EmailOutbox_status_createdAt_idx" ON "EmailOutbox"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Mission_institutionId_active_idx" ON "Mission"("institutionId", "active");

-- CreateIndex
CREATE INDEX "MissionCompletion_missionId_status_idx" ON "MissionCompletion"("missionId", "status");

-- CreateIndex
CREATE INDEX "MissionCompletion_studentId_status_idx" ON "MissionCompletion"("studentId", "status");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolClass" ADD CONSTRAINT "SchoolClass_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolProfile" ADD CONSTRAINT "SchoolProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolProfile" ADD CONSTRAINT "SchoolProfile_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherClass" ADD CONSTRAINT "TeacherClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSemesterCredit" ADD CONSTRAINT "TeacherSemesterCredit_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransfer" ADD CONSTRAINT "CoinTransfer_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransfer" ADD CONSTRAINT "CoinTransfer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "Redemption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionCompletion" ADD CONSTRAINT "MissionCompletion_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionCompletion" ADD CONSTRAINT "MissionCompletion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionCompletion" ADD CONSTRAINT "MissionCompletion_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

