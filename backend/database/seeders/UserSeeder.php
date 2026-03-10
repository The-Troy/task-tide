<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test students
        \App\Models\User::create([
            'name' => 'John Doe',
            'email' => 'john.student@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        \App\Models\User::create([
            'name' => 'Jane Smith',
            'email' => 'jane.student@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        \App\Models\User::create([
            'name' => 'Bob Wilson',
            'email' => 'bob.student@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        // Create class representatives
        \App\Models\User::create([
            'name' => 'Alice Johnson',
            'email' => 'alice.classrep@example.com',
            'password' => bcrypt('password'),
            'role' => 'class_rep',
        ]);

        \App\Models\User::create([
            'name' => 'Mike Brown',
            'email' => 'mike.classrep@example.com',
            'password' => bcrypt('password'),
            'role' => 'class_rep',
        ]);

        // Create lecturers
        \App\Models\User::create([
            'name' => 'Dr. Sarah Williams',
            'email' => 'sarah.lecturer@example.com',
            'password' => bcrypt('password'),
            'role' => 'lecturer',
        ]);

        \App\Models\User::create([
            'name' => 'Prof. David Chen',
            'email' => 'david.lecturer@example.com',
            'password' => bcrypt('password'),
            'role' => 'lecturer',
        ]);

        \App\Models\User::create([
            'name' => 'Dr. Maria Garcia',
            'email' => 'maria.lecturer@example.com',
            'password' => bcrypt('password'),
            'role' => 'lecturer',
        ]);

        // Create additional students for testing
        for ($i = 1; $i <= 10; $i++) {
            \App\Models\User::create([
                'name' => "Student {$i}",
                'email' => "student{$i}@example.com",
                'password' => bcrypt('password'),
                'role' => 'student',
            ]);
        }
    }
}
