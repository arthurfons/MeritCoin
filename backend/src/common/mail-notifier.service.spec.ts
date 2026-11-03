import { MailNotifierService } from './mail-notifier.service';

describe('MailNotifierService (GRASP Indirection)', () => {
  it('expõe enqueueEmail e notifyUser', () => {
    const email = { enqueue: jest.fn() };
    const prisma = { notification: { create: jest.fn() } };
    const svc = new MailNotifierService(email as never, prisma as never);
    expect(typeof svc.enqueueEmail).toBe('function');
    expect(typeof svc.notifyUser).toBe('function');
  });
});
