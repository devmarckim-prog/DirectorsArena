import Stripe from 'stripe';

// v11.4: 결제 기능 일시 중지 (빌드 에러 방지용 가짜 키 할당)
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_unused_bypass_build_error';

/*
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
}
*/

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2025-01-27' as any,
  appInfo: {
    name: 'Directors Arena',
    version: '1.0.0',
  },
});
