<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courseServers = \App\Models\CourseServer::all();

        if ($courseServers->isEmpty()) {
            \Log::warning('No course servers found. Skipping UnitSeeder.');
            return;
        }

        // Units for Computer Science Year 3
        $csServer = $courseServers->where('code', 'CS2024Y3')->first();
        if ($csServer) {
            \App\Models\Unit::create([
                'course_server_id' => $csServer->id,
                'name' => 'Data Structures and Algorithms',
                'unit_code' => 'CS301',
                'description' => 'Advanced data structures, algorithm design and analysis',
                'credits' => 4,
            ]);

            \App\Models\Unit::create([
                'course_server_id' => $csServer->id,
                'name' => 'Database Management Systems',
                'unit_code' => 'CS302',
                'description' => 'Relational databases, SQL, normalization, and transactions',
                'credits' => 4,
            ]);

            \App\Models\Unit::create([
                'course_server_id' => $csServer->id,
                'name' => 'Operating Systems',
                'unit_code' => 'CS303',
                'description' => 'Process management, memory management, file systems',
                'credits' => 4,
            ]);

            \App\Models\Unit::create([
                'course_server_id' => $csServer->id,
                'name' => 'Software Engineering',
                'unit_code' => 'CS304',
                'description' => 'Software development lifecycle, design patterns, testing',
                'credits' => 3,
            ]);
        }

        // Units for Mathematics Year 2
        $mathServer = $courseServers->where('code', 'MATH24Y2')->first();
        if ($mathServer) {
            \App\Models\Unit::create([
                'course_server_id' => $mathServer->id,
                'name' => 'Linear Algebra',
                'unit_code' => 'MATH201',
                'description' => 'Vector spaces, matrices, eigenvalues and eigenvectors',
                'credits' => 4,
            ]);

            \App\Models\Unit::create([
                'course_server_id' => $mathServer->id,
                'name' => 'Calculus II',
                'unit_code' => 'MATH202',
                'description' => 'Multivariable calculus, integration techniques',
                'credits' => 4,
            ]);

            \App\Models\Unit::create([
                'course_server_id' => $mathServer->id,
                'name' => 'Probability and Statistics',
                'unit_code' => 'MATH203',
                'description' => 'Probability theory, statistical inference, hypothesis testing',
                'credits' => 3,
            ]);
        }

        // Units for Electrical Engineering Year 4
        $eeServer = $courseServers->where('code', 'EE2024Y4')->first();
        if ($eeServer) {
            \App\Models\Unit::create([
                'course_server_id' => $eeServer->id,
                'name' => 'Power Systems',
                'unit_code' => 'EE401',
                'description' => 'Power generation, transmission, and distribution',
                'credits' => 4,
            ]);

            \App\Models\Unit::create([
                'course_server_id' => $eeServer->id,
                'name' => 'Digital Signal Processing',
                'unit_code' => 'EE402',
                'description' => 'Discrete-time signals, Fourier transforms, filter design',
                'credits' => 4,
            ]);

            \App\Models\Unit::create([
                'course_server_id' => $eeServer->id,
                'name' => 'Control Systems',
                'unit_code' => 'EE403',
                'description' => 'System modeling, stability analysis, PID control',
                'credits' => 3,
            ]);
        }
    }
}
