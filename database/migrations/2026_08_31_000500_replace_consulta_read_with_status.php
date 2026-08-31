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
            $table->string('status')->default('nuevo')->after('message');
            $table->timestamp('closed_at')->nullable()->after('responded_at');
        });

        // Una consulta ya "respondida" pasa a "contactado"; el resto queda "nuevo".
        DB::table('consultas')->whereNotNull('responded_at')->update(['status' => 'contactado']);

        Schema::table('consultas', function (Blueprint $table) {
            $table->dropColumn('read');
        });
    }

    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            $table->boolean('read')->default(false)->after('message');
        });

        DB::table('consultas')->where('status', '!=', 'nuevo')->update(['read' => true]);

        Schema::table('consultas', function (Blueprint $table) {
            $table->dropColumn(['status', 'closed_at']);
        });
    }
};
