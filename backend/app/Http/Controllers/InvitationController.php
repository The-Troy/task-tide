<?php

namespace App\Http\Controllers;

use App\Mail\LecturerInvitation;
use App\Models\Invitation;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InvitationController extends Controller
{
    /**
     * Invite a lecturer to a unit (class rep only)
     */
    public function store(Request $request, Unit $unit)
    {
        $user = $request->user();

        // Only class rep can send invitations
        if ($unit->courseServer->class_rep_id !== $user->id) {
            return response()->json([
                'message' => 'Only the class representative can send invitations',
            ], 403);
        }

        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Check if already invited
        $existingInvitation = Invitation::where('unit_id', $unit->id)
            ->where('email', $validated['email'])
            ->where('status', 'pending')
            ->first();

        if ($existingInvitation) {
            return response()->json([
                'message' => 'An invitation has already been sent to this email',
            ], 400);
        }

        // Check if user is already enrolled
        $existingUser = User::where('email', $validated['email'])->first();
        if ($existingUser && $unit->isLecturer($existingUser)) {
            return response()->json([
                'message' => 'This user is already a lecturer for this unit',
            ], 400);
        }

        $invitation = Invitation::createInvitation(
            $unit->id,
            $validated['email'],
            $user
        );

        $invitation->load(['unit.courseServer', 'inviter']);

        // Build accept/reject URLs pointing to the frontend
        $frontendUrl = config('app.frontend_url', config('app.url'));
        $acceptUrl = "{$frontendUrl}/invitations/{$invitation->token}/accept";
        $rejectUrl = "{$frontendUrl}/invitations/{$invitation->token}/reject";

        // Send invitation email (queued)
        Mail::to($invitation->email)->send(
            new LecturerInvitation($invitation, $acceptUrl, $rejectUrl)
        );

        return response()->json([
            'message' => 'Invitation sent successfully',
            'invitation' => $invitation,
        ], 201);
    }

    /**
     * Get invitation by token
     */
    public function show(Request $request, string $token)
    {
        $invitation = Invitation::where('token', $token)
            ->with(['unit.courseServer', 'inviter'])
            ->firstOrFail();

        if ($invitation->isExpired()) {
            $invitation->markAsExpired();
            return response()->json([
                'message' => 'This invitation has expired',
            ], 410);
        }

        return response()->json([
            'invitation' => $invitation,
        ]);
    }

    /**
     * Accept an invitation
     */
    public function accept(Request $request, string $token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        if ($invitation->isExpired()) {
            $invitation->markAsExpired();
            return response()->json([
                'message' => 'This invitation has expired',
            ], 410);
        }

        if ($invitation->status !== 'pending') {
            return response()->json([
                'message' => 'This invitation has already been processed',
            ], 400);
        }

        $user = $request->user();

        // Verify email matches
        if ($user->email !== $invitation->email) {
            return response()->json([
                'message' => 'This invitation was sent to a different email address',
            ], 403);
        }

        $invitation->accept($user);

        return response()->json([
            'message' => 'Invitation accepted successfully',
            'unit' => $invitation->unit->load('courseServer'),
        ]);
    }

    /**
     * Reject an invitation
     */
    public function reject(Request $request, string $token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        if ($invitation->status !== 'pending') {
            return response()->json([
                'message' => 'This invitation has already been processed',
            ], 400);
        }

        $invitation->reject();

        return response()->json([
            'message' => 'Invitation rejected',
        ]);
    }

    /**
     * List invitations sent by the authenticated user (class rep)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $invitations = Invitation::where('invited_by', $user->id)
            ->with(['unit', 'inviter'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'invitations' => $invitations,
        ]);
    }
}
