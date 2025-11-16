// Client-side steganography utilities

// Utility functions for steganography
function bytesFromString(s) {
  return new TextEncoder().encode(s);
}

function stringFromBytes(b) {
  return new TextDecoder().decode(b);
}

function uint32ToBytes(n) {
  return [(n >> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function bytesToUint32(arr) {
  return (arr[0] << 24) | (arr[1] << 16) | (arr[2] << 8) | arr[3];
}

// Extract text from steganographic image
export function extractFromSteganographicImage(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Extract bits from LSB of RGB channels
  const bits = [];
  for (let i = 0; i < data.length; i += 4) {
    bits.push(data[i] & 1);     // Red
    bits.push(data[i + 1] & 1); // Green
    bits.push(data[i + 2] & 1); // Blue
    // Skip alpha
  }
  
  if (bits.length < 32) {
    return '';
  }
  
  // Extract length (first 32 bits)
  const lenBytes = new Uint8Array(4);
  for (let i = 0; i < 4; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j];
    }
    lenBytes[i] = b;
  }
  
  const length = bytesToUint32(lenBytes);
  
  // Extract payload
  const payloadBits = bits.slice(32, 32 + length * 8);
  const output = new Uint8Array(length);
  
  for (let i = 0; i < length; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | payloadBits[i * 8 + j];
    }
    output[i] = b;
  }
  
  return stringFromBytes(output);
}

// Load image from file
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error('Invalid image'));
    };
    img.src = url;
  });
}
