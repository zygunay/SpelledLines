<?php

use App\Http\Controllers\CrmUserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MemberProfileController;
use App\Http\Controllers\OrderController;
use App\Models\ArtworkComment;
use App\Models\ArtworkLike;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

$welcomePage = function ($redirectToCrm = true) {
    if ($redirectToCrm && Auth::check() && Auth::user()->isStaff()) {
        return redirect()->route('crm.index');
    }

    $artworks = [
        ['id' => 1, 'title' => 'Pasha, Misha, Limon, Mia', 'category' => 'Illustration', 'tool' => 'CSP'],
        ['id' => 2, 'title' => 'Different eyes, same heart, one love.', 'category' => 'Portrait', 'tool' => 'CSP'],
        ['id' => 3, 'title' => 'Is what I see heavier, or the flowers I grow within?', 'category' => 'Surrealism', 'tool' => 'CSP'],
        ['id' => 4, 'title' => 'My little friends, a part of my life.', 'category' => 'Pet Portrait', 'tool' => 'CSP'],
        ['id' => 5, 'title' => 'A gothic watercolor vision of a decaying dragon...', 'category' => 'Dark Fantasy', 'tool' => 'CSP'],
        ['id' => 6, 'title' => 'Letting go is also a way of healing.', 'category' => 'Portrait', 'tool' => 'CSP'],
        ['id' => 7, 'title' => 'Some words remain unspoken; we quietly drift away...', 'category' => 'Still Life', 'tool' => 'CSP'],
        ['id' => 8, 'title' => 'Away from all the noise of the world.', 'category' => 'Sketch', 'tool' => 'CSP'],
    ];

    $artworkPayload = array_map(function ($artwork) {
        $likedByUser = Auth::check() && ArtworkLike::where('artwork_id', $artwork['id'])->where('user_id', Auth::id())->exists();
        $artwork['liked_by_user'] = $likedByUser;
        $artwork['likes_count'] = ArtworkLike::where('artwork_id', $artwork['id'])->count();
        $artwork['comments'] = ArtworkComment::where('artwork_id', $artwork['id'])
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->get(['id', 'comment', 'created_at', 'user_id'])
            ->map(fn ($comment) => [
                'id' => $comment->id,
                'comment' => $comment->comment,
                'created_at' => $comment->created_at->diffForHumans(),
                'user_name' => $comment->user?->name ?? 'Kullanıcı',
            ])->all();

        return $artwork;
    }, $artworks);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'status' => session('status'),
        'artworks' => $artworkPayload,
    ]);
};

Route::get('/', $welcomePage)->name('home');

Route::get('/home', function () use ($welcomePage) {
    return $welcomePage(false);
})->name('storefront');

Route::middleware('auth')->group(function () use ($welcomePage) {
    Route::post('/artworks/{artwork}/like', function ($artworkId) use ($welcomePage) {
        $user = Auth::user();

        $existing = ArtworkLike::where('artwork_id', $artworkId)->where('user_id', $user->id)->first();
        if ($existing) {
            $existing->delete();
        } else {
            ArtworkLike::create([
                'artwork_id' => $artworkId,
                'user_id' => $user->id,
            ]);
        }

        return $welcomePage();
    })->name('artworks.like');

    Route::post('/artworks/{artwork}/comment', function (Request $request, $artworkId) use ($welcomePage) {
        $request->validate([
            'comment' => ['required', 'string', 'max:500'],
        ]);

        ArtworkComment::create([
            'artwork_id' => $artworkId,
            'user_id' => Auth::id(),
            'comment' => trim($request->input('comment')),
        ]);

        return $welcomePage();
    })->name('artworks.comment');
});

Route::get('/dashboard', function () {
    if (Auth::user()->isStaff()) {
        return redirect()->route('crm.index');
    }

    return redirect()->route('home');
})->middleware('auth')->name('dashboard');

Route::get('/profilim', [MemberProfileController::class, 'index'])->middleware('auth')->name('member.profile');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth', 'staff'])->group(function () {
    Route::get('/crm', [CustomerController::class, 'index'])->name('crm.index');

    Route::put('/crm/orders/{order}', [OrderController::class, 'update'])->name('crm.orders.update');

    Route::put('/crm/members/{user}', [CustomerController::class, 'updateMember'])->name('crm.members.update');
    Route::delete('/crm/members/{user}', [CustomerController::class, 'destroyMember'])->name('crm.members.destroy');

    Route::get('/crm/users', [CrmUserController::class, 'index'])->name('crm.users.index');
    Route::post('/crm/users', [CrmUserController::class, 'store'])->name('crm.users.store');
    Route::put('/crm/users/{user}', [CrmUserController::class, 'update'])->name('crm.users.update');
    Route::delete('/crm/users/{user}', [CrmUserController::class, 'destroy'])->name('crm.users.destroy');

    Route::post('/crm/logout', function (Request $request) {
        UserLog::create([
            'user_name' => Auth::user()->name,
            'action'    => 'Çıkış Yaptı',
            'email'     => Auth::user()->email,
            'phone'     => Auth::user()->phone ?? '-',
            'title'     => Auth::user()->title ?? '-',
        ]);

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    })->name('crm.logout');
});
