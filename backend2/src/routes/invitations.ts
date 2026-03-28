import { Router } from 'express';
import { supabase } from '../supabase';
import { authenticate } from '../middleware/auth';
import { requireClassRep } from '../middleware/requireRole';
import { nanoid } from 'nanoid';

const router = Router();

// GET /api/invitations  — invitations for current user's units
router.get('/', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('invitations')
        .select('*, unit:units(*), inviter:profiles!invited_by(id, name, email, role)')
        .eq('email', req.user!.email)
        .neq('status', 'expired')
        .order('created_at', { ascending: false });

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.json({ invitations: data });
});

// POST /api/units/:unitId/invitations  — class_rep only
router.post('/units/:unitId/invitations', authenticate, requireClassRep, async (req, res) => {
    const { email } = req.body;
    if (!email) { res.status(422).json({ message: 'email is required.' }); return; }

    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const { data, error } = await supabase
        .from('invitations')
        .insert({
            unit_id: Number(req.params.unitId),
            email,
            token,
            expires_at: expiresAt,
            invited_by: req.user!.id,
        })
        .select('*, unit:units(*)')
        .single();

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.status(201).json({ invitation: data });
});

// GET /api/invitations/:token  — public, anyone with the token
router.get('/:token', async (req, res) => {
    const { data, error } = await supabase
        .from('invitations')
        .select('*, unit:units(*), inviter:profiles!invited_by(id, name, email, role)')
        .eq('token', req.params.token)
        .single();

    if (error || !data) { res.status(404).json({ message: 'Invitation not found.' }); return; }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
        await supabase.from('invitations').update({ status: 'expired' }).eq('id', data.id);
        res.status(410).json({ message: 'Invitation has expired.' });
        return;
    }

    res.json({ invitation: data });
});

// POST /api/invitations/:token/accept
router.post('/:token/accept', authenticate, async (req, res) => {
    const { data: inv, error } = await supabase
        .from('invitations')
        .select('*, unit:units!unit_id(id, course_server_id)')
        .eq('token', req.params.token)
        .single();

    if (error || !inv) { res.status(404).json({ message: 'Invitation not found.' }); return; }
    if (inv.status !== 'pending') { res.status(409).json({ message: `Invitation already ${inv.status}.` }); return; }
    if (new Date(inv.expires_at) < new Date()) {
        await supabase.from('invitations').update({ status: 'expired' }).eq('id', inv.id);
        res.status(410).json({ message: 'Invitation has expired.' });
        return;
    }

    // Enrol user in server
    const csId = (inv.unit as { course_server_id: number }).course_server_id;
    await supabase.from('user_course_servers').upsert({ user_id: req.user!.id, course_server_id: csId });

    // Mark accepted
    await supabase.from('invitations').update({ status: 'accepted' }).eq('id', inv.id);

    const { data: unit } = await supabase.from('units').select('*').eq('id', inv.unit_id).single();
    res.json({ unit });
});

// POST /api/invitations/:token/reject
router.post('/:token/reject', authenticate, async (req, res) => {
    await supabase.from('invitations').update({ status: 'rejected' }).eq('token', req.params.token);
    res.json({ message: 'Invitation rejected.' });
});

export default router;
