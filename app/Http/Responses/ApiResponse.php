<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

/**
 * Envelope unico para todas las respuestas de la API publica (routes/api.php).
 * Nunca construir el JSON a mano en un controlador: usar estos helpers.
 */
class ApiResponse
{
    public static function success(mixed $data = null, string $message = 'Operacion exitosa', ?array $meta = null, int $status = 200): JsonResponse
    {
        return self::build(true, $message, $data, null, $meta, $status);
    }

    public static function created(mixed $data = null, string $message = 'Recurso creado correctamente'): JsonResponse
    {
        return self::build(true, $message, $data, null, null, 201);
    }

    public static function noContent(string $message = 'Operacion exitosa'): JsonResponse
    {
        return self::build(true, $message, null, null, null, 200);
    }

    public static function error(string $message, mixed $errors = null, int $status = 400): JsonResponse
    {
        return self::build(false, $message, null, $errors, null, $status);
    }

    public static function validationError(array $errors, string $message = 'Los datos enviados no son validos'): JsonResponse
    {
        return self::build(false, $message, null, $errors, null, 422);
    }

    public static function unauthorized(string $message = 'No autenticado'): JsonResponse
    {
        return self::build(false, $message, null, null, null, 401);
    }

    public static function forbidden(string $message = 'No tiene permisos para esta accion'): JsonResponse
    {
        return self::build(false, $message, null, null, null, 403);
    }

    public static function notFound(string $message = 'Recurso no encontrado'): JsonResponse
    {
        return self::build(false, $message, null, null, null, 404);
    }

    public static function conflict(string $message = 'Conflicto con el estado actual del recurso'): JsonResponse
    {
        return self::build(false, $message, null, null, null, 409);
    }

    public static function tooManyRequests(string $message = 'Demasiadas solicitudes, intente nuevamente mas tarde'): JsonResponse
    {
        return self::build(false, $message, null, null, null, 429);
    }

    public static function serverError(string $message = 'Ocurrio un error interno, intente nuevamente mas tarde'): JsonResponse
    {
        return self::build(false, $message, null, null, null, 500);
    }

    protected static function build(bool $success, string $message, mixed $data, mixed $errors, ?array $meta, int $status): JsonResponse
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'errors' => $errors,
            'meta' => $meta,
        ], $status);
    }
}
