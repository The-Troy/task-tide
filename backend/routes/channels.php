<?php

use App\Models\Unit;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

/**
 * Presence channel for a unit's chat room.
 * Only enrolled users (students, lecturers) can join.
 *
 * Channel name: unit.{unitId}
 * Returns user data to presence channel member list.
 */
Broadcast::channel('unit.{unitId}', function ($user, int $unitId) {
    $unit = Unit::find($unitId);

    if (!$unit || !$unit->hasUser($user)) {
        return false;
    }

    // Return user info that will be visible to other presence channel members
    return [
        'id'   => $user->id,
        'name' => $user->name,
        'role' => $user->role,
    ];
});
