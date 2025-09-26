<?php

use Illuminate\Support\Facades\Route;

// Servir archivos estáticos de React (CSS, JS, imágenes)
Route::get('/app/assets/{path}', function ($path) {
    $file = public_path("app/assets/{$path}");
    if (file_exists($file)) {
        return response()->file($file);
    }
    abort(404);
})->where('path', '.*');

// Rutas de API (si las tienes)
// Route::prefix('api')->group(function () {
//     // Tus rutas de API aquí
// });

// Catch-all: todas las demás rutas devuelven el index.html de React
// Esto permite que React Router maneje la navegación del lado del cliente
Route::get('/{path?}', function () {
    return file_get_contents(public_path('app/index.html'));
})->where('path', '.*');

