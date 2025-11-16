import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from './config'
import { Button, Card, Input } from './components'
import { ethers } from 'ethers'

// Contract configuration
const CONTRACT_ADDRESS = '0x121B48de8BE585ffe1a7B4f5A7dfe24bc792A34f'
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'receiverHash', type: 'bytes32' },
      { internalType: 'bytes32', name: 'docHash', type: 'bytes32' }
    ],
    name: 'storeDocument',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

export default function Sender () {
  const [documents, setDocuments] = useState([])
  const [filteredDocs, setFilteredDocs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocId, setSelectedDocId] = useState(null)
  const [showSelector, setShowSelector] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const [uploadFile, setUploadFile] = useState(null)
  const [uploadCategory, setUploadCategory] = useState('Healthcare')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  // Load documents from API
  useEffect(() => {
    const loadDocs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/documents`)
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`Failed to load documents: ${res.status} ${res.statusText} ${text ? '- ' + text.substring(0, 200) : ''}`)
        }
        const ct = res.headers.get('content-type') || ''
        if (!ct.includes('application/json')) {
          const text = await res.text().catch(() => '')
          throw new Error('Expected JSON from server but received: ' + (text.substring(0, 200) || '<no body>'))
        }
        const js = await res.json()
        if (!js.success) throw new Error(js.error || 'Failed loading documents')
        setDocuments(js.documents || [])
      } catch (err) {
        console.error('Failed to load documents', err)
        setMessage('Failed to load stored documents: ' + (err.message || 'Unknown error'))
      }
    }
    loadDocs()
  }, [])

  useEffect(() => {
    const lower = (searchTerm || '').toLowerCase()
    setFilteredDocs(documents.filter(d => !lower || d.filename.toLowerCase().includes(lower) || (d.description || '').toLowerCase().includes(lower)))
  }, [documents, searchTerm])

  const refreshDocs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents`)
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const js = await res.json()
      if (!js.success) throw new Error(js.error || 'Failed loading documents')
      setDocuments(js.documents || [])
    } catch (err) {
      console.error('Failed to load documents', err)
    }
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        setIsConnected(true)
        setMessage('Wallet connected successfully!')
      } else {
        setMessage('Please install MetaMask to use this feature')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setMessage('Failed to connect wallet')
    }
  }

  const performSend = async (docId, toEmail) => {
    if (!docId) { setMessage('Select a stored document first'); return }
    if (!toEmail) { setMessage('Provide receiver email'); return }
    if (!isConnected) { setMessage('Please connect your wallet first'); return }

    try {
      setLoading(true)
      const docMeta = documents.find(d => d.id === docId)
      if (!docMeta) throw new Error('Selected document metadata not found')
      const docHashHex = docMeta.docHashHex
      const receiverHashHex = ethers.keccak256(ethers.toUtf8Bytes(toEmail.toLowerCase()))

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      setMessage('Please confirm the transaction in MetaMask...')
      const tx = await contract.storeDocument(receiverHashHex, docHashHex)
      setMessage('Transaction submitted! Waiting for confirmation...')
      await tx.wait()

      setMessage('Blockchain transaction confirmed! Sending document...')

      const resp = await fetch(`${API_BASE_URL}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, toEmail, walletAddress, docHashHex, receiverHashHex })
      })
      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        throw new Error(`Send failed: ${resp.status} ${resp.statusText} ${text ? '- ' + text.substring(0,200) : ''}`)
      }
      const ctSend = resp.headers.get('content-type') || ''
      if (!ctSend.includes('application/json')) {
        const text = await resp.text().catch(() => '')
        throw new Error('Expected JSON from server after send but received: ' + (text.substring(0,200) || '<no body>'))
      }
      const data = await resp.json()
      if (!data.success) throw new Error(data.error || 'Failed')

      setResult(data)
      setMessage('Email sent! Steganographic images delivered. Blockchain transaction confirmed.')
    } catch (err) {
      console.error('Transaction error:', err)
      if (err.code === 4001) setMessage('Transaction rejected by user')
      else if (err.code === -32603) setMessage('Transaction failed. Please check your wallet balance and try again.')
      else setMessage(err.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setResult(null)
    await performSend(selectedDocId, email)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!uploadFile) { setMessage('Choose a file to upload'); return }
    if (!uploadCategory) { setMessage('Select a category'); return }
    try {
      setUploading(true)

      if (!isConnected) {
        await connectWallet()
        if (!isConnected && !walletAddress) {
          throw new Error('Wallet connection required to store document on-chain')
        }
      }

      const buffer = await uploadFile.arrayBuffer()
      const docHashHex = ethers.keccak256(new Uint8Array(buffer))
      const receiverHashHex = ethers.keccak256(ethers.toUtf8Bytes((walletAddress || '').toLowerCase()))

      try {
        setMessage('Please confirm the on-chain storage transaction in MetaMask...')
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        const tx = await contract.storeDocument(receiverHashHex, docHashHex)
        setMessage('Transaction submitted, waiting for confirmation...')
        await tx.wait()
        setMessage('On-chain storage confirmed. Uploading file to server...')
      } catch (txErr) {
        console.error('On-chain store failed', txErr)
        throw new Error('On-chain storage failed or was rejected')
      }

      const fd = new FormData()
      fd.append('file', uploadFile)
      fd.append('category', uploadCategory)
      fd.append('description', uploadDescription)
      fd.append('docHashHex', docHashHex)
      fd.append('walletAddress', walletAddress || '')

      const resp = await fetch(`${API_BASE_URL}/api/documents`, { method: 'POST', body: fd })
      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        throw new Error(`Upload failed: ${resp.status} ${resp.statusText} ${text ? '- ' + text.substring(0,200) : ''}`)
      }
      const ct = resp.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        const text = await resp.text().catch(() => '')
        throw new Error('Expected JSON from server after upload but received: ' + (text.substring(0,200) || '<no body>'))
      }
      const js = await resp.json()
      if (!js.success) throw new Error(js.error || 'Upload failed')

      setMessage('Document uploaded and recorded on-chain successfully')
      setUploadFile(null)
      setUploadDescription('')
      await refreshDocs()
    } catch (err) {
      console.error('Upload error', err)
      setMessage(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '12px' }}>Send Secure Documents</h2>
          <p style={{ color: '#6c757d', lineHeight: '1.5' }}>
            Upload a document and send two steganographic images to the receiver's email. The document hash is recorded on-chain for integrity verification.
          </p>
        </div>

        {!isConnected && (
          <Button onClick={connectWallet} primary style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role='img' aria-label='wallet'>👛</span>
              <span>Connect Wallet</span>
            </div>
          </Button>
        )}

        {isConnected && (
          <div style={{ marginBottom: '20px', padding: '8px', backgroundColor: '#e8f4ff', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span role='img' aria-label='wallet'>👛</span>
            <span style={{ color: '#0056b3' }}>Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
          </div>
        )}

        <Card>
          <form onSubmit={handleUpload} style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Upload Document to Categories</h3>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>File</label>
              <input type='file' onChange={e => setUploadFile(e.target.files?.[0] || null)} />
              {uploadFile && <div style={{ marginTop: 8, fontSize: 14, color: '#2c3e50' }}>{uploadFile.name}</div>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Category</label>
              <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
                <option>Healthcare</option>
                <option>Defence</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Description (optional)</label>
              <input value={uploadDescription} onChange={e => setUploadDescription(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6 }} />
            </div>
            <div>
              <Button type='submit' primary disabled={uploading}>{uploading ? 'Uploading...' : 'Upload to Store'}</Button>
            </div>
          </form>

          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#495057', fontWeight: '500' }}>Stored Document</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button type='button' onClick={async () => { await refreshDocs(); setShowSelector(true); }}>
                  Select Stored Document
                </Button>
                <div style={{ fontSize: 13, color: '#6c757d' }}>{selectedDocId ? (documents.find(d => d.id === selectedDocId)?.filename || selectedDocId) : 'None selected'}</div>
              </div>

              {showSelector && (
                <div style={{ marginTop: 12, border: '1px solid #e9ecef', borderRadius: 8, padding: 8 }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Category</label>
                      <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setNameFilter(''); }} style={{ width: '100%', padding: 8, borderRadius: 6 }}>
                        <option value=''>-- Select category --</option>
                        <option value='Healthcare'>Healthcare</option>
                        <option value='Defence'>Defence</option>
                      </select>
                    </div>

                    
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Documents</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select value={selectedDocId || ''} onChange={e => { const id = e.target.value; setSelectedDocId(id || null); if (id) setShowSelector(false); }} style={{ flex: 1, padding: 8, borderRadius: 6 }}>
                          <option value=''>-- Select document --</option>
                          {documents
                            .filter(d => categoryFilter ? d.category === categoryFilter : false)
                            .filter(d => !nameFilter || d.filename.toLowerCase().includes(nameFilter.toLowerCase()))
                            .map(d => (
                              <option key={d.id} value={d.id}>{d.filename}{d.description ? ' — ' + d.description : ''}</option>
                            ))}
                        </select>
                        <Button type='button' onClick={async () => { await refreshDocs(); }} style={{ whiteSpace: 'nowrap' }}>Refresh</Button>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, color: '#6c757d' }}>{(documents.filter(d => categoryFilter ? d.category === categoryFilter : false).filter(d => !nameFilter || d.filename.toLowerCase().includes(nameFilter.toLowerCase())).length)} documents</div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type='button' onClick={() => { setShowSelector(false); }}>Close</Button>
                      <Button type='button' onClick={() => { setCategoryFilter(''); setNameFilter(''); setSelectedDocId(null); }}>Clear</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#495057', fontWeight: '500' }}>Receiver's Email</label>
              <Input type='email' placeholder="Enter receiver's email address" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <Button type='submit' primary disabled={loading || !selectedDocId || !email} style={{ marginTop: '8px' }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>Sending...</span>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span role='img' aria-label='send'>📤</span>
                  <span>Upload & Send</span>
                </div>
              )}
            </Button>
          </form>
        </Card>

        {message && (
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', backgroundColor: message.includes('sent') ? '#d4edda' : '#f8d7da', color: message.includes('sent') ? '#155724' : '#721c24', border: `1px solid ${message.includes('sent') ? '#c3e6cb' : '#f5c6cb'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span role='img' aria-label={message.includes('sent') ? 'success' : 'error'}>{message.includes('sent') ? '✅' : '⚠️'}</span>
            {message}
          </div>
        )}

        {result && (
          <Card style={{ marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50' }}>Transaction Details</h3>
            <div style={{ display: 'grid', gap: '12px', fontSize: '14px', color: '#495057' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <strong>File ID:</strong>
                <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>{result.fileId}</code>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <strong>Email ID:</strong>
                <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>{result.emailId}</code>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <strong>Document Hash:</strong>
                <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px', wordBreak: 'break-all' }}>{result.docHashHex}</code>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Right column */}
      <div>
        <Card>
          <h3 style={{ margin: 0 }}>Search Documents</h3>
          <input type='text' placeholder='Search by filename or description' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, marginTop: 12, marginBottom: 12 }} />

          <h3 style={{ margin: '8px 0' }}>Stored Document</h3>
          <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 12 }}>
            {['Healthcare', 'Defence'].map(category => (
              <div key={category} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{category}</div>
                {filteredDocs.filter(d => d.category === category).length === 0 && (
                  <div style={{ color: '#6c757d', fontSize: 13 }}>No documents</div>
                )}
                {filteredDocs.filter(d => d.category === category).map(d => (
                  <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6, backgroundColor: d.id === selectedDocId ? '#e8f4ff' : 'transparent', cursor: 'pointer' }}>
                    <input type='radio' name='selectedDocRight' checked={d.id === selectedDocId} onChange={() => setSelectedDocId(d.id)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{d.filename}</div>
                      <div style={{ fontSize: 12, color: '#6c757d' }}>{d.description || ''}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#6c757d' }}>{d.id}</div>
                  </label>
                ))}
              </div>
            ))}
          </div>

        
        </Card>
      </div>
    </div>
  )
}
