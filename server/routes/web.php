<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Ruta para limpiar todo el cache de Laravel
Route::get('/refresh', function () {
    try {
        $output = [];
        
        // Limpiar cache de configuración
        Artisan::call('config:clear');
        $output[] = 'Config cache cleared: ' . Artisan::output();
        
        // Limpiar cache de rutas
        Artisan::call('route:clear');
        $output[] = 'Route cache cleared: ' . Artisan::output();
        
        // Limpiar cache de vistas
        Artisan::call('view:clear');
        $output[] = 'View cache cleared: ' . Artisan::output();
        
        // Limpiar cache de eventos
        Artisan::call('event:clear');
        $output[] = 'Event cache cleared: ' . Artisan::output();
        
        // Intentar limpiar cache de aplicación (puede fallar si hay problemas de DB)
        try {
            Artisan::call('cache:clear');
            $output[] = 'Application cache cleared: ' . Artisan::output();
        } catch (\Exception $e) {
            $output[] = 'Application cache clear failed: ' . $e->getMessage();
        }
        
        // Recrear cache de configuración
        Artisan::call('config:cache');
        $output[] = 'Config cache recreated: ' . Artisan::output();
        
        // Optimizar autoload
        Artisan::call('optimize');
        $output[] = 'Application optimized: ' . Artisan::output();
        
        return response()->json([
            'status' => 'success',
            'message' => 'All caches cleared successfully!',
            'details' => $output
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Error clearing caches: ' . $e->getMessage()
        ], 500);
    }
});

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

