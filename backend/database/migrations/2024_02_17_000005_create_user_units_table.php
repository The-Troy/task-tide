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
        Schema::create('user_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('unit_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['student', 'lecturer'])->default('student');
            $table->timestamp('joined_at')->useCurrent();
            
            // Unique constraint to prevent duplicate enrollments
            $table->unique(['user_id', 'unit_id']);
            
            $table->index('user_id');
            $table->index('unit_id');
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_units');
    }
};
