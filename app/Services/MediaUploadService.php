<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;

/**
 * Punto unico para convertir un archivo subido en un registro Media,
 * usado por el admin de Multimedia y por los formularios de Proyectos/Home/About.
 */
class MediaUploadService
{
    public static function store(UploadedFile $file, string $alt, string $disk = 'r2'): Media
    {
        $path = $file->store('media', $disk);

        $dimensions = @getimagesize($file->getRealPath());

        return Media::create([
            'disk' => $disk,
            'path' => $path,
            'alt' => $alt,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $dimensions[0] ?? null,
            'height' => $dimensions[1] ?? null,
        ]);
    }
}
