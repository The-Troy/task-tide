<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserCourseServerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = \App\Models\User::where('role', 'student')->get();
        $courseServers = \App\Models\CourseServer::where('is_active', true)->get();

        if ($students->isEmpty() || $courseServers->isEmpty()) {
            \Log::warning('No students or course servers found. Skipping UserCourseServerSeeder.');
            return;
        }

        // Enroll students in course servers
        foreach ($courseServers->take(3) as $courseServer) {
            // Enroll 5-10 random students per course server
            $numStudents = rand(5, min(10, $students->count()));
            $enrolledStudents = $students->random($numStudents);

            foreach ($enrolledStudents as $student) {
                \DB::table('user_course_servers')->insert([
                    'user_id' => $student->id,
                    'course_server_id' => $courseServer->id,
                    'joined_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}
