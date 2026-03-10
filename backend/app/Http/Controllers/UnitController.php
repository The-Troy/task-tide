<?php

namespace App\Http\Controllers;

use App\Models\CourseServer;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Create a new unit in a course server (class rep only)
     */
    public function store(Request $request, CourseServer $courseServer)
    {
        $user = $request->user();

        // Only class rep can create units
        if ($courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can create units',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'unit_code' => ['required', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
            'credits' => ['nullable', 'integer', 'min:1'],
        ]);

        $unit = $courseServer->units()->create($validated);

        // Auto-enroll all course server members as students
        foreach ($courseServer->members as $member) {
            $unit->enrollUser($member, 'student');
        }

        return response()->json([
            'message' => 'Unit created successfully',
            'unit' => $unit,
        ], 201);
    }

    /**
     * Show a specific unit
     */
    public function show(Request $request, Unit $unit)
    {
        $user = $request->user();

        // Check if user has access to this unit
        if (!$unit->hasUser($user)) {
            return response()->json([
                'message' => 'You do not have access to this unit',
            ], 403);
        }

        $unit->load([
            'courseServer.classRep',
            'students',
            'lecturers',
            'documents.uploader',
        ]);

        return response()->json([
            'unit' => $unit,
        ]);
    }

    /**
     * Update a unit (class rep only)
     */
    public function update(Request $request, Unit $unit)
    {
        $user = $request->user();

        if ($unit->courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can update units',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'unit_code' => ['sometimes', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
            'credits' => ['nullable', 'integer', 'min:1'],
        ]);

        $unit->update($validated);

        return response()->json([
            'message' => 'Unit updated successfully',
            'unit' => $unit,
        ]);
    }

    /**
     * Delete a unit (class rep only)
     */
    public function destroy(Request $request, Unit $unit)
    {
        $user = $request->user();

        if ($unit->courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can delete units',
            ], 403);
        }

        $unit->delete();

        return response()->json([
            'message' => 'Unit deleted successfully',
        ]);
    }

    /**
     * List all units for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $units = $user->units()
            ->with(['courseServer', 'lecturers'])
            ->withCount(['students', 'documents', 'messages'])
            ->get();

        return response()->json([
            'units' => $units,
        ]);
    }
}
