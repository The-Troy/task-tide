<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CourseServer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'class_rep_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relationships
     */

    // Class representative who created this server
    public function classRep()
    {
        return $this->belongsTo(User::class, 'class_rep_id');
    }

    // All members of this course server
    public function members()
    {
        return $this->belongsToMany(User::class, 'user_course_servers')
            ->withPivot('joined_at');
    }

    // Units under this course server
    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    /**
     * Helper methods
     */

    // Generate a unique join code
    public static function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (self::where('code', $code)->exists());

        return $code;
    }

    // Scope for active servers
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Check if user is a member
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    // Add a member to the server
    public function addMember(User $user): void
    {
        if (!$this->hasMember($user)) {
            $this->members()->attach($user->id, ['joined_at' => now()]);
        }
    }

    // Remove a member from the server
    public function removeMember(User $user): void
    {
        $this->members()->detach($user->id);
    }
}
