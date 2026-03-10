<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseServerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classReps = \App\Models\User::where('role', 'class_rep')->get();

        if ($classReps->isEmpty()) {
            \Log::warning('No class representatives found. Skipping CourseServerSeeder.');
            return;
        }

        // Create course servers for Computer Science
        \App\Models\CourseServer::create([
            'name' => 'Computer Science Year 3',
            'code' => 'CS2024Y3',
            'description' => 'Third year Computer Science course server for collaborative learning',
            'class_rep_id' => $classReps[0]->id,
            'is_active' => true,
        ]);

        // Create course servers for Mathematics
        \App\Models\CourseServer::create([
            'name' => 'Mathematics Year 2',
            'code' => 'MATH24Y2',
            'description' => 'Second year Mathematics course server',
            'class_rep_id' => $classReps->count() > 1 ? $classReps[1]->id : $classReps[0]->id,
            'is_active' => true,
        ]);

        // Create course servers for Engineering
        \App\Models\CourseServer::create([
            'name' => 'Electrical Engineering Year 4',
            'code' => 'EE2024Y4',
            'description' => 'Final year Electrical Engineering course server',
            'class_rep_id' => $classReps[0]->id,
            'is_active' => true,
        ]);

        // Create an inactive course server for testing
        \App\Models\CourseServer::create([
            'name' => 'Physics Year 1 (Archive)',
            'code' => 'PHY23Y1',
            'description' => 'Archived Physics course server from previous year',
            'class_rep_id' => $classReps[0]->id,
            'is_active' => false,
        ]);
    }
}
