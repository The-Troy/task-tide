import { Router } from 'express';
import { supabase } from '../supabase';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(422).json({ message: 'name, email and password are required.' });
        return;
    }

    // Everyone starts as a student; creating a course server promotes them to class_rep
    const role = 'student';

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
    });

    if (authError) {
        res.status(400).json({ message: authError.message });
        return;
    }

    const userId = authData.user.id;

    // Upsert profile — handles the case where a Supabase trigger already
    // inserted the row with a default role, ensuring we always save the
    // user-chosen role.
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, name, email, role }, { onConflict: 'id' })
        .select()
        .single();

    if (profileError) {
        // Rollback auth user
        await supabase.auth.admin.deleteUser(userId);
        res.status(500).json({ message: profileError.message });
        return;
    }

    // Sign in to get a JWT token
    const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
        res.status(500).json({ message: signInError.message });
        return;
    }

    res.status(201).json({
        user: { ...profile, course_servers: [], units: [] },
        token: signIn.session?.access_token,
    });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
        res.status(401).json({ message: 'Invalid email or password.' });
        return;
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
        res.status(500).json({ message: 'Profile not found.' });
        return;
    }

    res.json({ user: profile, token: data.session.access_token });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
    res.json({ user: req.user });
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (_req, res) => {
    res.json({ message: 'Logged out.' });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, async (req, res) => {
    const { name } = req.body;
    if (!name?.trim()) {
        res.status(422).json({ message: 'name is required.' });
        return;
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', req.user!.id)
        .select()
        .single();

    if (error) {
        res.status(500).json({ message: error.message });
        return;
    }

    res.json({ user: profile });
});

export default router;
