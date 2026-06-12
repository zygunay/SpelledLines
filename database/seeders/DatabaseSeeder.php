<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF');
        Order::truncate();
        User::truncate();
        Customer::truncate();
        DB::statement('PRAGMA foreign_keys = ON');

        $users = [
            ['first_name' => 'Zeynepnur', 'last_name' => 'Günay', 'username' => 'zeynepnur', 'email' => 'zeynurgunay@gmail.com', 'phone' => '05425215789', 'title' => 'Sistem Yöneticisi'],
            ['first_name' => 'Fatma', 'last_name' => 'Erbek', 'username' => 'pakuga', 'email' => 'pakuga@gmail.com', 'phone' => '04534515789', 'title' => 'Sistem Yöneticisi'],
            ['first_name' => 'Serap', 'last_name' => 'Pala', 'username' => 'serappala', 'email' => 'serappala@gmail.com', 'phone' => '05547859687', 'title' => 'Sistem Yöneticisi'],
            ['first_name' => 'Tahsin', 'last_name' => 'Altın', 'username' => 'tahsinaltin', 'email' => 'altintahsin@gmail.com', 'phone' => '03657895487', 'title' => 'Sistem Yöneticisi'],
            ['first_name' => 'İlknur', 'last_name' => 'Yılmaz', 'username' => 'ilknur', 'email' => 'ilknur@spelledlines.com', 'phone' => '05551234567', 'title' => 'Operasyon Sorumlusu'],
            ['first_name' => 'Elif', 'last_name' => 'Demir', 'username' => 'elifdemir', 'email' => 'elif.demir@example.com', 'phone' => '05331234567', 'title' => 'Müşteri Destek'],
            ['first_name' => 'Deniz', 'last_name' => 'Arslan', 'username' => 'denizarslan', 'email' => 'deniz.arslan@example.com', 'phone' => '05351234567', 'title' => 'user'],
            ['first_name' => 'Ayşe', 'last_name' => 'Topçu', 'username' => 'aysetopcu', 'email' => 'ayse.topcu@example.com', 'phone' => '05361234567', 'title' => 'user'],
            ['first_name' => 'Burak', 'last_name' => 'Çetin', 'username' => 'burakcetin', 'email' => 'burak.cetin@example.com', 'phone' => '05371234567', 'title' => 'user'],
            ['first_name' => 'Seda', 'last_name' => 'Polat', 'username' => 'sedapolat', 'email' => 'seda.polat@example.com', 'phone' => '05381234567', 'title' => 'user'],
        ];

        foreach ($users as $userData) {
            User::create([
                ...$userData,
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
                'added_by' => 'Sistem',
                'updated_by' => 'Sistem',
            ]);
        }

        // Veritabanına gerçekten yazılan kullanıcıların ID listesini dinamik olarak çekiyoruz
        $userIds = User::pluck('id')->toArray();

        $customers = [
            ['first_name' => 'Ahmet', 'last_name' => 'Yılmaz', 'email' => 'ahmet.yilmaz@example.com', 'phone' => '05551230001'],
            ['first_name' => 'Bahar', 'last_name' => 'Kaya', 'email' => 'bahar.kaya@example.com', 'phone' => '05551230002'],
            ['first_name' => 'Cem', 'last_name' => 'Öztürk', 'email' => 'cem.ozturk@example.com', 'phone' => '05551230003'],
            ['first_name' => 'Derya', 'last_name' => 'Aydın', 'email' => 'derya.aydin@example.com', 'phone' => '05551230004'],
            ['first_name' => 'Eren', 'last_name' => 'Şahin', 'email' => 'eren.sahin@example.com', 'phone' => '05551230005'],
            ['first_name' => 'Funda', 'last_name' => 'Güneş', 'email' => 'funda.gunes@example.com', 'phone' => '05551230006'],
            ['first_name' => 'Gökhan', 'last_name' => 'Demir', 'email' => 'gokhan.demir@example.com', 'phone' => '05551230007'],
            ['first_name' => 'Hale', 'last_name' => 'Yalçın', 'email' => 'hale.yalcin@example.com', 'phone' => '05551230008'],
            ['first_name' => 'İsmail', 'last_name' => 'Korkmaz', 'email' => 'ismail.korkmaz@example.com', 'phone' => '05551230009'],
            ['first_name' => 'Jale', 'last_name' => 'Erdoğan', 'email' => 'jale.erdogan@example.com', 'phone' => '05551230010'],
        ];

        foreach ($customers as $customerData) {
            Customer::create([
                ...$customerData,
                'added_by' => 'Sistem',
                'edit_by' => 'Sistem',
                'updated_by' => 'Sistem',
            ]);
        }

        // Sabit user_id alanlarını kaldırdık, döngü içinde eşleştireceğiz
        $sampleOrders = [
            ['first_name' => 'Ahmet', 'last_name' => 'Yılmaz', 'email' => 'ahmet.yilmaz@example.com', 'phone' => '05551230001', 'material' => 'Dijital İllüstrasyon (CSP)', 'size' => '1080x1080 (Dijital Kare)', 'offered_price' => '1500.00', 'subject' => 'Karakter tasarımı', 'details' => 'Kırmızı saçlı bir savaşçı karakter.', 'status' => 'Bekliyor'],
            ['first_name' => 'Bahar', 'last_name' => 'Kaya', 'email' => 'bahar.kaya@example.com', 'phone' => '05551230002', 'material' => 'Sulu Boya Etkisi', 'size' => '1500x2000 (Dijital Baskı)', 'offered_price' => '2200.00', 'subject' => 'Portre çalışması', 'details' => 'Aile fotoğrafından portre.', 'status' => 'Onaylandı'],
            ['first_name' => 'Cem', 'last_name' => 'Öztürk', 'email' => 'cem.ozturk@example.com', 'phone' => '05551230003', 'material' => 'Karakalem Eskiz', 'size' => '1200x1800 (Dijital Kare)', 'offered_price' => '900.00', 'subject' => 'Manga karakteri', 'details' => 'Detaylı manga stili tasarım.', 'status' => 'Bekliyor'],
            ['first_name' => 'Derya', 'last_name' => 'Aydın', 'email' => 'derya.aydin@example.com', 'phone' => '05551230004', 'material' => 'Karakter Tasarımı', 'size' => '2000x2000 (Dijital Kare)', 'offered_price' => '2800.00', 'subject' => 'Efsanevi yaratık', 'details' => 'Ejderha benzeri yaratık.', 'status' => 'Çiziliyor'],
            ['first_name' => 'Eren', 'last_name' => 'Şahin', 'email' => 'eren.sahin@example.com', 'phone' => '05551230005', 'material' => 'Dijital İllüstrasyon (CSP)', 'size' => '1080x1350 (Dijital Kare)', 'offered_price' => '1750.00', 'subject' => 'Kedi portresi', 'details' => 'Sevimli kedi karakteri.', 'status' => 'Bekliyor'],
            ['first_name' => 'Funda', 'last_name' => 'Güneş', 'email' => 'funda.gunes@example.com', 'phone' => '05551230006', 'material' => 'Sulu Boya Etkisi', 'size' => '1600x2200 (Dijital Baskı)', 'offered_price' => '2400.00', 'subject' => 'Doğa manzarası', 'details' => 'Orman ve göl temalı çalışma.', 'status' => 'Onaylandı'],
            ['first_name' => 'Gökhan', 'last_name' => 'Demir', 'email' => 'gokhan.demir@example.com', 'phone' => '05551230007', 'material' => 'Karakter Tasarımı', 'size' => '1200x1600 (Dijital Kare)', 'offered_price' => '1300.00', 'subject' => 'Robot tasarımı', 'details' => 'Retro robot karakter tasarımı.', 'status' => 'Bekliyor'],
            ['first_name' => 'Hale', 'last_name' => 'Yalçın', 'email' => 'hale.yalcin@example.com', 'phone' => '05551230008', 'material' => 'Karakalem Eskiz', 'size' => '1000x1400 (Dijital Kare)', 'offered_price' => '850.00', 'subject' => 'Moda eskizi', 'details' => 'Moda konsepti çizimi.', 'status' => 'Çiziliyor'],
            ['first_name' => 'İsmail', 'last_name' => 'Korkmaz', 'email' => 'ismail.korkmaz@example.com', 'phone' => '05551230009', 'material' => 'Dijital İllüstrasyon (CSP)', 'size' => '1400x1400 (Dijital Kare)', 'offered_price' => '2000.00', 'subject' => 'Anime karakter', 'details' => 'Yıldızlı gece temalı anime karakter.', 'status' => 'Bekliyor'],
            ['first_name' => 'Jale', 'last_name' => 'Erdoğan', 'email' => 'jale.erdogan@example.com', 'phone' => '05551230010', 'material' => 'Sulu Boya Etkisi', 'size' => '1800x2400 (Dijital Baskı)', 'offered_price' => '2600.00', 'subject' => 'Çiçek kompozisyonu', 'details' => 'Beyaz çiçekler ve altın tonlar.', 'status' => 'Onaylandı'],
        ];

        foreach ($sampleOrders as $index => $orderData) {
            // Sipariş sırasına göre elimizdeki gerçek kullanıcı id'lerinden birini güvenli bir modülüs aritmetiğiyle seçiyoruz
            $userIndex = $index % count($userIds);
            
            Order::create([
                ...$orderData,
                'user_id' => $userIds[$userIndex], // Gerçek ve var olan ID basılıyor
                'updated_by' => 'Sistem',
            ]);
        }
    }
}
