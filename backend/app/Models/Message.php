<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'unit_id',
        'user_id',
        'message',
        'is_edited',
    ];

    protected $casts = [
        'is_edited' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */

    // Unit this message belongs to
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // User who sent this message
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */

    // Get recent messages
    public function scopeRecent($query, int $limit = 50)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    // Get messages for a specific unit
    public function scopeForUnit($query, int $unitId)
    {
        return $query->where('unit_id', $unitId);
    }

    /**
     * Helper methods
     */

    // Mark message as edited
    public function markAsEdited(): void
    {
        $this->update(['is_edited' => true]);
    }

    // Check if message can be edited by user
    public function canBeEditedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    // Check if message can be deleted by user
    public function canBeDeletedBy(User $user): bool
    {
        // Can be deleted by owner or class rep
        return $this->user_id === $user->id ||
            $user->isClassRep();
    }

    // Get time elapsed since message was sent
    public function timeAgo(): string
    {
        return $this->created_at->diffForHumans();
    }
}
