<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderActionLog;
use App\Models\User;
use App\Models\UserActionLog;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $hasLog = UserLog::where('user_name', Auth::user()->name)
            ->where('action', 'Giriş Yaptı')
            ->where('created_at', '>', now()->subMinutes(5))
            ->exists();

        if (!$hasLog) {
            UserLog::create([
                'user_name' => Auth::user()->name,
                'email'     => Auth::user()->email,
                'phone'     => Auth::user()->phone ?? '-',
                'title'     => Auth::user()->title ?? '-',
                'action'    => 'Giriş Yaptı',
            ]);
        }

        $customers = User::members()->latest()->get()->map(fn ($user) => [
            'id'         => $user->id,
            'name'       => $user->name,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'email'      => $user->email,
            'phone'      => $user->phone ?? '-',
            'created_at' => $user->created_at,
            'date'       => $user->created_at->format('d.m.Y'),
            'time'       => $user->created_at->format('H:i'),
        ]);

        $systemUsers = User::staff()->latest()->get()->map(fn ($user) => [
            'id'           => $user->id,
            'name'         => $user->name,
            'first_name'   => $user->first_name,
            'last_name'    => $user->last_name,
            'email'        => $user->email,
            'title'        => $user->title ?? 'Belirtilmedi',
            'added_by'     => $user->added_by ?? 'Sistem (Kayıt)',
            'updated_by'   => $user->updated_by,
            'date'         => $user->created_at->format('d.m.Y'),
            'time'         => $user->created_at->format('H:i'),
            'updated_date' => $user->updated_at->format('d.m.Y'),
            'updated_time' => $user->updated_at->format('H:i'),
        ]);

        $userActionLogs = UserActionLog::latest()->get()->map(fn ($log) => [
            'id'           => $log->id,
            'admin_name'   => $log->admin_name,
            'target_name'  => $log->target_name,
            'target_email' => $log->target_email ?? 'E-Posta Bulunamadı',
            'target_title' => $log->target_title ?? 'Belirtilmemiş',
            'action'       => $log->action,
            'reason'       => $log->reason ?? 'Neden belirtilmedi.',
            'datetime'     => $log->created_at->format('d.m.Y - H:i'),
        ]);

        $userLogs = UserLog::latest()->get()->map(fn ($log) => [
            'id'        => $log->id,
            'user_name' => $log->user_name,
            'action'    => $log->action,
            'email'     => $log->email ?? 'Belirtilmedi',
            'phone'     => $log->phone ?? '-',
            'title'     => $log->title ?? 'Personel',
            'datetime'  => $log->created_at->format('d.m.Y - H:i'),
        ]);

        $orders = Order::latest()->get()->map(function ($order) {
            return [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'first_name' => $order->first_name,
                'last_name' => $order->last_name,
                'email' => $order->email,
                'phone' => $order->phone,
                'material' => $order->material,
                'size' => $order->size,
                'subject' => $order->subject,
                'details' => $order->details,
                'status' => $order->status,
                'offered_price' => $order->offered_price,
                'agreed_price' => $order->agreed_price,
                'updated_by' => $order->updated_by,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ];
        });
        $orderActionLogs = OrderActionLog::latest()->get()->map(fn ($log) => [
            'id' => $log->id,
            'order_id' => $log->order_id,
            'admin_name' => $log->admin_name,
            'customer_name' => $log->customer_name,
            'customer_email' => $log->customer_email,
            'action' => $log->action,
            'details' => $log->details,
            'datetime' => $log->created_at->format('d.m.Y - H:i'),
        ]);

        $metrics = [
            'pending_count'   => Order::where('status', 'Bekliyor')->count(),
            'approved_count'  => Order::where('status', 'Onaylandı')->count(),
            'total_members'   => $customers->count(),
            'monthly_revenue' => Order::where('status', 'Onaylandı')
                ->whereMonth('created_at', now()->month)
                ->sum('agreed_price') ?? 0,
        ];

        return Inertia::render('CrmApp', [
            'customers'      => $customers,
            'orders'         => $orders,
            'metrics'        => $metrics,
            'systemUsers'    => $systemUsers,
            'userActionLogs' => $userActionLogs,
            'orderActionLogs' => $orderActionLogs,
            'userLogs'       => $userLogs,
            'authUser'       => [
                'userName'  => Auth::user()->name,
                'userEmail' => Auth::user()->email,
                'userPhone' => Auth::user()->phone ?? 'Telefon Bulunamadı',
                'userTitle' => Auth::user()->title ?? 'Personel',
            ],
        ]);
    }

    public function updateMember(Request $request, User $user)
    {
        if ($user->title !== User::MEMBER_TITLE) {
            abort(403, 'Yalnızca topluluk üyeleri düzenlenebilir.');
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email,'.$user->id,
            'phone'      => 'nullable|string|max:20',
        ]);

        $user->update([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'phone'      => $request->phone,
            'updated_by' => Auth::user()->name,
        ]);

        return redirect()->back();
    }

    public function destroyMember(User $user)
    {
        if ($user->title !== User::MEMBER_TITLE) {
            abort(403, 'Yalnızca topluluk üyeleri silinebilir.');
        }

        $user->delete();

        return redirect()->back();
    }
}
