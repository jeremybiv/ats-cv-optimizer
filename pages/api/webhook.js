import Stripe from 'stripe';
import { setUserSubscription } from '../../src/lib/db';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhooks need the raw request body for signature verification
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.customer_email || session.customer_details?.email || null;
        const stripeCustomerId = session.customer || null;
        await setUserSubscription({ email, status: 'active', stripeCustomerId });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer || null;
        let email = null;
        if (stripeCustomerId) {
          try {
            const customer = await stripe.customers.retrieve(stripeCustomerId);
            email = customer?.email || null;
          } catch (e) {
            console.error('[Webhook] Could not retrieve Stripe customer:', e.message);
          }
        }
        await setUserSubscription({ email, status: 'canceled', stripeCustomerId });
        break;
      }
      default:
        // Unhandled event types are acknowledged but ignored
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Handler error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
