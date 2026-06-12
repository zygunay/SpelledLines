<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderActionLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
public function store(Request $request)
{
    // 1. ADIM: HATA AYIKLAMA (Veriler geliyor mu?)
    // Eğer veriler boş geliyorsa bu satır çalışınca ekranda boş bir dizi veya eksik değerler görürsün.
    // dd($request->all()); 

    // 2. ADIM: VALIDASYON (Veritabanına boş veri gitmesini engeller)
    // Eğer formdan veri gelmezse hata fırlatıp kullanıcıyı durdurur.
    $request->validate([
        'first_name' => 'required',
        'last_name'  => 'required',
        'email'      => 'required|email',
        'material'   => 'required',
        'size'       => 'required',
        'subject'    => 'required',
        'details'    => 'required',
    ]);

    $user = Auth::check() ? Auth::user() : null;

    $phone = trim((string) $request->input('phone', ''));
    $phone = $phone !== '' ? $phone : null;

    if ($user && !empty($phone)) {
        $user->forceFill(['phone' => $phone])->save();
    }

    $offer = $request->input('offered_price');
    $budget = $request->input('budget');
    $selectedOffer = $offer !== null && trim((string) $offer) !== '' ? $offer : $budget;
    $normalizedOffer = $selectedOffer !== null && trim((string) $selectedOffer) !== '' ? (string) number_format((float) $selectedOffer, 2, '.', '') : null;

    $order = Order::create([
        'user_id'       => $user?->id,
        'first_name'    => $request->first_name, // EĞER BU NULL GELİYORSA HATA BURADADIR
        'last_name'     => $request->last_name,
        'email'         => $request->email,
        'phone'         => $phone,
        'material'      => $request->material,
        'size'          => $request->size,
        'offered_price' => $normalizedOffer,
        'subject'       => $request->subject,
        'details'       => $request->details,
        'status'        => 'Bekliyor',
    ]);

    if ($user) {
        OrderActionLog::create([
            'order_id'       => $order->id,
            'admin_name'     => $user->name,
            'customer_name'  => $order->first_name.' '.$order->last_name,
            'customer_email' => $order->email,
            'action'         => 'Talep Oluşturuldu',
            'details'        => 'Müşteri çizim talebi oluşturdu.',
        ]);
    }

    return redirect()->back()->with('success', 'Talebiniz başarıyla alındı!');
}

    public function update(Request $request, Order $order)
    {
        $oldStatus = $order->status;
        $oldAgreedPrice = $order->agreed_price;

        $order->update([
            'status' => $request->status,
            'agreed_price' => $request->input('agreed_price'),
            'updated_by' => Auth::user()->name,
        ]);

        $changes = [];
        if ($oldStatus !== $request->status) {
            $changes[] = "Durum: {$oldStatus} -> {$request->status}";
        }
        if ($oldAgreedPrice != $request->input('agreed_price')) {
            $changes[] = 'Net Fiyat Güncellendi';
        }

        OrderActionLog::create([
            'order_id' => $order->id,
            'admin_name' => Auth::user()->name,
            'customer_name' => $order->first_name.' '.$order->last_name,
            'customer_email' => $order->email,
            'action' => 'Talep Güncellendi',
            'details' => empty($changes) ? 'Talep güncellendi.' : implode(' | ', $changes),
        ]);

        return redirect()->back();
    }
}
