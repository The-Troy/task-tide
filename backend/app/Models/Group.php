<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'name',
        'max_size',
    ];

    protected $casts = [
        'max_size' => 'integer',
    ];

    /**
     * Relationships
     */

    // Unit this group belongs to
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // Members of this group
    public function members()
    {
        return $this->belongsToMany(User::class, 'group_members')
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    /**
     * Helper methods
     */

    // How many members are currently in the group
    public function currentSize(): int
    {
        return $this->members()->count();
    }

    // Whether the group has room for more members
    public function hasSpace(): bool
    {
        return $this->currentSize() < $this->max_size;
    }

    // Whether a user is already in this group
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    // Add a user to the group
    public function addMember(User $user): void
    {
        $this->members()->attach($user->id, ['joined_at' => now()]);
    }

    // Remove a user from the group
    public function removeMember(User $user): void
    {
        $this->members()->detach($user->id);
    }
}
