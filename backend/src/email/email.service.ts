import { Injectable, Logger } from '@nestjs/common';
import { EmailOutboxStatus } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: process.env.SMTP_USER
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
      });
    }
  }

  async enqueue(params: {
    toEmail: string;
    subject: string;
    htmlBody: string;
    createdById?: string;
  }) {
    const row = await this.prisma.emailOutbox.create({
      data: {
        toEmail: params.toEmail,
        subject: params.subject,
        htmlBody: params.htmlBody,
        createdById: params.createdById,
      },
    });
    // tenta enviar sem bloquear a regra de negocio se SMTP falhar
    await this.flushOne(row.id);
    return row;
  }

  async flushOne(id: string) {
    const row = await this.prisma.emailOutbox.findUnique({ where: { id } });
    if (!row || row.status === EmailOutboxStatus.SENT) return row;

    if (!this.transporter) {
      this.logger.warn(
        `SMTP nao configurado — e-mail ${id} permanece PENDING (capturado no outbox)`,
      );
      return row;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM ?? 'MeritCoin <noreply@meritcoin.local>',
        to: row.toEmail,
        subject: row.subject,
        html: row.htmlBody,
      });
      return this.prisma.emailOutbox.update({
        where: { id },
        data: {
          status: EmailOutboxStatus.SENT,
          sentAt: new Date(),
          attempts: { increment: 1 },
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Falha SMTP ${id}: ${message}`);
      return this.prisma.emailOutbox.update({
        where: { id },
        data: {
          status: EmailOutboxStatus.FAILED,
          lastError: message,
          attempts: { increment: 1 },
        },
      });
    }
  }
}
