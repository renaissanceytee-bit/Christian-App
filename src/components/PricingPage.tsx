import React, { useEffect, useState } from 'react';

export default function PricingPage() {
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch Stripe public key
    const fetchKey = async () => {
      try {
        const res = await fetch('/api/stripe/public-key');
        const data = await res.json();
        setStripePublicKey(data.publicKey);
      } catch (err: any) {
        console.error('Failed to fetch Stripe key:', err);
      }
    };
    fetchKey();
  }, []);

  const handleUpgradeClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_test_premium_monthly',
        }),
      });
      const data: any = await res.json();
      const { sessionId, error } = data;
      if (error) throw new Error(error);

      // Redirect to Stripe (in production, use @stripe/react-stripe-js)
      if (window.location.href.includes('localhost')) {
        console.log('Test mode: Stripe checkout session created:', sessionId);
        alert('In production, you would be redirected to Stripe Checkout.\nSession ID: ' + sessionId);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Christian App Pricing</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '2rem 0' }}>
        {/* Free Plan */}
        <div
          style={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#fafafa',
          }}
        >
          <h2>Free</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>$0</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
            <li>✓ Units 1-2 access</li>
            <li>✓ 1 quiz attempt per unit</li>
            <li>✓ Basic progress tracking</li>
            <li>✗ All units (Units 3-6+)</li>
            <li>✗ Unlimited attempts</li>
            <li>✗ Offline mode</li>
          </ul>
          <button
            disabled
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#ccc',
              color: '#666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
            }}
          >
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div
          style={{
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#f0f9f0',
          }}
        >
          <h2>Premium</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>$4.99/month</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
            <li>✓ All units (6+)</li>
            <li>✓ Unlimited quiz attempts</li>
            <li>✓ Advanced progress tracking</li>
            <li>✓ Offline mode</li>
            <li>✓ Ad-free experience</li>
            <li>✓ Email support</li>
          </ul>
          <button
            onClick={handleUpgradeClick}
            disabled={loading || !stripePublicKey}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h3>Frequently Asked Questions</h3>
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Can I cancel anytime?</summary>
          <p>Yes! Cancel your subscription anytime from your account settings. No refunds on partial months.</p>
        </details>
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>What payment methods do you accept?</summary>
          <p>We accept all major credit and debit cards through Stripe.</p>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Is my payment information secure?</summary>
          <p>
            Yes! We use Stripe for all payment processing. We never store your payment card details. Your data is
            encrypted and PCI-compliant.
          </p>
        </details>
      </div>
    </div>
  );
}
