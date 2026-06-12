<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MemberProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'subject' => $order->subject,
                    'details' => $order->details,
                    'status' => $order->status,
                    'offered_price' => $order->offered_price,
                    'agreed_price' => $order->agreed_price,
                    'created_at' => $order->created_at->format('d.m.Y H:i'),
                    'updated_at' => $order->updated_at->format('d.m.Y H:i'),
                ];
            });

        return Inertia::render('member/Profile', [
            'user' => [
                'name' => $user->name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'title' => $user->title,
            ],
            'orders' => $orders,
        ]);
    }
}
