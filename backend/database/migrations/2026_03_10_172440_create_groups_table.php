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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();

            // The unit this group belongs to
            $table->foreignId('unit_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');

            // Max number of students allowed in this group
            $table->unsignedTinyInteger('max_size');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
