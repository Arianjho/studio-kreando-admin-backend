<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Responses\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Dokploy/Traefik termina TLS y reenvia al contenedor por HTTP plano.
        // Sin esto, Laravel genera URLs http:// detras del proxy (lee el
        // esquema de la conexion interna, no de X-Forwarded-Proto), lo que
        // el navegador bloquea como mixed-content en una pagina https.
        // '*' es seguro aqui: el contenedor solo recibe trafico del proxy
        // interno de Dokploy, no esta expuesto directo a internet.
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Todas las excepciones de la API publica (routes/api.php) se traducen
        // al contrato { success, message, data, errors, meta }. Las rutas del
        // admin (Inertia) no pasan por aqui: se ignoran devolviendo null.
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($e instanceof ValidationException) {
                return ApiResponse::validationError($e->errors());
            }

            if ($e instanceof AuthenticationException) {
                return ApiResponse::unauthorized();
            }

            if ($e instanceof AuthorizationException) {
                return ApiResponse::forbidden($e->getMessage() ?: 'No tiene permisos para esta accion');
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return ApiResponse::notFound();
            }

            if ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
                $message = $status === 429
                    ? 'Demasiadas solicitudes, intente nuevamente mas tarde'
                    : ($e->getMessage() ?: 'No se pudo procesar la solicitud');

                return ApiResponse::error($message, null, $status);
            }

            report($e);

            return ApiResponse::serverError();
        });
    })->create();
