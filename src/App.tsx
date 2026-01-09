import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import UnitPage from './pages/Unit'
import ExportImport from './components/ExportImport'
import Onboarding from './pages/Onboarding'
import PricingPage from './components/PricingPage'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <header className="site-header">
          <Link to="/" className="brand">Christian Study</Link>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/units/1">Start</Link>
            <Link to="/pricing">Upgrade</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/export">Export</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/units/:id" element={<UnitPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/export" element={<ExportImport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <small>© Christian Study — Offline first demo</small>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
