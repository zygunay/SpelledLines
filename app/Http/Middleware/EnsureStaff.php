<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureStaff
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isStaff()) {
            abort(403, 'Bu panele yalnızca yetkili personel erişebilir.');
        }

        return $next($request);
    }
}
