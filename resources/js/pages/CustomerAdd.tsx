import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

// ==========================================
// MÜŞTERİ EKLEME BİLEŞENİ (CREATE CUSTOMER)
// ==========================================
export default function CustomerAdd() {
    
    // 1. FORM YÖNETİMİ (Inertia.js useForm)
    // Müşteri verilerini sunucuya (Controller) göndermek için state yönetimi
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });

    // 2. GÜVENLİK VE FORMAT KONTROLÜ (Validation)
    // Sadece sayı girilmesini sağlar ve numarayı tam 11 hane ile sınırlandırır.
    // Örn: Kullanıcı harf veya boşluk girerse anında siler.
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 11);
        setData('phone', onlyNums);
    };

    // 3. SAYFA TASARIMI (UI RENDER)
    return (
        <div className="min-h-screen bg-white p-6 flex items-center justify-center font-sans">
            
            {/* Ortalanmış Form Kartı */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
                
                {/* Üst Kısım: Geri Dönüş Linki ve Başlıklar */}
                <Link href={route('crm.index')} className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-4 transition">
                    <ArrowLeft size={14} /> Panele Geri Dön
                </Link>
                <h1 className="text-xl font-bold text-slate-800">Yeni Müşteri Oluştur</h1>
                <p className="text-xs text-slate-400 mt-0.5 mb-6">Müşteriyi sisteme kaydetmek için bilgileri eksiksiz doldurun.</p>

                {/* Form Başlangıcı */}
                <form 
                    onSubmit={e => { 
                        e.preventDefault(); 
                        post(route('crm.store')); // Form gönderildiğinde veriyi backend'e ilet 
                    }} 
                    className="space-y-4"
                >
                    
                    {/* Ad ve Soyad Alanı (Grid ile yan yana) */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Adı</label>
                            <Input 
                                required 
                                placeholder="Zeynepnur" 
                                value={data.first_name} 
                                onChange={e => setData('first_name', e.target.value)} 
                                className="bg-white text-slate-900 border-slate-200 text-xs h-9 focus:border-indigo-500" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Soyadı</label>
                            <Input 
                                required 
                                placeholder="Gunay" 
                                value={data.last_name} 
                                onChange={e => setData('last_name', e.target.value)} 
                                className="bg-white text-slate-900 border-slate-200 text-xs h-9 focus:border-indigo-500" 
                            />
                        </div>
                    </div>

                    {/* E-posta Alanı */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">E-posta</label>
                        <Input 
                            required 
                            type="email" 
                            placeholder="ornek@mail.com" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                            className="bg-white text-slate-900 border-slate-200 text-xs h-9 focus:border-indigo-500" 
                        />
                        {/* Backend'den e-posta formatı veya "bu e-posta kullanılıyor" hatası gelirse göster */}
                        {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email}</span>}
                    </div>

                    {/* Telefon Alanı (Özel kontrollü) */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Telefon Numarası (11 Haneli)</label>
                        <Input 
                            required 
                            type="text" 
                            pattern="[0-9]{11}" // Tarayıcı bazında 11 hane sayı zorunluluğu
                            placeholder="05554443322" 
                            value={data.phone} 
                            onChange={handlePhoneChange} // Sadece sayı girmesine izin veren fonksiyon
                            className="bg-white text-slate-900 border-slate-200 text-xs h-9 focus:border-indigo-500" 
                        />
                        {/* Canlı Karakter Sayacı */}
                        <span className="text-[10px] text-slate-400 mt-1 flex justify-between">
                            <span>Başında sıfırla birlikte boşluk bırakmadan yazın.</span>
                            <span className={data.phone.length === 11 ? 'text-emerald-500 font-bold' : ''}>
                                ({data.phone.length}/11)
                            </span>
                        </span>
                        {/* Backend hatası gelirse göster */}
                        {errors.phone && <span className="text-[10px] text-rose-500 mt-1 block">{errors.phone}</span>}
                    </div>

                    {/* Kayıt Butonu */}
                    <Button 
                        type="submit" 
                        disabled={processing} // Form gönderilirken spam'ı engellemek için butonu kitle
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-9 text-xs font-semibold rounded-xl mt-4 shadow-sm transition"
                    >
                        <Plus size={15} className="mr-1.5" /> 
                        {processing ? 'Kaydediliyor...' : 'Müşteriyi Kaydet'}
                    </Button>

                </form>
            </div>
        </div>
    );
}