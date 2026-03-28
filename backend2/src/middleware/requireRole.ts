import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that restricts a route to class_rep users only.
 * Must be used AFTER the `authenticate` middleware.
 */
export function requireClassRep(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== 'class_rep') {
        res.status(403).json({ message: 'Only class representatives can perform this action.' });
        return;
    }
    next();
}
