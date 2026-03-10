<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained()->onDelete('cascade');
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->enum('document_type', [
                'lecture_notes',
                'past_papers',
                'revision_materials',
                'exam_timetable',
                'lecture_timetable',
                'other'
            ]);
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size'); // in bytes
            $table->string('mime_type', 100);
            $table->timestamps();
            $table->softDeletes(); // Allow soft deletes

            $table->index('unit_id');
            $table->index('uploaded_by');
            $table->index('document_type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
