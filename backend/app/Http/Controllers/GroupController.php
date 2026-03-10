<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    /**
     * List all groups for a unit.
     */
    public function index(Request $request, Unit $unit)
    {
        if (!$unit->hasUser($request->user())) {
            return response()->json([
                'message' => 'You do not have access to this unit',
            ], 403);
        }

        $groups = $unit->groups()
            ->with('members:id,name,role')
            ->withCount('members')
            ->get()
            ->map(function ($group) {
                $group->is_full = $group->members_count >= $group->max_size;
                return $group;
            });

        return response()->json([
            'groups' => $groups,
        ]);
    }

    /**
     * Auto-generate groups for a unit (class rep only).
     *
     * Divides all enrolled students into groups of a given size.
     * Any existing groups for the unit are cleared first.
     */
    public function autoSetup(Request $request, Unit $unit)
    {
        $user = $request->user();

        if ($unit->courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can set up groups',
            ], 403);
        }

        $validated = $request->validate([
            'group_size' => ['required', 'integer', 'min:2', 'max:20'],
        ]);

        $groupSize = $validated['group_size'];

        // Get all students enrolled in this unit (exclude lecturers)
        $students = $unit->students()->get();

        if ($students->isEmpty()) {
            return response()->json([
                'message' => 'No students are enrolled in this unit',
            ], 422);
        }

        DB::transaction(function () use ($unit, $students, $groupSize) {
            // Clear existing groups for this unit
            $unit->groups()->delete();

            // Shuffle students for random assignment
            $shuffled = $students->shuffle();

            // Split into chunks of $groupSize
            $chunks = $shuffled->chunk($groupSize);

            foreach ($chunks as $index => $chunk) {
                $groupNumber = $index + 1;

                $group = Group::create([
                    'unit_id'  => $unit->id,
                    'name'     => "Group {$groupNumber}",
                    'max_size' => $groupSize,
                ]);

                foreach ($chunk as $student) {
                    $group->addMember($student);
                }
            }
        });

        // Reload groups with members
        $groups = $unit->groups()
            ->with('members:id,name,role')
            ->withCount('members')
            ->get();

        return response()->json([
            'message' => "Successfully created {$groups->count()} group(s) of up to {$groupSize} students",
            'groups'  => $groups,
        ], 201);
    }

    /**
     * Show a single group.
     */
    public function show(Request $request, Group $group)
    {
        if (!$group->unit->hasUser($request->user())) {
            return response()->json([
                'message' => 'You do not have access to this group',
            ], 403);
        }

        $group->load('members:id,name,role');

        return response()->json([
            'group' => $group,
        ]);
    }

    /**
     * Rename a group (class rep only).
     */
    public function update(Request $request, Group $group)
    {
        $user = $request->user();

        if ($group->unit->courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can rename groups',
            ], 403);
        }

        $validated = $request->validate([
            'name'     => ['sometimes', 'string', 'max:255'],
            'max_size' => ['sometimes', 'integer', 'min:2', 'max:20'],
        ]);

        $group->update($validated);

        return response()->json([
            'message' => 'Group updated successfully',
            'group'   => $group->load('members:id,name,role'),
        ]);
    }

    /**
     * Delete all groups for a unit (class rep only).
     */
    public function destroyAll(Request $request, Unit $unit)
    {
        $user = $request->user();

        if ($unit->courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can delete groups',
            ], 403);
        }

        $unit->groups()->delete();

        return response()->json([
            'message' => 'All groups have been deleted',
        ]);
    }

    /**
     * Student joins an available group (self-join).
     */
    public function join(Request $request, Group $group)
    {
        $user = $request->user();

        // Must be enrolled in the unit
        if (!$group->unit->hasUser($user)) {
            return response()->json([
                'message' => 'You are not enrolled in this unit',
            ], 403);
        }

        // Check if already in any group for this unit
        $alreadyInGroup = Group::where('unit_id', $group->unit_id)
            ->whereHas('members', fn ($q) => $q->where('user_id', $user->id))
            ->exists();

        if ($alreadyInGroup) {
            return response()->json([
                'message' => 'You are already in a group for this unit',
            ], 400);
        }

        // Check if group has space
        if (!$group->hasSpace()) {
            return response()->json([
                'message' => 'This group is full',
            ], 400);
        }

        $group->addMember($user);

        return response()->json([
            'message' => 'Successfully joined the group',
            'group'   => $group->load('members:id,name,role'),
        ]);
    }

    /**
     * Student leaves their group.
     */
    public function leave(Request $request, Group $group)
    {
        $user = $request->user();

        if (!$group->hasMember($user)) {
            return response()->json([
                'message' => 'You are not in this group',
            ], 400);
        }

        $group->removeMember($user);

        return response()->json([
            'message' => 'Successfully left the group',
        ]);
    }
}
