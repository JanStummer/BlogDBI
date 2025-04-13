// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IUserPayload {
  id: string;
  username: string;
}

// Erweitere den Express Request Typ
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Token aus dem Authorization Header extrahieren
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      throw new Error('No token provided');
    }
    
    // "Bearer TOKEN" Format verarbeiten
    const token = authHeader.replace('Bearer ', '');
    
    // Token verifizieren
    const decoded = jwt.verify(token, JWT_SECRET) as IUserPayload;
    
    // User an Request anfügen
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};