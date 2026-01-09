import React, { useState } from 'react'

interface DiscountPopupProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (priceType: 'monthly' | 'annual') => void
  loading?: boolean
}

export default function DiscountPopup({ isOpen, onClose, onUpgrade, loading = false }: DiscountPopupProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly')

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '450px',
          width: '90%',
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#999',
          }}
        >
          ✕
        </button>

        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#ff6b35',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
          50% OFF TODAY
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Daily Limit Reached</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          You've used your 3 free incorrect answers for today. Upgrade to Premium for unlimited attempts!
        </p>

        {/* Plan Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            onClick={() => setSelectedPlan('monthly')}
            style={{
              padding: '1rem',
              border: selectedPlan === 'monthly' ? '2px solid #4CAF50' : '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedPlan === 'monthly' ? '#f9fff9' : '#fff',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              $3.99<span style={{ fontSize: '0.9rem', color: '#666' }}>/month</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#888' }}>Cancel anytime</div>
          </div>

          <div
            onClick={() => setSelectedPlan('annual')}
            style={{
              padding: '1rem',
              border: selectedPlan === 'annual' ? '2px solid #4CAF50' : '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedPlan === 'annual' ? '#f9fff9' : '#fff',
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                right: '10px',
                backgroundColor: '#ff6b35',
                color: '#fff',
                padding: '0.25rem 0.75rem',
                borderRadius: '3px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              Save 34%
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              $35.99<span style={{ fontSize: '0.9rem', color: '#666' }}>/year</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#4CAF50', fontWeight: 'bold' }}>
              Just $2.99/month billed annually
            </div>
          </div>
        </div>

        {/* Features List */}
        <div style={{ marginBottom: '2rem', backgroundColor: '#f9fff9', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Premium includes:
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '0.25rem 0', fontSize: '0.9rem' }}>✓ Unlimited quiz attempts</li>
            <li style={{ padding: '0.25rem 0', fontSize: '0.9rem' }}>✓ No daily limits</li>
            <li style={{ padding: '0.25rem 0', fontSize: '0.9rem' }}>✓ All 6 units available</li>
            <li style={{ padding: '0.25rem 0', fontSize: '0.9rem' }}>✓ Progress tracking</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Maybe Later
          </button>
          <button
            onClick={() => onUpgrade(selectedPlan)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  )
}
