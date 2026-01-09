import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
      <h1>Page Not Found</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        We couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4CAF50',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}
