<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = \App\Models\User::where('role', 'student')->get();
        $lecturers = \App\Models\User::where('role', 'lecturer')->get();
        $units = \App\Models\Unit::all();

        if ($units->isEmpty()) {
            \Log::warning('No units found. Skipping UserUnitSeeder.');
            return;
        }

        // Assign lecturers to units
        if ($lecturers->isNotEmpty()) {
            foreach ($units as $unit) {
                // Assign 1-2 lecturers per unit
                $numLecturers = rand(1, min(2, $lecturers->count()));
                $assignedLecturers = $lecturers->random($numLecturers);

                foreach ($assignedLecturers as $lecturer) {
                    \DB::table('user_units')->insert([
                        'user_id' => $lecturer->id,
                        'unit_id' => $unit->id,
                        'role' => 'lecturer',
                        'joined_at' => now()->subDays(rand(30, 60)),
                    ]);
                }
            }
        }

        // Enroll students in units
        if ($students->isNotEmpty()) {
            foreach ($units as $unit) {
                // Enroll 5-15 students per unit
                $numStudents = rand(5, min(15, $students->count()));
                $enrolledStudents = $students->random($numStudents);

                foreach ($enrolledStudents as $student) {
                    \DB::table('user_units')->insert([
                        'user_id' => $student->id,
                        'unit_id' => $unit->id,
                        'role' => 'student',
                        'joined_at' => now()->subDays(rand(1, 25)),
                    ]);
                }
            }
        }
    }
}
