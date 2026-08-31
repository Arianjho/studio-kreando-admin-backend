<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_form_options', function (Blueprint $table) {
            $table->id();
            $table->string('group')->index();
            $table->string('label');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // Defaults are materialised by ContentSeeder and, for an already-seeded
        // dev database, lazily on the first visit to the admin options page
        // (ContactFormOptionController@index). Seeding here would leak rows into
        // every RefreshDatabase test.
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_form_options');
    }
};
