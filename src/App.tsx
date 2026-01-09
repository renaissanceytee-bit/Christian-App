import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import UnitPage from './pages/Unit'
import ExportImport from './components/ExportImport'
import Onboarding from './pages/Onboarding'
import PricingPage from './components/PricingPage'

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <Link to="/" className="brand">Christian Study</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/units/1">Start</Link>
          <Link to="/pricing">Upgrade</Link>
          <Link to="/export">Export</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/units/:id" element={<UnitPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/export" element={<ExportImport />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <small>© Christian Study — Offline first demo</small>
      </footer>
    </div>
  )
}
