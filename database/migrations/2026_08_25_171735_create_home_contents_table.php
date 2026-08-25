<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_contents', function (Blueprint $table) {
            $table->id();
            $table->string('hero_headline');
            $table->text('hero_subtext');
            $table->foreignId('hero_image_id')->constrained('media')->restrictOnDelete();
            $table->string('hero_cta_primary_label');
            $table->string('hero_cta_secondary_label');
            $table->string('about_heading');
            $table->text('about_text');
            $table->string('about_cta_label');
            $table->json('stats');
            $table->json('services');
            $table->json('credits')->nullable();
            $table->string('portfolio_heading');
            $table->text('portfolio_text');
            $table->string('cta_heading');
            $table->text('cta_text');
            $table->string('cta_button_label');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_contents');
    }
};
