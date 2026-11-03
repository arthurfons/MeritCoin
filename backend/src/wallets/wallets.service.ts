import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WalletTxType } from '@prisma/client';
import { JwtPayload } from '../auth/jwt-payload';
import { Role } from '../auth/roles.enum';
import { MailNotifierService } from '../common/mail-notifier.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransferCoinsDto } from './dto/transfer-coins.dto';
import { SemesterCreditService } from './semester-credit.service';

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly semesterCredit: SemesterCreditService,
    private readonly mail: MailNotifierService,
  ) {}

  async ensureSemesterCredit(actor: JwtPayload) {
    if (actor.role !== Role.PROFESSOR && actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const result = await this.semesterCredit.ensureForTeacherUser(actor.sub);
    return {
      credited: result.credited,
      semester: result.semester,
      balance: result.balance,
      message: result.message,
    };
  }

  async transfer(dto: TransferCoinsDto, actor: JwtPayload) {
    if (actor.role !== Role.PROFESSOR) {
      throw new ForbiddenException('Somente professor envia moedas');
    }
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { userId: actor.sub },
      include: { user: true },
    });
    if (!teacher) throw new NotFoundException('Professor nao encontrado');

    await this.semesterCredit.ensureForTeacherUser(actor.sub);

    const student = await this.prisma.studentProfile.findUnique({
      where: { id: dto.studentId },
      include: { user: true },
    });
    if (!student) throw new NotFoundException('Aluno nao encontrado');
    if (student.institutionId !== teacher.institutionId) {
      throw new ForbiddenException('Aluno de outra instituicao');
    }
    if (dto.amount <= 0) throw new BadRequestException('Valor invalido');

    const result = await this.prisma.$transaction(async (tx) => {
      const freshTeacher = await tx.teacherProfile.findUniqueOrThrow({
        where: { id: teacher.id },
      });
      if (freshTeacher.balance < dto.amount) {
        throw new BadRequestException('Saldo insuficiente');
      }

      const t = await tx.teacherProfile.update({
        where: { id: teacher.id },
        data: { balance: { decrement: dto.amount } },
      });
      const s = await tx.studentProfile.update({
        where: { id: student.id },
        data: { balance: { increment: dto.amount } },
      });
      const transfer = await tx.coinTransfer.create({
        data: {
          teacherId: teacher.id,
          studentId: student.id,
          amount: dto.amount,
          message: dto.message.trim(),
        },
      });
      await tx.walletTransaction.create({
        data: {
          type: WalletTxType.TRANSFER_OUT,
          amount: -dto.amount,
          balanceAfter: t.balance,
          description: `Envio para ${student.fullName}: ${dto.message}`,
          teacherId: teacher.id,
          transferId: transfer.id,
        },
      });
      await tx.walletTransaction.create({
        data: {
          type: WalletTxType.TRANSFER_IN,
          amount: dto.amount,
          balanceAfter: s.balance,
          description: `Recebido de ${teacher.fullName}: ${dto.message}`,
          studentId: student.id,
          transferId: transfer.id,
        },
      });
      return { transfer, teacherBalance: t.balance, studentBalance: s.balance };
    });

    await this.mail.notifyUser({
      userId: student.userId,
      title: 'Voce recebeu moedas',
      body: `${teacher.fullName} enviou ${dto.amount} moedas. Motivo: ${dto.message}`,
      createdById: actor.sub,
      email: {
        to: student.user.email,
        subject: 'MeritCoin — voce recebeu moedas',
        html: `
          <h2>Reconhecimento recebido</h2>
          <p><strong>Professor:</strong> ${teacher.fullName}</p>
          <p><strong>Quantidade:</strong> ${dto.amount}</p>
          <p><strong>Motivo:</strong> ${dto.message}</p>
          <p><strong>Seu saldo atual:</strong> ${result.studentBalance}</p>
        `,
      },
    });

    return result;
  }

  async myStatement(actor: JwtPayload) {
    if (actor.role === Role.PROFESSOR) {
      const teacher = await this.prisma.teacherProfile.findUnique({
        where: { userId: actor.sub },
      });
      if (!teacher) throw new NotFoundException();
      const transactions = await this.prisma.walletTransaction.findMany({
        where: { teacherId: teacher.id },
        orderBy: { createdAt: 'desc' },
      });
      const transfers = await this.prisma.coinTransfer.findMany({
        where: { teacherId: teacher.id },
        include: { student: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return { balance: teacher.balance, transactions, transfers };
    }

    if (actor.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: actor.sub },
      });
      if (!student) throw new NotFoundException();
      const transactions = await this.prisma.walletTransaction.findMany({
        where: { studentId: student.id },
        orderBy: { createdAt: 'desc' },
      });
      return { balance: student.balance, transactions };
    }

    throw new ForbiddenException();
  }
}
