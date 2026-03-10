<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_server_id',
        'name',
        'unit_code',
        'description',
        'credits',
    ];

    protected $casts = [
        'credits' => 'integer',
    ];

    /**
     * Relationships
     */

    // Course server this unit belongs to
    public function courseServer()
    {
        return $this->belongsTo(CourseServer::class);
    }

    // All users enrolled in this unit
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_units')
            ->withPivot('role', 'joined_at');
    }

    // Students in this unit
    public function students()
    {
        return $this->belongsToMany(User::class, 'user_units')
            ->wherePivot('role', 'student')
            ->withPivot('role', 'joined_at');
    }

    // Lecturers for this unit
    public function lecturers()
    {
        return $this->belongsToMany(User::class, 'user_units')
            ->wherePivot('role', 'lecturer')
            ->withPivot('role', 'joined_at');
    }

    // Documents in this unit
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // Messages in this unit (chat)
    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    // Invitations for this unit
    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    // Assignment groups for this unit
    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    /**
     * Helper methods
     */

    // Check if user is enrolled
    public function hasUser(User $user): bool
    {
        return $this->users()->where('user_id', $user->id)->exists();
    }

    // Enroll a user in the unit
    public function enrollUser(User $user, string $role = 'student'): void
    {
        if (!$this->hasUser($user)) {
            $this->users()->attach($user->id, [
                'role' => $role,
                'joined_at' => now()
            ]);
        }
    }

    // Remove a user from the unit
    public function removeUser(User $user): void
    {
        $this->users()->detach($user->id);
    }

    // Check if user is a lecturer
    public function isLecturer(User $user): bool
    {
        return $this->lecturers()->where('user_id', $user->id)->exists();
    }

    // Get documents by type
    public function documentsByType(string $type)
    {
        return $this->documents()->where('document_type', $type)->get();
    }
}
