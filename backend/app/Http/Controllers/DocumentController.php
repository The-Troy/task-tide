<?php

namespace App\Http\Controllers;

use App\Mail\NewDocumentUploaded;
use App\Models\Document;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Upload a document to a unit
     */
    public function store(Request $request, Unit $unit)
    {
        $user = $request->user();

        // Check if user has access to this unit
        if (!$unit->hasUser($user)) {
            return response()->json([
                'message' => 'You do not have access to this unit',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'document_type' => ['required', 'in:lecture_notes,past_papers,revision_materials,exam_timetable,lecture_timetable,other'],
            'file' => ['required', 'file', 'max:10240'], // 10MB max
        ]);

        $file = $request->file('file');

        // Store file
        $path = $file->store('documents/' . $unit->id, 'public');

        $document = Document::create([
            'unit_id' => $unit->id,
            'uploaded_by' => $user->id,
            'title' => $validated['title'],
            'document_type' => $validated['document_type'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        $document->load(['uploader', 'unit']);

        // Notify all unit members about the new document (queued)
        $unit->users()
            ->where('user_id', '!=', $user->id)
            ->get()
            ->each(function ($member) use ($document) {
                Mail::to($member->email)->send(
                    new NewDocumentUploaded($document, $member)
                );
            });

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => $document,
        ], 201);
    }

    /**
     * List documents for a unit
     */
    public function index(Request $request, Unit $unit)
    {
        $user = $request->user();

        if (!$unit->hasUser($user)) {
            return response()->json([
                'message' => 'You do not have access to this unit',
            ], 403);
        }

        $documents = $unit->documents()
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'documents' => $documents,
        ]);
    }

    /**
     * Download/view a document
     */
    public function show(Request $request, Document $document)
    {
        $user = $request->user();

        if (!$document->unit->hasUser($user)) {
            return response()->json([
                'message' => 'You do not have access to this document',
            ], 403);
        }

        return Storage::disk('public')->download($document->file_path, $document->file_name);
    }

    /**
     * Delete a document
     */
    public function destroy(Request $request, Document $document)
    {
        $user = $request->user();

        // Only uploader or class rep can delete
        $isClassRep = $document->unit->courseServer->class_rep_id === $user->id;
        $isUploader = $document->uploaded_by === $user->id;

        if (!$isClassRep && !$isUploader) {
            return response()->json([
                'message' => 'You do not have permission to delete this document',
            ], 403);
        }

        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully',
        ]);
    }
}
