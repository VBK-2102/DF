import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from './config'
import { extractFromSteganographicImage, loadImageFromFile } from './steganography'

const Button = ({ onClick, disabled, children, primary, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      backgroundColor: disabled ? '#ccc' : primary ? '#007bff' : '#f8f9fa',
      color: primary ? 'white' : '#212529',
      transition: 'all 0.2s',
      opacity: disabled ? 0.7 : 1,
      ...style,
      ':hover': {
        backgroundColor: disabled ? '#ccc' : primary ? '#0056b3' : '#e2e6ea',
      }
    }}
  >
    {children}
  </button>
)

export default function Combiner() {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [resolved, setResolved] = useState(null)
  const [error, setError] = useState('')
  const [verifyMsg, setVerifyMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)

  const token = p1 + p2

  // Handle image upload and extraction
  const handleImageUpload = async (file, setter) => {
    try {
      const img = await loadImageFromFile(file);
      const extractedText = extractFromSteganographicImage(img);
      setter(extractedText);
      return img;
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image. Please try again.');
    }
  };

  const resolveToken = async () => {
    setError(''); setResolved(null); setVerifyMsg('')
    if (!token) { setError('Scan or paste both parts first'); return }
    setIsLoading(true)
    try {
      const resp = await fetch(`${API_BASE_URL}/api/resolve?token=${encodeURIComponent(token)}`)
      const data = await resp.json()
      if (!data.success) throw new Error(data.error || 'Resolve failed')
      setResolved(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOnChain = async () => {
    setVerifyMsg('')
    if (!token) { setVerifyMsg('No token'); return }
    setVerifyLoading(true)
    try {
      const resp = await fetch(`${API_BASE_URL}/api/verify?token=${encodeURIComponent(token)}`)
      const data = await resp.json()
      if (!data.success) throw new Error(data.error || 'Verify failed')
      setVerifyMsg(data.isValid ? '✅ Authentic (on-chain hash match)' : '❌ Not found on-chain')
    } catch (e) {
      setVerifyMsg(e.message)
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div>
      <h2>Receiver / Combiner</h2>
      <p>Upload the two steganographic images you received. The hidden data will be extracted and you can verify authenticity on the blockchain and download.</p>

      <div style={{display:'grid', gap:12, maxWidth:580}}>
        <div className="input-group" style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <label>
            Image 1
            <div style={{marginTop: '4px'}}>
              <input 
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const img = await handleImageUpload(file, setP1);
                    setImage1(img);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              {p1 && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#e8f4ff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  Extracted: {p1}
                </div>
              )}
            </div>
          </label>
          <label style={{marginTop: '16px'}}>
            Image 2
            <div style={{marginTop: '4px'}}>
              <input 
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const img = await handleImageUpload(file, setP2);
                    setImage2(img);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              {p2 && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#e8f4ff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  Extracted: {p2}
                </div>
              )}
            </div>
          </label>
        </div>

        <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
          <Button primary onClick={resolveToken} disabled={isLoading || !p1 || !p2}>
            {isLoading ? 'Loading...' : 'Get Link'}
          </Button>
          <Button onClick={verifyOnChain} disabled={verifyLoading || !p1 || !p2}>
            {verifyLoading ? 'Verifying...' : 'Verify Authenticity'}
          </Button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fff5f5',
            color: '#dc3545',
            borderRadius: '4px',
            border: '1px solid #dc3545'
          }}>
            <span role="img" aria-label="error">⚠️</span> {error}
          </div>
        )}

        {verifyMsg && (
          <div style={{
            padding: '12px',
            backgroundColor: verifyMsg.includes('✅') ? '#f0fff4' : '#fff5f5',
            color: verifyMsg.includes('✅') ? '#28a745' : '#dc3545',
            borderRadius: '4px',
            border: `1px solid ${verifyMsg.includes('✅') ? '#28a745' : '#dc3545'}`
          }}>
            {verifyMsg}
          </div>
        )}

        {resolved && (
          <div style={{
            marginTop: 12,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{margin: '0 0 16px 0', color: '#2c3e50'}}>Document Details</h3>
            <div style={{marginBottom: '8px'}}><strong>File:</strong> {resolved.filename}</div>
            <div style={{marginBottom: '16px'}}><strong>On-chain hash:</strong> 
              <code style={{
                backgroundColor: '#f8f9fa',
                padding: '4px 8px',
                borderRadius: '4px',
                marginLeft: '8px',
                fontSize: '0.9em'
              }}>
                {resolved.onChainDocHash}
              </code>
            </div>
            <Button
              primary
              onClick={() => {
                const fullUrl = resolved.downloadUrl.startsWith('http')
                  ? resolved.downloadUrl
                  : `${API_BASE_URL}${resolved.downloadUrl}`;
                window.open(fullUrl, '_blank');
              }}
              style={{width: '100%'}}
            >
              <span role="img" aria-label="download">📥</span> Download Document
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}
