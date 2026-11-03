import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletTxType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

function currentSemester(d = new Date()) {
  const year = d.getFullYear();
  const sem = d.getMonth() < 6 ? 1 : 2;
  return `${year}.${sem}`;
}

/**
 * GRASP — Information Expert / High Cohesion
 * Responsável apenas pela política de crédito semestral do professor.
 */
@Injectable()
export class SemesterCreditService {
  constructor(private readonly prisma: PrismaService) {}

  currentSemester() {
    return currentSemester();
  }

  async ensureForTeacherUser(userId: string) {
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { userId },
    });
    if (!teacher) throw new NotFoundException('Professor nao encontrado');

    const semester = currentSemester();
    const existing = await this.prisma.teacherSemesterCredit.findUnique({
      where: {
        teacherId_semester: { teacherId: teacher.id, semester },
      },
    });
    if (existing) {
      return {
        credited: false,
        semester,
        balance: teacher.balance,
        message: 'Credito deste semestre ja aplicado',
        teacher,
      };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.teacherSemesterCredit.create({
        data: { teacherId: teacher.id, semester, amount: 1000 },
      });
      const t = await tx.teacherProfile.update({
        where: { id: teacher.id },
        data: { balance: { increment: 1000 } },
      });
      await tx.walletTransaction.create({
        data: {
          type: WalletTxType.SEMESTER_CREDIT,
          amount: 1000,
          balanceAfter: t.balance,
          description: `Credito semestral ${semester}`,
          teacherId: teacher.id,
        },
      });
      return t;
    });

    return {
      credited: true,
      semester,
      balance: updated.balance,
      message: '1.000 moedas creditadas (acumulavel)',
      teacher: updated,
    };
  }
}
