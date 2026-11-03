import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * GRASP — Low Coupling / Indirection
 * Fachada entre regras de negócio e canais de notificação (e-mail + in-app).
 */
@Injectable()
export class MailNotifierService {
  constructor(
    private readonly email: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async notifyUser(params: {
    userId: string;
    title: string;
    body: string;
    email?: { to: string; subject: string; html: string };
    createdById?: string;
  }) {
    await this.prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        body: params.body,
      },
    });
    if (params.email) {
      await this.email.enqueue({
        toEmail: params.email.to,
        subject: params.email.subject,
        htmlBody: params.email.html,
        createdById: params.createdById,
      });
    }
  }

  enqueueEmail(params: {
    toEmail: string;
    subject: string;
    htmlBody: string;
    createdById?: string;
  }) {
    return this.email.enqueue(params);
  }
}
