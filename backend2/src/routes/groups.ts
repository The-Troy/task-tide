import { Router } from 'express';
import { supabase } from '../supabase';
import { authenticate } from '../middleware/auth';
import { requireClassRep } from '../middleware/requireRole';

const router = Router();

// GET /api/units/:unitId/groups
router.get('/units/:unitId/groups', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('groups')
        .select('*, members:group_members(user:profiles(id, name, email, role))')
        .eq('unit_id', req.params.unitId)
        .order('created_at', { ascending: true });

    if (error) { res.status(500).json({ message: error.message }); return; }

    // Reshape: flatten members array
    const groups = (data ?? []).map((g: { members?: { user: unknown }[]; max_size: number;[key: string]: unknown }) => ({
        ...g,
        members: (g.members ?? []).map((m: { user: unknown }) => m.user),
        members_count: (g.members ?? []).length,
        is_full: (g.members ?? []).length >= g.max_size,
    }));

    res.json({ groups });
});

// POST /api/units/:unitId/groups/auto-setup  — class_rep only
router.post('/units/:unitId/groups/auto-setup', authenticate, requireClassRep, async (req, res) => {
    const groupSize = Number(req.body.group_size) || 4;
    const unitId = Number(req.params.unitId);

    // Get enrolled students for this unit's course server
    const { data: unit } = await supabase.from('units').select('course_server_id').eq('id', unitId).single();
    if (!unit) { res.status(404).json({ message: 'Unit not found.' }); return; }

    const { data: members } = await supabase
        .from('user_course_servers')
        .select('user_id')
        .eq('course_server_id', unit.course_server_id);

    const studentIds = (members ?? []).map((m) => m.user_id);

    // Delete existing groups for this unit
    await supabase.from('groups').delete().eq('unit_id', unitId);

    const groupCount = Math.ceil(studentIds.length / groupSize);
    const createdGroups = [];

    for (let i = 0; i < groupCount; i++) {
        const { data: group } = await supabase
            .from('groups')
            .insert({ unit_id: unitId, name: `Group ${i + 1}`, max_size: groupSize })
            .select()
            .single();

        if (group) {
            const slice = studentIds.slice(i * groupSize, (i + 1) * groupSize);
            if (slice.length > 0) {
                await supabase.from('group_members').insert(slice.map((uid: string) => ({ group_id: group.id, user_id: uid })));
            }
            createdGroups.push(group);
        }
    }

    res.status(201).json({ groups: createdGroups });
});

// GET /api/groups/:id
router.get('/groups/:id', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('groups')
        .select('*, members:group_members(user:profiles(id, name, email, role))')
        .eq('id', req.params.id)
        .single();

    if (error || !data) { res.status(404).json({ message: 'Group not found.' }); return; }
    res.json({ group: { ...data, members: (data.members ?? []).map((m: { user: unknown }) => m.user) } });
});

// PUT /api/groups/:id  — class_rep only
router.put('/groups/:id', authenticate, requireClassRep, async (req, res) => {
    const { name, max_size } = req.body;
    const { data, error } = await supabase
        .from('groups').update({ name, max_size }).eq('id', req.params.id).select().single();
    if (error || !data) { res.status(404).json({ message: 'Group not found.' }); return; }
    res.json({ group: data });
});

// POST /api/groups/:id/join
router.post('/groups/:id/join', authenticate, async (req, res) => {
    const groupId = Number(req.params.id);

    const { data: group } = await supabase.from('groups').select('max_size').eq('id', groupId).single();
    if (!group) { res.status(404).json({ message: 'Group not found.' }); return; }

    const { count } = await supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('group_id', groupId);
    if ((count ?? 0) >= group.max_size) {
        res.status(409).json({ message: 'Group is full.' });
        return;
    }

    await supabase.from('group_members').upsert({ group_id: groupId, user_id: req.user!.id });

    const { data } = await supabase
        .from('groups')
        .select('*, members:group_members(user:profiles(id, name, email, role))')
        .eq('id', groupId).single();

    res.json({ group: { ...data, members: (data?.members ?? []).map((m: { user: unknown }) => m.user) } });
});

// DELETE /api/groups/:id/leave
router.delete('/groups/:id/leave', authenticate, async (req, res) => {
    await supabase.from('group_members').delete().eq('group_id', req.params.id).eq('user_id', req.user!.id);
    res.json({ message: 'Left group.' });
});

// DELETE /api/units/:unitId/groups  — class_rep, delete all groups in unit
router.delete('/units/:unitId/groups', authenticate, requireClassRep, async (req, res) => {
    await supabase.from('groups').delete().eq('unit_id', req.params.unitId);
    res.json({ message: 'All groups deleted.' });
});

export default router;
