<?php

namespace App\Http\Controllers;

use App\Events\MessageDeleted;
use App\Events\MessageUpdated;
use App\Events\NewMessage;
use App\Models\Message;
use App\Models\Unit;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Send a message to a unit
     */
    public function store(Request $request, Unit $unit)
    {
        $user = $request->user();

        if (!$unit->hasUser($user)) {
            return response()->json([
                'message' => 'You do not have access to this unit',
            ], 403);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $message = Message::create([
            'unit_id' => $unit->id,
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);

        $message->load('user');

        // Broadcast to all other users in the unit's presence channel
        broadcast(new NewMessage($message))->toOthers();

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message,
        ], 201);
    }

    /**
     * Get messages for a unit (with pagination)
     */
    public function index(Request $request, Unit $unit)
    {
        $user = $request->user();

        if (!$unit->hasUser($user)) {
            return response()->json([
                'message' => 'You do not have access to this unit',
            ], 403);
        }

        $messages = $unit->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        return response()->json($messages);
    }

    /**
     * Update a message (owner only)
     */
    public function update(Request $request, Message $message)
    {
        $user = $request->user();

        if (!$message->canBeEditedBy($user)) {
            return response()->json([
                'message' => 'You can only edit your own messages',
            ], 403);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $message->update([
            'message' => $validated['message'],
        ]);

        $message->markAsEdited();
        $message->load('user');

        // Broadcast updated message to other users in the unit
        broadcast(new MessageUpdated($message))->toOthers();

        return response()->json([
            'message' => 'Message updated successfully',
            'data' => $message,
        ]);
    }

    /**
     * Delete a message
     */
    public function destroy(Request $request, Message $message)
    {
        $user = $request->user();

        if (!$message->canBeDeletedBy($user)) {
            return response()->json([
                'message' => 'You do not have permission to delete this message',
            ], 403);
        }

        $messageId = $message->id;
        $unitId = $message->unit_id;

        $message->delete();

        // Broadcast deletion to other users in the unit
        broadcast(new MessageDeleted($messageId, $unitId))->toOthers();

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }
}
