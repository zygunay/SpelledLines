<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserActionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CrmUserController extends Controller
{
    public function index()
    {
        return redirect()->route('crm.index');
    }

    public function store(Request $request)
    {
        if (!Auth::user()->isSystemAdmin()) {
            abort(403, 'Sisteme yeni personel ekleme yetkiniz yok.');
        }

        if ($request->title === 'Sistem Yöneticisi') {
            abort(403, 'Güvenlik kısıtlaması: Yeni bir Sistem Yöneticisi eklenemez.');
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'nullable|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:6',
            'title'      => 'required|string',
            'phone'      => 'nullable|string|max:20',
        ]);

        $firstName = $request->input('first_name');
        $lastName = $request->input('last_name', '');

        $baseUsername = Str::slug(Str::before($request->email, '@'));
        $username = $baseUsername;
        $counter = 1;
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername.$counter++;
        }

        $newUser = User::create([
            'first_name' => $firstName,
            'last_name'  => $lastName,
            'username'   => $username,
            'email'      => $request->email,
            'phone'      => $request->input('phone'),
            'password'   => Hash::make($request->password),
            'title'      => $request->title,
            'added_by'   => Auth::user()->name,
            'email_verified_at' => now(),
        ]);

        UserActionLog::create([
            'admin_name'   => Auth::user()->name,
            'target_name'  => $newUser->name,
            'target_email' => $newUser->email,
            'target_title' => $newUser->title,
            'action'       => 'Sisteme Eklendi',
            'reason'       => 'Yeni personel kaydı oluşturuldu.',
        ]);

        return redirect()->back();
    }

    public function update(Request $request, User $user)
    {
        if (!Auth::user()->isSystemAdmin()) {
            abort(403, 'Yetki değiştirme izniniz yok.');
        }

        if ($user->isSystemAdmin() || $request->title === 'Sistem Yöneticisi') {
            abort(403, 'Yöneticiler üzerinde işlem yapılamaz veya bu rol atanamaz.');
        }

        $request->validate([
            'title'  => 'required|string',
            'reason' => 'nullable|string',
        ]);

        $oldTitle = $user->title;

        $user->update([
            'title'      => $request->title,
            'updated_by' => Auth::user()->name,
        ]);

        UserActionLog::create([
            'admin_name'   => Auth::user()->name,
            'target_name'  => $user->name,
            'target_email' => $user->email,
            'target_title' => $oldTitle,
            'action'       => "Yetki Değiştirildi ({$oldTitle} -> {$request->title})",
            'reason'       => $request->reason,
        ]);

        return redirect()->back();
    }

    public function destroy(Request $request, User $user)
    {
        if (!Auth::user()->isSystemAdmin()) {
            abort(403, 'Silme yetkiniz yok.');
        }

        if ($user->isSystemAdmin()) {
            abort(403, 'Sistem Yöneticileri sistemden silinemez.');
        }

        $targetName  = $user->name;
        $targetEmail = $user->email;
        $targetTitle = $user->title;

        $user->delete();

        UserActionLog::create([
            'admin_name'   => Auth::user()->name,
            'target_name'  => $targetName,
            'target_email' => $targetEmail,
            'target_title' => $targetTitle,
            'action'       => 'Sistemden Silindi',
            'reason'       => $request->input('reason'),
        ]);

        return redirect()->back();
    }
}
