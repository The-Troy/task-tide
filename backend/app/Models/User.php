<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * Relationships
     */

    // Course servers created by this user (as class rep)
    public function createdCourseServers()
    {
        return $this->hasMany(CourseServer::class, 'class_rep_id');
    }

    // Course servers this user is a member of
    public function courseServers()
    {
        return $this->belongsToMany(CourseServer::class, 'user_course_servers')
            ->withPivot('joined_at');
    }

    // Units this user is enrolled in
    public function units()
    {
        return $this->belongsToMany(Unit::class, 'user_units')
            ->withPivot('role', 'joined_at');
    }

    // Units where user is a lecturer
    public function teachingUnits()
    {
        return $this->belongsToMany(Unit::class, 'user_units')
            ->wherePivot('role', 'lecturer')
            ->withPivot('role', 'joined_at');
    }

    // Units where user is a student
    public function studentUnits()
    {
        return $this->belongsToMany(Unit::class, 'user_units')
            ->wherePivot('role', 'student')
            ->withPivot('role', 'joined_at');
    }

    // Documents uploaded by this user
    public function documents()
    {
        return $this->hasMany(Document::class, 'uploaded_by');
    }

    // Messages sent by this user
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // Invitations sent by this user
    public function sentInvitations()
    {
        return $this->hasMany(Invitation::class, 'invited_by');
    }

    /**
     * Helper methods for role checking
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function isClassRep(): bool
    {
        return $this->role === 'class_rep';
    }

    public function isLecturer(): bool
    {
        return $this->role === 'lecturer';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
