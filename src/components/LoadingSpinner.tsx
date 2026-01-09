import React from 'react'

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div
        style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #4CAF50',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ marginTop: '1rem', color: '#666' }}>{message}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
