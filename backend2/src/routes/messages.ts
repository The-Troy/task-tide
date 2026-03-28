import { Router } from 'express';
import { supabase } from '../supabase';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/units/:unitId/messages?page=1
router.get('/units/:unitId/messages', authenticate, async (req, res) => {
    const page = Number(req.query.page) || 1;
    const perPage = 50;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await supabase
        .from('messages')
        .select('*, user:profiles!user_id(id, name, email, role)', { count: 'exact' })
        .eq('unit_id', req.params.unitId)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) { res.status(500).json({ message: error.message }); return; }

    const total = count ?? 0;
    const lastPage = Math.ceil(total / perPage);

    res.json({
        data: data?.reverse() ?? [],
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
    });
});

// POST /api/units/:unitId/messages
router.post('/units/:unitId/messages', authenticate, async (req, res) => {
    const { message } = req.body;
    if (!message?.trim()) { res.status(422).json({ message: 'message is required.' }); return; }

    const { data, error } = await supabase
        .from('messages')
        .insert({ unit_id: Number(req.params.unitId), user_id: req.user!.id, message })
        .select('*, user:profiles!user_id(id, name, email, role)')
        .single();

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.status(201).json({ data });
});

// PUT /api/messages/:id
router.put('/messages/:id', authenticate, async (req, res) => {
    const { message } = req.body;

    const { data, error } = await supabase
        .from('messages')
        .update({ message, is_edited: true, updated_at: new Date().toISOString() })
        .eq('id', req.params.id)
        .eq('user_id', req.user!.id)
        .select('*, user:profiles!user_id(id, name, email, role)')
        .single();

    if (error || !data) { res.status(404).json({ message: 'Message not found or not yours.' }); return; }
    res.json({ data });
});

// DELETE /api/messages/:id
router.delete('/messages/:id', authenticate, async (req, res) => {
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user!.id);

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.json({ message: 'Deleted.' });
});

export default router;
