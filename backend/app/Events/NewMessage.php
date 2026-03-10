<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public readonly Message $message,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     * Uses a presence channel so we know who is online.
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("unit.{$this->message->unit_id}"),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.new';
    }

    /**
     * Data to broadcast with the event.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id'         => $this->message->id,
                'unit_id'    => $this->message->unit_id,
                'user_id'    => $this->message->user_id,
                'message'    => $this->message->message,
                'is_edited'  => $this->message->is_edited,
                'created_at' => $this->message->created_at->toISOString(),
                'updated_at' => $this->message->updated_at->toISOString(),
                'user'       => [
                    'id'   => $this->message->user->id,
                    'name' => $this->message->user->name,
                    'role' => $this->message->user->role,
                ],
            ],
        ];
    }
}
