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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_server_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., "Vector Analysis"
            $table->string('unit_code', 20); // e.g., "MATH301"
            $table->text('description')->nullable();
            $table->integer('credits')->nullable();
            $table->timestamps();

            $table->index('course_server_id');
            $table->index('unit_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
