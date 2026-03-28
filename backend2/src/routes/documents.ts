import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../supabase';
import { authenticate } from '../middleware/auth';
import { requireClassRep } from '../middleware/requireRole';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// GET /api/units/:unitId/documents
router.get('/units/:unitId/documents', authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from('documents')
        .select('*, uploader:profiles!uploaded_by(id, name, email, role)')
        .eq('unit_id', req.params.unitId)
        .order('created_at', { ascending: false });

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.json({ documents: data });
});

// POST /api/units/:unitId/documents  — class_rep only
router.post('/units/:unitId/documents', authenticate, requireClassRep, upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) { res.status(422).json({ message: 'No file uploaded.' }); return; }

    const { title, document_type } = req.body;
    if (!title || !document_type) { res.status(422).json({ message: 'title and document_type are required.' }); return; }

    const filePath = `unit-${req.params.unitId}/${Date.now()}-${file.originalname}`;

    const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (storageError) { res.status(500).json({ message: storageError.message }); return; }

    const { data, error } = await supabase
        .from('documents')
        .insert({
            unit_id: Number(req.params.unitId),
            uploaded_by: req.user!.id,
            title,
            document_type,
            file_path: filePath,
            file_name: file.originalname,
            file_size: file.size,
            mime_type: file.mimetype,
        })
        .select('*, uploader:profiles!uploaded_by(id, name, email, role)')
        .single();

    if (error) { res.status(500).json({ message: error.message }); return; }
    res.status(201).json({ document: data });
});

// GET /api/documents/:id  — signed download URL
router.get('/documents/:id', authenticate, async (req, res) => {
    const { data: doc, error } = await supabase
        .from('documents')
        .select('file_path, file_name, mime_type')
        .eq('id', req.params.id)
        .single();

    if (error || !doc) { res.status(404).json({ message: 'Document not found.' }); return; }

    const { data: signedUrl, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 60 * 60); // 1 hour

    if (urlError) { res.status(500).json({ message: urlError.message }); return; }

    res.json({ url: signedUrl.signedUrl, file_name: doc.file_name, mime_type: doc.mime_type });
});

// DELETE /api/documents/:id  — class_rep only
router.delete('/documents/:id', authenticate, requireClassRep, async (req, res) => {
    const { data: doc } = await supabase.from('documents').select('file_path').eq('id', req.params.id).single();
    if (doc) {
        await supabase.storage.from('documents').remove([doc.file_path]);
    }
    await supabase.from('documents').delete().eq('id', req.params.id);
    res.json({ message: 'Document deleted.' });
});

export default router;
