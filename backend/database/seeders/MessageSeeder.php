<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = \App\Models\Unit::all();

        if ($units->isEmpty()) {
            \Log::warning('No units found. Skipping MessageSeeder.');
            return;
        }

        // Get users for each unit
        foreach ($units->take(3) as $unit) {
            // Get users enrolled in this unit
            $userUnits = \DB::table('user_units')
                ->where('unit_id', $unit->id)
                ->pluck('user_id');

            $users = \App\Models\User::whereIn('id', $userUnits)->get();

            if ($users->isEmpty()) {
                continue;
            }

            // Create sample conversation in each unit
            $messages = [
                "Hi everyone! Welcome to {$unit->name}",
                "Looking forward to this course!",
                "When is the first lecture?",
                "Has anyone completed the first assignment?",
                "I found a great resource for this topic, should I share it?",
                "Yes please! That would be helpful.",
                "Can someone explain the concept from yesterday's lecture?",
                "Sure, which part are you confused about?",
                "Thanks for all the help everyone!",
            ];

            foreach ($messages as $index => $content) {
                \App\Models\Message::create([
                    'unit_id' => $unit->id,
                    'user_id' => $users->random()->id,
                    'message' => $content,
                    'created_at' => now()->subDays(5)->addHours($index),
                    'updated_at' => now()->subDays(5)->addHours($index),
                ]);
            }
        }
    }
}
