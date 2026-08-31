<?php

use App\Models\Media;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->unsignedSmallInteger('width')->nullable()->after('size');
            $table->unsignedSmallInteger('height')->nullable()->after('width');
        });

        // Backfill existing rows reading each file's real dimensions, so the
        // public API can expose aspect ratios without a reseed.
        Media::withTrashed()->whereNull('width')->cursor()->each(function (Media $media) {
            try {
                $contents = Storage::disk($media->disk)->get($media->path);
            } catch (\Throwable) {
                return;
            }

            if ($contents === null) {
                return;
            }

            $size = @getimagesizefromstring($contents);
            if ($size === false) {
                return;
            }

            $media->forceFill(['width' => $size[0], 'height' => $size[1]])->saveQuietly();
        });
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropColumn(['width', 'height']);
        });
    }
};
