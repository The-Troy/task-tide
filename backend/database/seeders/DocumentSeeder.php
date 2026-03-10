<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = \App\Models\Unit::all();
        $students = \App\Models\User::where('role', 'student')->limit(5)->get();
        $lecturers = \App\Models\User::where('role', 'lecturer')->get();

        if ($units->isEmpty() || $students->isEmpty()) {
            \Log::warning('No units or students found. Skipping DocumentSeeder.');
            return;
        }

        // Create documents for the first few units
        foreach ($units->take(5) as $unit) {
            // Lecture notes uploaded by lecturer
            if ($lecturers->isNotEmpty()) {
                \App\Models\Document::create([
                    'unit_id' => $unit->id,
                    'uploaded_by' => $lecturers->random()->id,
                    'title' => "Week 1 Lecture Notes - {$unit->name}",
                    'document_type' => 'lecture_notes',
                    'file_path' => "documents/units/{$unit->id}/lecture_notes_week1.pdf",
                    'file_name' => 'lecture_notes_week1.pdf',
                    'file_size' => 2048576, // 2MB
                    'mime_type' => 'application/pdf',
                ]);

                \App\Models\Document::create([
                    'unit_id' => $unit->id,
                    'uploaded_by' => $lecturers->random()->id,
                    'title' => "Week 2 Lecture Notes - {$unit->name}",
                    'document_type' => 'lecture_notes',
                    'file_path' => "documents/units/{$unit->id}/lecture_notes_week2.pdf",
                    'file_name' => 'lecture_notes_week2.pdf',
                    'file_size' => 1856432,
                    'mime_type' => 'application/pdf',
                ]);

                \App\Models\Document::create([
                    'unit_id' => $unit->id,
                    'uploaded_by' => $lecturers->random()->id,
                    'title' => "Lecture Timetable - {$unit->name}",
                    'document_type' => 'lecture_timetable',
                    'file_path' => "documents/units/{$unit->id}/timetable.pdf",
                    'file_name' => 'timetable.pdf',
                    'file_size' => 524288,
                    'mime_type' => 'application/pdf',
                ]);
            }

            // Past papers and revision materials
            if ($students->isNotEmpty()) {
                \App\Models\Document::create([
                    'unit_id' => $unit->id,
                    'uploaded_by' => $students->random()->id,
                    'title' => "2023 Past Paper - {$unit->name}",
                    'document_type' => 'past_papers',
                    'file_path' => "documents/units/{$unit->id}/past_paper_2023.pdf",
                    'file_name' => 'past_paper_2023.pdf',
                    'file_size' => 1048576, // 1MB
                    'mime_type' => 'application/pdf',
                ]);

                \App\Models\Document::create([
                    'unit_id' => $unit->id,
                    'uploaded_by' => $students->random()->id,
                    'title' => "Revision Notes - {$unit->name}",
                    'document_type' => 'revision_materials',
                    'file_path' => "documents/units/{$unit->id}/revision_notes.pdf",
                    'file_name' => 'revision_notes.pdf',
                    'file_size' => 756234,
                    'mime_type' => 'application/pdf',
                ]);
            }
        }

        // Add exam timetable for one unit
        if ($units->isNotEmpty() && $lecturers->isNotEmpty()) {
            \App\Models\Document::create([
                'unit_id' => $units->first()->id,
                'uploaded_by' => $lecturers->first()->id,
                'title' => "Final Exam Timetable",
                'document_type' => 'exam_timetable',
                'file_path' => "documents/units/{$units->first()->id}/exam_timetable.pdf",
                'file_name' => 'exam_timetable.pdf',
                'file_size' => 327680,
                'mime_type' => 'application/pdf',
            ]);
        }
    }
}
