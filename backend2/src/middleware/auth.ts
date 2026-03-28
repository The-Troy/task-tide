import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

export interface AuthUser {
    id: string;
    email: string;
    role: 'student' | 'class_rep';
    name: string;
}

// Extends Express Request
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.slice(7);

    // Verify the JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }

    // Fetch profile for role info
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        res.status(401).json({ message: 'User profile not found' });
        return;
    }

    req.user = profile as AuthUser;
    next();
}
