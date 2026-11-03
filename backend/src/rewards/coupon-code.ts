import { randomBytes } from 'crypto';

/**
 * GRASP — Information Expert
 * Gera o código de cupom (conhecimento isolado do algoritmo).
 */
export function generateCouponCode(bytes = 8): string {
  return randomBytes(bytes).toString('hex').toUpperCase();
}
