import { Router } from 'express';
import { supabase } from '../supabase';
import { authenticate } from '../middleware/auth';
import { requireClassRep } from '../middleware/requireRole';

const router = Router();

// GET /api/units  — all units across enrolled servers
router.get('/', authenticate, async (req, res) => {
    const userId = req.user!.id;

    const { data: memberships } = await supabase
        .from('user_course_servers')
        .select('course_server_id')
        .eq('user_id', userId);

    const serverIds = (memberships ?? []).map((m) => m.course_server_id);

    const { data: ownedServers } = await supabase
        .from('course_servers')
        .select('id')
        .eq('class_rep_id', userId);

    const ownedIds = (ownedServers ?? []).map((s) => s.id);
    const allServerIds = [...new Set([...serverIds, ...ownedIds])];

    if (allServerIds.length === 0) { res.json({ units: [] }); return; }

    const { data, error } = await supabase
        .from('units')
        .select('*, course_server:course_servers(*)')
        .in('course_server_id', allServerIds)
        .order('created_at', { ascending: true });

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.json({ units: data });
});

// POST /api/course-servers/:serverId/units  — class_rep only
router.post('/course-servers/:serverId/units', authenticate, requireClassRep, async (req, res) => {
    const { name, unit_code, description, credits } = req.body;
    if (!name || !unit_code) { res.status(422).json({ message: 'name and unit_code are required.' }); return; }

    const { data, error } = await supabase
        .from('units')
        .insert({ course_server_id: Number(req.params.serverId), name, unit_code, description, credits })
        .select()
        .single();

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.status(201).json({ unit: data });
});

// GET /api/units/:id
router.get('/:id', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('units')
        .select('*, course_server:course_servers(*)')
        .eq('id', req.params.id)
        .single();

    if (error || !data) { res.status(404).json({ message: 'Unit not found.' }); return; }
    res.json({ unit: data });
});

// PUT /api/units/:id  — class_rep only
router.put('/:id', authenticate, requireClassRep, async (req, res) => {
    const { name, unit_code, description, credits } = req.body;

    const { data, error } = await supabase
        .from('units')
        .update({ name, unit_code, description, credits })
        .eq('id', req.params.id)
        .select()
        .single();

    if (error || !data) { res.status(404).json({ message: 'Unit not found.' }); return; }
    res.json({ unit: data });
});

// DELETE /api/units/:id  — class_rep only
router.delete('/:id', authenticate, requireClassRep, async (req, res) => {
    const { error } = await supabase.from('units').delete().eq('id', req.params.id);
    if (error) { res.status(500).json({ message: error.message }); return; }
    res.json({ message: 'Unit deleted.' });
});

export default router;
