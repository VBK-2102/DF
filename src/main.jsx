import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Sender from './sender.jsx'
import Combiner from './combiner.jsx'
import Leading from './Leading.jsx'

function Layout() {
  return (
    <div style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: 24,
      fontFamily: 'Inter, system-ui, Arial',
      minHeight: '100vh',
      backgroundColor: 'transparent'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        padding: '16px 24px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        boxShadow: '0 6px 30px rgba(2,6,23,0.6)'
      }}>
        <h1 style={{
          margin: 0,
          background: 'linear-gradient(90deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '24px',
          letterSpacing: 0.2
        }}>
          Doc Share + Blockchain
        </h1>
        <nav style={{
          display: 'flex',
          gap: 16
        }}>
          {[
            { to: '/send', label: '📤 Sender' },
            { to: '/combine', label: '📥 Receiver' }
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 16px',
                textDecoration: 'none',
                color: 'rgba(230,238,248,0.9)',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(2,6,23,0.6)'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/send" />} />
          <Route path="/send" element={<Sender />} />
          <Route path="/combine" element={<Combiner />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Leading />} />
        <Route path='/*' element={<Layout />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
