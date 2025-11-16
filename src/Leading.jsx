import React, { useState, useEffect, useRef } from 'react'

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / totalHeight
      setScrollProgress(progress)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const FloatingParticle = ({ delay, duration, startX, startY }) => (
    <div
      style={{
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        boxShadow: '0 0 10px #667eea',
        left: startX,
        bottom: startY,
        animation: `float ${duration}s ${delay}s infinite ease-in-out`,
      }}
    />
  )

  const navigateToSend = () => {
    window.location.href = '/send'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <style>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            transform: translate(50px, -100px) scale(0);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .hero-title {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hover-scale {
          transition: all 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          border-color: #667eea;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }

        .stats-number {
          font-size: 42px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 8px;
        }

        .stats-label {
          font-size: 16px;
          color: #A0A0A0;
        }

        .step-icon {
          font-size: 36px;
          margin-bottom: 16px;
          display: block;
        }

        .quick-summary-icon {
          font-size: 32px;
          margin-right: 16px;
          min-width: 40px;
        }
      `}</style>

      {/* Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          transformOrigin: '0%',
          transform: `scaleX(${scrollProgress})`,
          zIndex: 100,
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Animated Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          transform: `translateX(${-scrollProgress * 200}px)`,
        }}
      />

      {/* Mouse Follow Glow */}
      <div
        style={{
          position: 'fixed',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.5}
          duration={3 + Math.random() * 2}
          startX={`${Math.random() * 100}%`}
          startY={-50}
        />
      ))}

      <div style={{ padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ maxWidth: 1200, margin: '0 auto 80px' }}>
          <div className="fade-in-left" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: 18
            }}>
              DS
            </div>
            <span style={{ fontSize: 24, fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DocShare
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section ref={heroRef}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 80,
              alignItems: 'flex-start',
              maxWidth: 1200,
              margin: '0 auto',
              minHeight: '70vh',
            }}
          >
            <div className="fade-in-left">
              <div style={{ marginBottom: 24 }}>
                <span style={{ 
                  color: '#667eea', 
                  fontSize: 18, 
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase'
                }}>
                  Blockchain
                </span>
              </div>

              <h1
                className="hero-title"
                style={{ 
                  margin: '0 0 24px 0', 
                  fontSize: 68, 
                  lineHeight: 1.1,
                  fontWeight: 700,
                }}
              >
                Verified Document Transfer
              </h1>

              <p
                style={{
                  fontSize: 24,
                  color: '#E5E5E5',
                  lineHeight: 1.6,
                  marginBottom: 40,
                  maxWidth: 500,
                  fontWeight: 500,
                }}
              >
                Secure Document Transfer with On-Chain Verification
              </p>

              <p
                style={{
                  fontSize: 18,
                  color: '#A0A0A0',
                  lineHeight: 1.6,
                  marginBottom: 40,
                  maxWidth: 600,
                }}
              >
                Upload documents, hide them inside steganographic images, and send
                them securely while recording an immutable document hash
                on the blockchain for integrity verification.
              </p>

              <div style={{ display: 'flex', gap: 16, marginBottom: 60 }}>
                <button
                  onClick={navigateToSend}
                  className="btn-primary"
                  style={{
                    border: 'none',
                    color: '#fff',
                    padding: '18px 36px',
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
            
            </div>

            {/* Right Side - Quick Summary */}
            <div className="fade-in-right">
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05))',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 16,
                  padding: 40,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3 style={{ 
                  margin: '0 0 32px 0', 
                  fontSize: 24, 
                  color: '#667eea',
                  fontWeight: 600 
                }}>
                  Quick Summary
                </h3>
                
                <div style={{ display: 'grid', gap: 24 }}>
                  {[
                    { icon: '📤', text: 'Upload and store documents (optionally record on-chain)' },
                    { icon: '🔒', text: 'On-chain hash storage for non-repudiation' },
                    { icon: '🖼️', text: 'Steganography: deliver data inside images via email' },
                    { icon: '⚡', text: 'Simple sender & receiver workflows' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <span className="quick-summary-icon">{item.icon}</span>
                      <span style={{ color: '#E5E5E5', fontSize: 16, lineHeight: 1.5, flex: 1 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section style={{ marginTop: 120, maxWidth: 1200, margin: '120px auto' }}>
          <h2
            style={{
              fontSize: 52,
              textAlign: 'center',
              marginBottom: 80,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}
          >
            How It Works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { 
                step: '1', 
                title: 'Upload Document', 
                description: 'Upload a document and store its hash on-chain for immutable proof.',
                icon: '📄'
              },
              { 
                step: '2', 
                title: 'Generate Image', 
                description: 'Our server generates steganographic images hiding your document data',
                icon: '🖼️'
              },
              { 
                step: '3', 
                title: 'Email Delivery', 
                description: 'Images are sent via email — no direct download links exposed.',
                icon: '📧'
              },
              { 
                step: '4', 
                title: 'Verify Integrity', 
                description: 'Recipients verify document integrity with blockchain hash.',
                icon: '✅'
              },
            ].map((step, i) => (
              <div
                key={i}
                className="scale-in card-hover"
                style={{
                  padding: 32,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(0, 0, 0, 0.8))',
                  border: '1px solid rgba(102, 126, 234, 0.15)',
                  borderRadius: 12,
                  textAlign: 'center',
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: 24,
                  fontWeight: 'bold'
                }}>
                  {step.step}
                </div>
                <span className="step-icon">{step.icon}</span>
                <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: 22, fontWeight: 600 }}>{step.title}</h3>
                <p style={{ color: '#A0A0A0', fontSize: 16, lineHeight: 1.5, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section style={{ marginTop: 120, maxWidth: 1200, margin: '120px auto' }}>
          <h2
            style={{
              fontSize: 52,
              textAlign: 'center',
              marginBottom: 80,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}
          >
            Complete Feature Set
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { icon: '📁', title: 'Easy Upload', desc: 'Drag and drop or click to upload any document format. Supports PDFs, images, Word docs, and more.' },
              { icon: '🖼️', title: 'Steganographic Encoding', desc: 'Your document is automatically hidden inside a carrier image using advanced LSB steganography techniques.' },
              { icon: '🔑', title: 'Encryption Keys', desc: 'Generate unique encryption keys for each transfer. Share keys securely with recipients.' },
              { icon: '👥', title: 'Sender & Receiver', desc: 'Simple workflows for both senders and receivers with intuitive interfaces.' },
              { icon: '🛡️', title: 'Security', desc: 'Enterprise-grade security with end-to-end encryption and secure key management.' },
              { icon: '⛓️', title: 'Web3 Wallet Integration', desc: 'Connect MetaMask or any Web3 wallet to sign transactions and record document hashes on-chain.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="scale-in hover-lift card-hover"
                style={{
                  padding: 32,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(0, 0, 0, 0.8))',
                  border: '1px solid rgba(102, 126, 234, 0.15)',
                  borderRadius: 12,
                  animationDelay: `${i * 0.15}s`,
                  textAlign: 'center',
                }}
              >
                <span className="feature-icon">{feature.icon}</span>
                <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: 22, fontWeight: 600 }}>{feature.title}</h3>
                <p style={{ color: '#A0A0A0', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section style={{ marginTop: 120, maxWidth: 1200, margin: '120px auto' }}>
          <h2
            style={{
              fontSize: 52,
              textAlign: 'center',
              marginBottom: 80,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}
          >
            Real-World Use Cases
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { icon: '⚖️', title: 'Legal Documents', desc: 'Law firms use DocShare to send confidential agreements with blockchain-verified authenticity.' },
              { icon: '💰', title: 'Financial Reports', desc: 'Accountants and auditors share sensitive financial documents with tamper-proof verification.' },
              { icon: '🏛️', title: 'Government Documents', desc: 'Public sector organizations ensure document authenticity for citizens and stakeholders.' },
              { icon: '🏥', title: 'Medical Records', desc: 'Healthcare providers securely transfer patient records while maintaining HIPAA compliance.' },
              { icon: '💡', title: 'Intellectual Property', desc: 'Creators protect their work by establishing proof of existence and ownership on-chain.' },
              { icon: '🔐', title: 'Corporate Secrets', desc: 'Businesses share confidential information with partners without exposing it in transit.' },
            ].map((usecase, i) => (
              <div
                key={i}
                className="scale-in hover-lift card-hover"
                style={{
                  padding: 32,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(0, 0, 0, 0.8))',
                  border: '1px solid rgba(102, 126, 234, 0.15)',
                  borderRadius: 12,
                  animationDelay: `${i * 0.15}s`,
                  textAlign: 'center',
                }}
              >
                <span className="feature-icon">{usecase.icon}</span>
                <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: 22, fontWeight: 600 }}>{usecase.title}</h3>
                <p style={{ color: '#A0A0A0', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  {usecase.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ marginTop: 120, maxWidth: 800, margin: '120px auto', textAlign: 'center' }}>
          <div
            className="scale-in"
            style={{
              padding: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05))',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}
          >
            <h2 style={{ margin: '0 0 24px 0', fontSize: 42, color: '#fff', fontWeight: 700 }}>
              Ready to Get Started?
            </h2>
            <p style={{ color: '#A0A0A0', fontSize: 20, marginBottom: 40, lineHeight: 1.6 }}>
              Click "Open Sender" to begin. The app requires a Web3 wallet (e.g., MetaMask) to record hashes on-chain.
            </p>
            <button
              onClick={navigateToSend}
              className="btn-primary"
              style={{
                padding: '20px 48px',
                borderRadius: 8,
                border: 'none',
                color: '#fff',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Open Sender
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: 80, textAlign: 'center', color: '#666', fontSize: 16, padding: '40px 0' }}>
          <p style={{ marginBottom: 8 }}>© DocShare</p>
          <p>Secure document transfer with blockchain verification</p>
          <p style={{ marginTop: 8 }}>Built with privacy and security in mind</p>
        </footer>
      </div>
    </div>
  )
}