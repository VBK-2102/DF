import React from 'react';

const WalletConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  isLoading, 
  transactionData 
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#2c3e50',
          fontSize: '18px'
        }}>
          Confirm Document Storage
        </h3>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
            You are about to:
          </p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Store document hash on blockchain</li>
            <li>Send email with QR codes to recipient</li>
            <li>Pay gas fees for the transaction</li>
          </ul>
        </div>

        {transactionData && (
          <div style={{
            backgroundColor: '#e8f4ff',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            <div><strong>Recipient:</strong> {transactionData.email}</div>
            <div><strong>Document:</strong> {transactionData.fileName}</div>
            <div><strong>Document Hash:</strong> {transactionData.docHash}</div>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Processing...' : 'Confirm & Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConfirmationModal;
