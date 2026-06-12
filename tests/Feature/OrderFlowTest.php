<?php

use App\Models\ArtworkComment;
use App\Models\ArtworkLike;
use App\Models\Order;
use App\Models\OrderActionLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

it('stores the offer price and updates the authenticated user phone when a commission is requested', function () {
    $user = User::factory()->create([
        'phone' => null,
    ]);

    $this->actingAs($user);

    $response = $this->post(route('orders.store'), [
        'first_name' => 'Ali',
        'last_name' => 'Veli',
        'email' => 'ali@example.com',
        'phone' => '05554443322',
        'material' => 'Dijital İllüstrasyon (CSP)',
        'size' => '1080x1080 (Dijital Kare)',
        'budget' => '1500',
        'offered_price' => '',
        'subject' => 'Test subject',
        'details' => 'Test details',
    ]);

    $response->assertRedirect();

    $order = Order::latest()->first();

    expect($order)->not->toBeNull()
        ->and((string) $order->offered_price)->toBe('1500')
        ->and($user->fresh()->phone)->toBe('05554443322');
});

it('stores staff first and last names separately when creating a new staff member', function () {
    $admin = User::factory()->create([
        'title' => 'Sistem Yöneticisi',
    ]);

    $this->actingAs($admin);

    $response = $this->post(route('crm.users.store'), [
        'first_name' => 'Ali',
        'last_name' => 'Kaya',
        'email' => 'ali.kaya@example.com',
        'password' => 'secret123',
        'title' => 'Satış Müdürü',
        'phone' => '05554443322',
    ]);

    $response->assertRedirect();

    $staff = User::where('email', 'ali.kaya@example.com')->first();

    expect($staff)->not->toBeNull()
        ->and($staff->first_name)->toBe('Ali')
        ->and($staff->last_name)->toBe('Kaya')
        ->and($staff->phone)->toBe('05554443322');
});

it('allows staff users to open the public storefront route from the crm', function () {
    $admin = User::factory()->create([
        'title' => 'Sistem Yöneticisi',
    ]);

    $this->actingAs($admin);

    $response = $this->get(route('storefront'));

    $response->assertOk();
});

it('persists artwork likes and comments for the homepage', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $likeResponse = $this->post(route('artworks.like', 1));
    $likeResponse->assertOk();

    $commentResponse = $this->post(route('artworks.comment', 1), [
        'comment' => 'Harika bir eser!',
    ]);
    $commentResponse->assertOk();

    expect(ArtworkLike::where('artwork_id', 1)->where('user_id', $user->id)->exists())->toBeTrue()
        ->and(ArtworkComment::where('artwork_id', 1)->where('user_id', $user->id)->where('comment', 'Harika bir eser!')->exists())->toBeTrue();
});

it('creates an order activity log when an order is updated', function () {
    $admin = User::factory()->create([
        'title' => 'Sistem Yöneticisi',
    ]);

    $order = Order::create([
        'first_name' => 'Ayşe',
        'last_name' => 'Demir',
        'email' => 'ayse@example.com',
        'phone' => '05554443322',
        'material' => 'Dijital İllüstrasyon (CSP)',
        'size' => '1080x1080 (Dijital Kare)',
        'subject' => 'Test',
        'details' => 'Test',
        'status' => 'Bekliyor',
        'offered_price' => '1000.00',
    ]);

    $this->actingAs($admin);

    $response = $this->put(route('crm.orders.update', $order), [
        'status' => 'Onaylandı',
        'agreed_price' => '1800',
    ]);

    $response->assertRedirect();

    $log = OrderActionLog::latest()->first();

    expect($log)->not->toBeNull()
        ->and($log->action)->toContain('Güncellendi');
});

it('returns database-backed members and orders to the crm page', function () {
    $admin = User::factory()->create([
        'title' => 'Sistem Yöneticisi',
        'first_name' => 'Ada',
        'last_name' => 'Lovelace',
    ]);

    $member = User::factory()->create([
        'title' => 'user',
        'first_name' => 'Zeynep',
        'last_name' => 'Yılmaz',
        'email' => 'zeynep@example.com',
    ]);

    Order::create([
        'user_id' => $member->id,
        'first_name' => 'Zeynep',
        'last_name' => 'Yılmaz',
        'email' => 'zeynep@example.com',
        'phone' => '05551234567',
        'material' => 'Dijital İllüstrasyon (CSP)',
        'size' => '1080x1080 (Dijital Kare)',
        'subject' => 'CRM verisi testi',
        'details' => 'Detaylar',
        'status' => 'Bekliyor',
        'offered_price' => '1200.00',
    ]);

    $this->actingAs($admin);

    $response = $this->get(route('crm.index'));

    $response->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('CrmApp')
            ->has('customers', 1)
            ->has('orders', 1)
            ->where('orders.0.subject', 'CRM verisi testi')
            ->where('customers.0.email', 'zeynep@example.com')
        );
});

it('returns the authenticated user orders on the member profile page', function () {
    $member = User::factory()->create([
        'title' => 'user',
        'first_name' => 'Mert',
        'last_name' => 'Kara',
        'email' => 'mert@example.com',
    ]);

    Order::create([
        'user_id' => $member->id,
        'first_name' => 'Mert',
        'last_name' => 'Kara',
        'email' => 'mert@example.com',
        'phone' => '05559876543',
        'material' => 'Dijital İllüstrasyon (CSP)',
        'size' => '1080x1080 (Dijital Kare)',
        'subject' => 'Profil testi',
        'details' => 'Profil detayı',
        'status' => 'Bekliyor',
        'offered_price' => '900.00',
    ]);

    $this->actingAs($member);

    $response = $this->get(route('member.profile'));

    $response->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('member/Profile')
            ->has('orders', 1)
            ->where('orders.0.subject', 'Profil testi')
            ->where('user.email', 'mert@example.com')
        );
});
