import React, { useState } from 'react'

interface PromotionalAdProps {
  onUpgradeClick?: () => void
}

export default function PromotionalAd({ onUpgradeClick }: PromotionalAdProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      style={{
        backgroundColor: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        backgroundImage: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        color: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          color: '#fff',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
      >
        ✕
      </button>

      <div style={{ paddingRight: '2rem' }}>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#ff6b35',
            color: '#fff',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem',
          }}
        >
          LIMITED TIME
        </div>

        <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
          🎉 50% OFF Premium Today
        </h3>

        <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.95rem', opacity: 0.95 }}>
          Unlock unlimited quiz attempts and study at your own pace. No daily limits!
        </p>

        <button
          onClick={onUpgradeClick}
          style={{
            backgroundColor: '#fff',
            color: '#4CAF50',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}
