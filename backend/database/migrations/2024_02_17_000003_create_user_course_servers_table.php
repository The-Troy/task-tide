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
        Schema::create('user_course_servers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_server_id')->constrained()->onDelete('cascade');
            $table->timestamp('joined_at')->useCurrent();
            
            // Unique constraint to prevent duplicate enrollments
            $table->unique(['user_id', 'course_server_id']);
            
            $table->index('user_id');
            $table->index('course_server_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_course_servers');
    }
};
