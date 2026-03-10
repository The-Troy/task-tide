<?php

namespace App\Http\Controllers;

use App\Models\CourseServer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseServerController extends Controller
{
    /**
     * List all course servers for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $servers = $user->courseServers()
            ->with(['classRep', 'units'])
            ->withCount('members')
            ->get();

        return response()->json([
            'course_servers' => $servers,
        ]);
    }

    /**
     * Create a new course server (class rep only)
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->isClassRep()) {
            return response()->json([
                'message' => 'Only class representatives can create course servers',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $server = CourseServer::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'code' => CourseServer::generateUniqueCode(),
            'class_rep_id' => $user->id,
        ]);

        // Automatically add the class rep as a member
        $server->addMember($user);

        return response()->json([
            'message' => 'Course server created successfully',
            'course_server' => $server->load('classRep'),
        ], 201);
    }

    /**
     * Show a specific course server
     */
    public function show(Request $request, CourseServer $courseServer)
    {
        // Check if user is a member
        if (!$courseServer->hasMember($request->user())) {
            return response()->json([
                'message' => 'You are not a member of this course server',
            ], 403);
        }

        $courseServer->load([
            'classRep',
            'units.lecturers',
            'members',
        ]);

        return response()->json([
            'course_server' => $courseServer,
        ]);
    }

    /**
     * Update course server (class rep only)
     */
    public function update(Request $request, CourseServer $courseServer)
    {
        $user = $request->user();

        if ($courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can update this server',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $courseServer->update($validated);

        return response()->json([
            'message' => 'Course server updated successfully',
            'course_server' => $courseServer,
        ]);
    }

    /**
     * Join a course server with code
     */
    public function join(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $server = CourseServer::where('code', strtoupper($validated['code']))
            ->where('is_active', true)
            ->first();

        if (!$server) {
            return response()->json([
                'message' => 'Invalid or inactive course code',
            ], 404);
        }

        $user = $request->user();

        if ($server->hasMember($user)) {
            return response()->json([
                'message' => 'You are already a member of this course server',
            ], 400);
        }

        $server->addMember($user);

        // Auto-enroll user in all existing units of this course server
        foreach ($server->units as $unit) {
            $unit->enrollUser($user, 'student');
        }

        return response()->json([
            'message' => 'Successfully joined course server',
            'course_server' => $server->load('classRep'),
        ]);
    }

    /**
     * Leave a course server
     */
    public function leave(Request $request, CourseServer $courseServer)
    {
        $user = $request->user();

        // Class rep cannot leave their own server
        if ($courseServer->class_rep_id === $user->id) {
            return response()->json([
                'message' => 'Class representative cannot leave their own server',
            ], 400);
        }

        if (!$courseServer->hasMember($user)) {
            return response()->json([
                'message' => 'You are not a member of this course server',
            ], 400);
        }

        $courseServer->removeMember($user);

        return response()->json([
            'message' => 'Successfully left course server',
        ]);
    }
}
