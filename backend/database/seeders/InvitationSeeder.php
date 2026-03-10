<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InvitationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = \App\Models\Unit::all();
        $classReps = \App\Models\User::where('role', 'class_rep')->get();

        if ($units->isEmpty() || $classReps->isEmpty()) {
            \Log::warning('No units or class reps found. Skipping InvitationSeeder.');
            return;
        }

        // Create some pending invitations
        foreach ($units->take(3) as $unit) {
            \App\Models\Invitation::create([
                'unit_id' => $unit->id,
                'email' => 'newlecturer' . rand(1, 100) . '@example.com',
                'role' => 'lecturer',
                'token' => \Str::random(64),
                'invited_by' => $classReps->random()->id,
                'status' => 'pending',
                'expires_at' => now()->addDays(7),
            ]);
        }

        // Create an accepted invitation
        if ($units->count() > 0) {
            \App\Models\Invitation::create([
                'unit_id' => $units->first()->id,
                'email' => 'accepted.lecturer@example.com',
                'role' => 'lecturer',
                'token' => \Str::random(64),
                'invited_by' => $classReps->first()->id,
                'status' => 'accepted',
                'expires_at' => now()->addDays(7),
            ]);
        }

        // Create an expired invitation
        if ($units->count() > 1) {
            \App\Models\Invitation::create([
                'unit_id' => $units->skip(1)->first()->id,
                'email' => 'expired.invitation@example.com',
                'role' => 'lecturer',
                'token' => \Str::random(64),
                'invited_by' => $classReps->first()->id,
                'status' => 'expired',
                'expires_at' => now()->subDays(3),
            ]);
        }
    }
}
