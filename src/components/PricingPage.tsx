import React, { useState } from 'react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleCheckout = async (priceType: 'monthly' | 'annual') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      });
      if (!response.ok) throw new Error('Failed to create checkout');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Simple, Transparent Pricing</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Start free. Upgrade when you're ready for unlimited learning.
        </p>
      </div>

      {/* Billing Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
        <button
          onClick={() => setBillingCycle('monthly')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: billingCycle === 'monthly' ? '#4CAF50' : '#e0e0e0',
            color: billingCycle === 'monthly' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('annual')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: billingCycle === 'annual' ? '#4CAF50' : '#e0e0e0',
            color: billingCycle === 'annual' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            position: 'relative',
          }}
        >
          Annual
          <span
            style={{
              position: 'absolute',
              top: '-25px',
              right: '0',
              backgroundColor: '#ff6b35',
              color: '#fff',
              padding: '0.25rem 0.5rem',
              borderRadius: '3px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
            }}
          >
            Save 34%
          </span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Free Tier */}
        <div
          style={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '2rem',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>Free</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Get started with our basics</p>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              $0<span style={{ fontSize: '1rem', color: '#666' }}>/month</span>
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Always free, always basic access</p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ All 6 units</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Quiz lessons</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Daily progress tracking</li>
            <li style={{ padding: '0.5rem 0', color: '#ff6b35', fontWeight: 'bold' }}>3 incorrect answers/day limit</li>
          </ul>

          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
              fontWeight: 'bold',
            }}
            disabled
          >
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div
          style={{
            border: '3px solid #4CAF50',
            borderRadius: '8px',
            padding: '2rem',
            backgroundColor: '#f9fff9',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#ff6b35',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          >
            50% OFF TODAY
          </div>

          <h2 style={{ marginBottom: '0.5rem' }}>Premium</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Unlimited learning power</p>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {billingCycle === 'monthly' ? '$3.99' : '$35.99'}
              <span style={{ fontSize: '1rem', color: '#666' }}>
                {billingCycle === 'monthly' ? '/month' : '/year'}
              </span>
            </div>
            {billingCycle === 'annual' && (
              <p style={{ color: '#4CAF50', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Just $2.99/month billed annually
              </p>
            )}
          </div>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e8f5e9' }}>✓ All 6 units</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e8f5e9' }}>✓ Quiz lessons</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e8f5e9' }}>✓ Daily progress tracking</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #e8f5e9', color: '#4CAF50', fontWeight: 'bold' }}>
              ✓ Unlimited attempts
            </li>
            <li style={{ padding: '0.5rem 0', color: '#4CAF50', fontWeight: 'bold' }}>✓ No daily limits</li>
          </ul>

          <button
            onClick={() => handleCheckout(billingCycle)}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : billingCycle === 'monthly' ? 'Upgrade Now' : 'Get Annual Plan'}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '1.5rem',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#666',
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Free users</strong> get 3 incorrect answers per day. Upgrade to remove this limit and study at your own pace.
        </p>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
}
