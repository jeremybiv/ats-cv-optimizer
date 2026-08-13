import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../src/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const session = await getServerSession(req, res, authOptions);
    const email = session?.user?.email || null;
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${req.headers.origin}/app?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      ...(email ? { customer_email: email, metadata: { email } } : {}),
    });
    res.json({ url: checkoutSession.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
