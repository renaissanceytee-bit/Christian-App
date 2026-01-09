// Simple Stripe test integration for Christian App
// Handles Stripe checkout session creation, success/cancel redirects, and webhook

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key_for_demo');
const path = require('path');

// Pricing model:
// - Free: Units 1-2 only, 1 quiz attempt per unit
// - Premium ($4.99/month): All units, unlimited attempts, offline mode

const PRICING = {
  premium_monthly: {
    price_id: 'price_test_premium_monthly', // TEST: replace with real Stripe price ID
    name: 'Christian App Premium (Monthly)',
    amount: 499, // $4.99 in cents
    currency: 'usd',
    interval: 'month'
  }
};

const router = express.Router();

// Create a checkout session for premium upgrade
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId } = req.body;
    const pricing = Object.values(PRICING).find(p => p.price_id === priceId);
    
    if (!pricing) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    // In production, link to authenticated user/subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173'}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL || 'http://localhost:5173'}/pricing`,
      // metadata: { userId: req.user?.id }, // TODO: add auth
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Verify subscription status (simplified — in production, sync with Stripe)
router.get('/subscription-status', (req, res) => {
  // TODO: connect to auth middleware and database
  res.json({
    isPremium: false, // Would check localStorage + verified server state
    expiresAt: null,
  });
});

// Webhook endpoint to handle Stripe events (customer.subscription.updated, etc.)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    
    console.log(`Webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // TODO: Update user subscription in DB
        console.log('Subscription updated:', event.data.object.id);
        break;
      case 'customer.subscription.deleted':
        // TODO: Mark subscription as inactive
        console.log('Subscription deleted:', event.data.object.id);
        break;
      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;
      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
});

// Demo: Get Stripe public key for client-side
router.get('/public-key', (req, res) => {
  res.json({
    publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_fake_key_for_demo',
  });
});

module.exports = router;
