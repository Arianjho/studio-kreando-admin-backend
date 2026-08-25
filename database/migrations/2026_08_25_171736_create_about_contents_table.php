<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hero_image_id')->constrained('media')->restrictOnDelete();
            $table->string('hero_headline');
            $table->text('hero_subtext');
            $table->json('intro_paragraphs');
            $table->json('services');
            $table->json('milestones');
            $table->foreignId('detail_image_id')->constrained('media')->restrictOnDelete();
            $table->string('cta_label');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_contents');
    }
};
