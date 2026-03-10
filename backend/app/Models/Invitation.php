<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'email',
        'role',
        'token',
        'invited_by',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Relationships
     */

    // Unit this invitation is for
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // User who sent the invitation
    public function inviter()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Helper methods
     */

    // Generate a unique invitation token
    public static function generateToken(): string
    {
        do {
            $token = Str::random(64);
        } while (self::where('token', $token)->exists());

        return $token;
    }

    // Create a new invitation
    public static function createInvitation(int $unitId, string $email, User $inviter): self
    {
        return self::create([
            'unit_id' => $unitId,
            'email' => $email,
            'role' => 'lecturer',
            'token' => self::generateToken(),
            'invited_by' => $inviter->id,
            'status' => 'pending',
            'expires_at' => Carbon::now()->addDays(7), // 7 days to accept
        ]);
    }

    // Check if invitation is expired
    public function isExpired(): bool
    {
        return $this->expires_at < Carbon::now() || $this->status === 'expired';
    }

    // Check if invitation is pending
    public function isPending(): bool
    {
        return $this->status === 'pending' && !$this->isExpired();
    }

    // Accept the invitation
    public function accept(User $user): bool
    {
        if (!$this->isPending()) {
            return false;
        }

        // Enroll user in the unit as lecturer
        $this->unit->enrollUser($user, 'lecturer');

        // Update invitation status
        $this->update(['status' => 'accepted']);

        // Update user role to lecturer if they're not already
        if (!$user->isLecturer()) {
            $user->update(['role' => 'lecturer']);
        }

        return true;
    }

    // Reject the invitation
    public function reject(): void
    {
        $this->update(['status' => 'rejected']);
    }

    // Mark as expired
    public function markAsExpired(): void
    {
        $this->update(['status' => 'expired']);
    }

    /**
     * Scopes
     */

    // Get pending invitations
    public function scopePending($query)
    {
        return $query->where('status', 'pending')
            ->where('expires_at', '>', Carbon::now());
    }

    // Get invitations for a specific email
    public function scopeForEmail($query, string $email)
    {
        return $query->where('email', $email);
    }
}
