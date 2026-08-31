<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            $table->string('phone', 9)->nullable()->after('name');
            $table->timestamp('responded_at')->nullable()->after('read');
        });

        // Existing dev rows predate the phone field; leave them blank rather
        // than inventing a number. New submissions require it (FormRequest).
        DB::table('consultas')->whereNull('phone')->update(['phone' => '']);

        Schema::table('consultas', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }

    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            $table->string('email')->nullable()->after('name');
            $table->dropColumn(['phone', 'responded_at']);
        });
    }
};
