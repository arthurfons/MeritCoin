import { generateCouponCode } from './coupon-code';

describe('generateCouponCode (GRASP Information Expert)', () => {
  it('gera codigo hex maiusculo', () => {
    const code = generateCouponCode(8);
    expect(code).toMatch(/^[0-9A-F]+$/);
    expect(code).toHaveLength(16);
  });

  it('gera valores distintos', () => {
    const a = generateCouponCode();
    const b = generateCouponCode();
    expect(a).not.toEqual(b);
  });
});
