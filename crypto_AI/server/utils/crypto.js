import crypto from 'crypto';

export function newId() {
  // TEXT id; avoids DB extensions
  return crypto.randomUUID(); // Node 18+ 
}

export function randomTokenBase64Url(bytes = 64) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function sha256Base64(token) {
  return crypto.createHash('sha256').update(token).digest('base64');
}