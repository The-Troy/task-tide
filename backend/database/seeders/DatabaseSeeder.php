<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders in order to maintain foreign key constraints
        $this->call([
            UserSeeder::class,                 // 1. Create users first (students, class reps, lecturers)
            CourseServerSeeder::class,         // 2. Create course servers (requires class reps)
            UnitSeeder::class,                 // 3. Create units (requires course servers)
            UserCourseServerSeeder::class,     // 4. Enroll students in course servers
            UserUnitSeeder::class,             // 5. Enroll students and lecturers in units
            DocumentSeeder::class,             // 6. Create documents (requires units and users)
            InvitationSeeder::class,           // 7. Create invitations (requires units and class reps)
            MessageSeeder::class,              // 8. Create messages (requires units and users)
        ]);

        $this->command->info('Database seeded successfully!');
    }
}
