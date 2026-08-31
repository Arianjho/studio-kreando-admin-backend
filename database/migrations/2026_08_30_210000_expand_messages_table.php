<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('project_type')->nullable()->after('email');
            $table->string('intervention')->nullable()->after('project_type');
            $table->string('location')->nullable()->after('intervention');
            $table->json('services')->nullable()->after('location');
            $table->string('budget')->nullable()->after('services');
            $table->string('timeline')->nullable()->after('budget');
        });

        // Existing rows predate the structured fields; give them a neutral type
        // so the admin list has something to show, then retire `subject`.
        DB::table('messages')->whereNull('project_type')->update(['project_type' => 'Otro']);

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('subject');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('subject')->default('')->after('email');
            $table->dropColumn(['project_type', 'intervention', 'location', 'services', 'budget', 'timeline']);
        });
    }
};
