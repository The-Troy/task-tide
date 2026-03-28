import { Router } from 'express';
import { supabase } from '../supabase';
import { authenticate } from '../middleware/auth';
import { requireClassRep } from '../middleware/requireRole';

const router = Router();

function generateCode(name: string): string {
    const prefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${rand}`;
}

// GET /api/course-servers  — list servers the current user belongs to
router.get('/', authenticate, async (req, res) => {
    const userId = req.user!.id;

    // Get servers where user is a member OR is the class rep
    const { data: memberships } = await supabase
        .from('user_course_servers')
        .select('course_server_id')
        .eq('user_id', userId);

    const memberIds = (memberships ?? []).map((m) => m.course_server_id);

    const { data: ownedServers } = await supabase
        .from('course_servers')
        .select('id')
        .eq('class_rep_id', userId);

    const ownedIds = (ownedServers ?? []).map((s) => s.id);

    const allIds = [...new Set([...memberIds, ...ownedIds])];

    if (allIds.length === 0) {
        res.json({ course_servers: [] });
        return;
    }

    const { data, error } = await supabase
        .from('course_servers')
        .select('*, class_rep:profiles!class_rep_id(id, name, email, role), units(*)')
        .in('id', allIds)
        .order('created_at', { ascending: false });

    if (error) { res.status(500).json({ message: error.message }); return; }

    res.json({ course_servers: data });
});

// POST /api/course-servers  — any authenticated user; promotes them to class_rep
router.post('/', authenticate, async (req, res) => {
    const { name, description } = req.body;
    if (!name) { res.status(422).json({ message: 'name is required.' }); return; }

    let code = generateCode(name);
    // Ensure unique
    for (let i = 0; i < 5; i++) {
        const { data } = await supabase.from('course_servers').select('id').eq('code', code).maybeSingle();
        if (!data) break;
        code = generateCode(name);
    }

    // Promote user to class_rep if not already
    if (req.user!.role !== 'class_rep') {
        await supabase.from('profiles').update({ role: 'class_rep' }).eq('id', req.user!.id);
        req.user!.role = 'class_rep';
    }

    const { data, error } = await supabase
        .from('course_servers')
        .insert({ name, description, code, class_rep_id: req.user!.id })
        .select('*, class_rep:profiles!class_rep_id(id, name, email, role)')
        .single();

    if (error) { res.status(500).json({ message: error.message }); return; }

    // Creator is auto-enrolled
    await supabase.from('user_course_servers').insert({ user_id: req.user!.id, course_server_id: data.id });

    res.status(201).json({ course_server: data });
});

// GET /api/course-servers/:id
router.get('/:id', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('course_servers')
        .select('*, class_rep:profiles!class_rep_id(id, name, email, role), units(*)')
        .eq('id', req.params.id)
        .single();

    if (error || !data) { res.status(404).json({ message: 'Course server not found.' }); return; }
    res.json({ course_server: data });
});

// PUT /api/course-servers/:id  — class_rep owner only
router.put('/:id', authenticate, requireClassRep, async (req, res) => {
    const { name, description, is_active } = req.body;

    const { data, error } = await supabase
        .from('course_servers')
        .update({ name, description, is_active })
        .eq('id', req.params.id)
        .eq('class_rep_id', req.user!.id)
        .select()
        .single();

    if (error || !data) { res.status(404).json({ message: 'Server not found or unauthorised.' }); return; }
    res.json({ course_server: data });
});

// POST /api/course-servers/join  — student joins by code
router.post('/join', authenticate, async (req, res) => {
    const { code } = req.body;
    if (!code) { res.status(422).json({ message: 'code is required.' }); return; }

    const { data: server, error } = await supabase
        .from('course_servers')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

    if (error || !server) { res.status(404).json({ message: 'Invalid join code.' }); return; }

    // Check not already a member
    const { data: existing } = await supabase
        .from('user_course_servers')
        .select('user_id')
        .eq('user_id', req.user!.id)
        .eq('course_server_id', server.id)
        .maybeSingle();

    if (!existing) {
        await supabase.from('user_course_servers').insert({ user_id: req.user!.id, course_server_id: server.id });
    }

    res.json({ course_server: server });
});

// DELETE /api/course-servers/:id/leave
router.delete('/:id/leave', authenticate, async (req, res) => {
    await supabase
        .from('user_course_servers')
        .delete()
        .eq('user_id', req.user!.id)
        .eq('course_server_id', req.params.id);

    res.json({ message: 'Left server.' });
});

export default router;
