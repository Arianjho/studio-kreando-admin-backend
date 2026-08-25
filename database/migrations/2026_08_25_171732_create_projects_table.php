<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('year');
            $table->string('location');
            $table->string('area');
            $table->string('program');
            $table->string('team');
            $table->enum('status', ['Construido', 'En obra', 'En proyecto']);
            $table->text('intro');
            $table->longText('body');
            $table->foreignId('cover_id')->constrained('media')->restrictOnDelete();
            $table->string('cover_alt');
            $table->json('gallery')->nullable();
            $table->boolean('featured')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
