<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->text('whatsapp_message_template')->nullable()->after('default_seo_description');
        });

        DB::table('site_settings')->whereNull('whatsapp_message_template')->update([
            'whatsapp_message_template' => 'Hola {nombre}, te escribo de Studio Kreando por tu consulta sobre {tipo_proyecto}. ¿Tienes unos minutos para conversar?',
        ]);
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn('whatsapp_message_template');
        });
    }
};
