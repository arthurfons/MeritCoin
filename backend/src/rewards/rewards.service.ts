import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponStatus, WalletTxType } from '@prisma/client';
import { JwtPayload } from '../auth/jwt-payload';
import { Role } from '../auth/roles.enum';
import { MailNotifierService } from '../common/mail-notifier.service';
import { PrismaService } from '../prisma/prisma.service';
import { generateCouponCode } from './coupon-code';
import { CreateRewardDto } from './dto/create-reward.dto';

@Injectable()
export class RewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailNotifierService,
  ) {}

  private async companyOf(actor: JwtPayload) {
    const company = await this.prisma.companyProfile.findUnique({
      where: { userId: actor.sub },
      include: { user: true },
    });
    if (!company) throw new ForbiddenException('Empresa nao encontrada');
    return company;
  }

  async create(dto: CreateRewardDto, actor: JwtPayload) {
    if (actor.role !== Role.EMPRESA) throw new ForbiddenException();
    const company = await this.companyOf(actor);
    return this.prisma.reward.create({
      data: {
        companyId: company.id,
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        costCoins: dto.costCoins,
      },
    });
  }

  async listMine(actor: JwtPayload) {
    if (actor.role !== Role.EMPRESA) throw new ForbiddenException();
    const company = await this.companyOf(actor);
    return this.prisma.reward.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listCatalog() {
    return this.prisma.reward.findMany({
      where: { active: true },
      include: { company: { select: { tradeName: true } } },
      orderBy: { costCoins: 'asc' },
    });
  }

  async deactivate(id: string, actor: JwtPayload) {
    const company = await this.companyOf(actor);
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward || reward.companyId !== company.id) {
      throw new NotFoundException();
    }
    return this.prisma.reward.update({
      where: { id },
      data: { active: false },
    });
  }

  async redeem(rewardId: string, actor: JwtPayload) {
    if (actor.role !== Role.ALUNO) throw new ForbiddenException();
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId: actor.sub },
      include: { user: true },
    });
    if (!student) throw new NotFoundException();

    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
      include: { company: { include: { user: true } } },
    });
    if (!reward || !reward.active) {
      throw new NotFoundException('Vantagem indisponivel');
    }

    const couponCode = generateCouponCode();

    const redemption = await this.prisma.$transaction(async (tx) => {
      const fresh = await tx.studentProfile.findUniqueOrThrow({
        where: { id: student.id },
      });
      if (fresh.balance < reward.costCoins) {
        throw new BadRequestException('Saldo insuficiente');
      }
      const s = await tx.studentProfile.update({
        where: { id: student.id },
        data: { balance: { decrement: reward.costCoins } },
      });
      const red = await tx.redemption.create({
        data: {
          studentId: student.id,
          rewardId: reward.id,
          costCoins: reward.costCoins,
          couponCode,
          status: CouponStatus.ATIVO,
        },
        include: { reward: true },
      });
      await tx.walletTransaction.create({
        data: {
          type: WalletTxType.REDEMPTION,
          amount: -reward.costCoins,
          balanceAfter: s.balance,
          description: `Resgate: ${reward.title}`,
          studentId: student.id,
          redemptionId: red.id,
        },
      });
      return red;
    });

    await this.mail.notifyUser({
      userId: student.userId,
      title: 'Resgate realizado',
      body: `Cupom ${couponCode} para ${reward.title}`,
      createdById: actor.sub,
      email: {
        to: student.user.email,
        subject: 'MeritCoin — cupom de resgate',
        html: `
          <h2>Resgate confirmado</h2>
          <p><strong>Vantagem:</strong> ${reward.title}</p>
          <p><strong>Custo:</strong> ${reward.costCoins} moedas</p>
          <p><strong>Cupom:</strong> <code>${couponCode}</code></p>
          <p>Apresente este codigo na troca presencial.</p>
        `,
      },
    });

    await this.mail.enqueueEmail({
      toEmail: reward.company.user.email,
      subject: 'MeritCoin — novo resgate para conferencia',
      htmlBody: `
        <h2>Resgate pendente de conferencia</h2>
        <p><strong>Vantagem:</strong> ${reward.title}</p>
        <p><strong>Aluno:</strong> ${student.fullName}</p>
        <p><strong>Cupom:</strong> <code>${couponCode}</code></p>
      `,
      createdById: actor.sub,
    });

    return redemption;
  }

  async listMyRedemptions(actor: JwtPayload) {
    if (actor.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: actor.sub },
      });
      if (!student) throw new NotFoundException();
      return this.prisma.redemption.findMany({
        where: { studentId: student.id },
        include: { reward: true },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (actor.role === Role.EMPRESA) {
      const company = await this.companyOf(actor);
      return this.prisma.redemption.findMany({
        where: { reward: { companyId: company.id } },
        include: {
          reward: true,
          student: { select: { fullName: true, studentNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    throw new ForbiddenException();
  }

  async confirmCoupon(couponCode: string, actor: JwtPayload) {
    if (actor.role !== Role.EMPRESA) throw new ForbiddenException();
    const company = await this.companyOf(actor);
    const redemption = await this.prisma.redemption.findUnique({
      where: { couponCode },
      include: { reward: true },
    });
    if (!redemption || redemption.reward.companyId !== company.id) {
      throw new NotFoundException('Cupom invalido para esta empresa');
    }
    if (redemption.status !== CouponStatus.ATIVO) {
      throw new BadRequestException('Cupom ja utilizado ou cancelado');
    }
    return this.prisma.redemption.update({
      where: { id: redemption.id },
      data: { status: CouponStatus.UTILIZADO, usedAt: new Date() },
    });
  }
}
