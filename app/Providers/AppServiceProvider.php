<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // Sınıfı doğru şekilde içeri aktarıyoruz

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Sunucu ortamı production ise tüm linkleri HTTPS'e zorla
        if (app()->environment('production') || app()->environment('staging') || env('APP_ENV') === 'production') {
            URL::forceScheme('https');
        }
    }
}
