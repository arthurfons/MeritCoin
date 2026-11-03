import { SemesterCreditService } from './semester-credit.service';

describe('SemesterCreditService (GRASP Information Expert)', () => {
  it('calcula semestre no formato AAAA.S', () => {
    const svc = new SemesterCreditService({} as never);
    expect(svc.currentSemester()).toMatch(/^\d{4}\.[12]$/);
  });
});
