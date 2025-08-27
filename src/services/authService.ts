import jwt from 'jsonwebtoken';
import config from '../config';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    if (typeof decoded === 'object' && 'userId' in decoded) {
      return decoded as DecodedToken;
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
}