import React, { useRef } from 'react'

export const Button = ({ onClick, disabled, children, primary, style, type = 'button' }) => (
  <button
    type={type}
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
      fontWeight: primary ? '500' : 'normal',
      ...style,
    }}
    onMouseOver={e => {
      if (!disabled) {
        e.currentTarget.style.backgroundColor = primary ? '#0056b3' : '#e2e6ea'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }
    }}
    onMouseOut={e => {
      e.currentTarget.style.backgroundColor = disabled ? '#ccc' : primary ? '#007bff' : '#f8f9fa'
      e.currentTarget.style.transform = 'none'
    }}
  >
    {children}
  </button>
)

export const Card = ({ children, style }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '20px',
      border: '1px solid #e9ecef',
      transition: 'transform 0.2s',
      ...style
    }}
    onMouseOver={e => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = 'none'
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
    }}
  >
    {children}
  </div>
)

export const Input = ({ type = 'text', ...props }) => (
  <input
    type={type}
    {...props}
    style={{
      width: '100%',
      padding: '8px 12px',
      border: '2px solid #e9ecef',
      borderRadius: '4px',
      fontSize: '16px',
      transition: 'all 0.2s',
      outline: 'none',
      ...props.style,
    }}
    onFocus={e => {
      e.target.style.borderColor = '#007bff'
      e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)'
    }}
    onBlur={e => {
      e.target.style.borderColor = '#e9ecef'
      e.target.style.boxShadow = 'none'
    }}
  />
)

export const FileInput = ({ onChange, ...props }) => {
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current.click()
  }

  const handleDrop = e => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onChange({ target: { files: [file] } })
    e.currentTarget.style.borderColor = '#e9ecef'
    e.currentTarget.style.backgroundColor = '#f8f9fa'
  }

  return (
    <div
      style={{
        border: '2px dashed #e9ecef',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: '#f8f9fa',
      }}
      onClick={handleClick}
      onDragOver={e => {
        e.preventDefault()
        e.currentTarget.style.borderColor = '#007bff'
        e.currentTarget.style.backgroundColor = '#e8f4ff'
      }}
      onDragLeave={e => {
        e.currentTarget.style.borderColor = '#e9ecef'
        e.currentTarget.style.backgroundColor = '#f8f9fa'
      }}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={onChange}
        style={{ display: 'none' }}
        {...props}
      />
      <div>
        <span
          role="img"
          aria-label="upload"
          style={{ fontSize: '24px', marginBottom: '8px' }}
        >
          📎
        </span>
        <p style={{ margin: '8px 0' }}>Drag and drop a file here, or click to select</p>
      </div>
    </div>
  )
}
