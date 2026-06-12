import React from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, UserPlus, Shield, Trash2, Calendar, Clock, History, UserCheck, Lock } from 'lucide-react';

// ==========================================
// 1. TİP TANIMLAMALARI (TYPES / INTERFACES)
// ==========================================

// Sistemdeki personelin veri yapısı
interface SystemUser {
    id: number;
    name: string;
    email: string;
    title: string;
    added_by: string;
    updated_by: string | null;
    date: string;
    time: string;
    updated_date: string;
    updated_time: string;
}

// En alttaki işlem günlüğü (Audit Log) veri yapısı
interface ActionLog {
    id: number;
    admin_name: string;
    target_name: string;
    target_email: string;
    target_title: string;
    action: string;
    reason: string;
    datetime: string;
}

// Arka plandan (Controller'dan) sayfaya gönderilen ana veriler
interface Props {
    systemUsers: SystemUser[];
    userActionLogs: ActionLog[];
    authUser: { title: string }; // Gelen yetki kontrolü (Formu kilitlemek için)
}

// ==========================================
// 2. SABİTLER (CONSTANTS)
// ==========================================
// YENİ ROLLER: 'Sistem Yöneticisi' kasten kaldırıldı ki kimse yeni bir admin yaratamasın.
const AVAILABLE_ROLES = [
    'Satış Müdürü',
    'Müşteri Temsilcisi',
    'İnsan Kaynakları Uzmanı',
    'Finans Sorumlusu',
    'Pazarlama Uzmanı',
    'Operasyon Sorumlusu',
    'Destek Ekibi'
];

// ==========================================
// 3. ANA BİLEŞEN (MAIN COMPONENT)
// ==========================================
export default function CrmUsers({ systemUsers, userActionLogs, authUser }: Props) {
    
    // Güvenlik Kontrolü: İşlem yapan kişi Yönetici mi?
    const isAdmin = authUser.title === 'Sistem Yöneticisi';

    // Form Yönetimi (Inertia useForm)
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        title: AVAILABLE_ROLES[0], // Varsayılan rol ilk sıradakidir
    });

    // İŞLEM: Yeni Personel Ekleme
    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('crm.users.store'), {
            onSuccess: () => reset('name', 'email', 'password'), // Başarılıysa formu temizle
        });
    };

    // İŞLEM: Personel Rolünü/Yetkisini Değiştirme
    const handleTitleChange = (userId: number, userName: string, newTitle: string) => {
        // Tarayıcı üzerinden zorunlu olarak değişiklik nedenini soruyoruz
        const reason = prompt(`"${userName}" adlı yetkilinin rolünü değiştirmek üzeresiniz.\nLütfen bu değişikliğin nedenini yazın:`);
        
        if (reason !== null) { // Eğer 'İptal'e basılmadıysa veriyi gönder
            router.put(route('crm.users.update', userId), { 
                title: newTitle,
                reason: reason || 'Neden belirtilmedi.' // Boş bırakılırsa varsayılan metin
            }, { preserveScroll: true }); // Sayfanın yukarı kaymasını engeller
        }
    };

    // İŞLEM: Personeli Sistemden Tamamen Silme
    const handleDelete = (id: number, name: string) => {
        // Tarayıcı üzerinden zorunlu olarak silme nedenini soruyoruz
        const reason = prompt(`"${name}" adlı yetkiliyi sistemden kalıcı olarak silmek üzeresiniz.\nLÜTFEN SİLME NEDENİNİ YAZIN:`);
        
        if (reason !== null) { // Eğer 'İptal'e basılmadıysa silme işlemini başlat
            router.delete(route('crm.users.destroy', id), {
                data: { reason: reason || 'Neden belirtilmedi.' },
                preserveScroll: true
            });
        }
    };

    return (
        <div className="min-h-screen bg-white p-6 font-sans text-slate-600 antialiased">
            
            {/* ÜST BAR: Geri Dönüş Butonu */}
            <div className="mx-auto mb-6 max-w-7xl">
                <Link href={route('crm.index')} className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition w-fit">
                    <ArrowLeft size={14} /> Müşteri Paneline Dön
                </Link>
            </div>

            {/* ANA GRID ALANI */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-4">
                
                {/* ----------------------------------------------------
                    SOL TARAF: YETKİ KONTROLLÜ YENİ PERSONEL FORMU
                ---------------------------------------------------- */}
                <div className="flex h-fit flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
                    <div className="mb-4 flex items-center gap-2 text-slate-800 font-bold">
                        <UserPlus size={18} className="text-indigo-500" />
                        <h2>Yeni Personel Tanımla</h2>
                    </div>
                    
                    {/* Eğer giriş yapan kişi Yönetici ise Formu Göster, Değilse Kilit Ekranı Göster */}
                    {isAdmin ? (
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ad Soyad</label>
                                <Input required value={data.name} onChange={e => setData('name', e.target.value)} className="h-9 text-xs bg-slate-50 border-slate-200" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">E-Posta</label>
                                <Input required type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="h-9 text-xs bg-slate-50 border-slate-200" />
                                {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email}</span>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Geçici Şifre</label>
                                <Input required type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="h-9 text-xs bg-slate-50 border-slate-200" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Unvan / Rol</label>
                                <select value={data.title} onChange={e => setData('title', e.target.value)} className="w-full rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs px-2 h-9 focus:border-indigo-500 focus:ring-indigo-500 outline-none">
                                    {AVAILABLE_ROLES.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <Button disabled={processing} type="submit" className="w-full h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl mt-2 shadow-sm">
                                Sisteme Güvenle Ekle
                            </Button>
                        </form>
                    ) : (
                        // Yetkisiz Kişiler İçin Kilit Ekranı
                        <div className="flex flex-col items-center justify-center text-center h-48 bg-slate-50 rounded-xl border border-slate-100">
                            <Lock size={28} className="mb-2 text-slate-300" />
                            <p className="text-xs font-medium text-slate-400 px-4">Sisteme yeni personel ekleme yetkisi sadece Sistem Yöneticilerine aittir.</p>
                        </div>
                    )}
                </div>

                {/* ----------------------------------------------------
                    SAĞ TARAF: SİSTEM YETKİLİLERİ VE YÖNETİM TABLOSU
                ---------------------------------------------------- */}
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">Personel ve Rol Yönetimi</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Sistem yöneticileri mevcut personelin rollerini değiştirebilir veya sistemden ayırabilir.</p>
                    </div>

                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="py-3.5 text-[10px] font-bold text-slate-400 uppercase">Personel Bilgisi</TableHead>
                                    <TableHead className="py-3.5 text-[10px] font-bold text-slate-400 uppercase">Sistem Rolü</TableHead>
                                    <TableHead className="py-3.5 text-[10px] font-bold text-slate-400 uppercase">Kayıt Detayı</TableHead>
                                    <TableHead className="py-3.5 text-[10px] font-bold text-slate-400 uppercase text-center">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {systemUsers.map((u) => {
                                    // Güvenlik Kilitleri: Hedef kişi yönetici mi? Değiştirmeye yetkimiz var mı?
                                    const isTargetAdmin = u.title === 'Sistem Yöneticisi';
                                    const canEdit = isAdmin && !isTargetAdmin;

                                    return (
                                        <TableRow key={u.id} className="hover:bg-slate-50/50 transition border-b border-slate-100 last:border-0">
                                            
                                            <TableCell className="py-3.5">
                                                <div className="font-semibold text-slate-700 text-sm">{u.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{u.email}</div>
                                            </TableCell>
                                            
                                            <TableCell className="py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield size={14} className={isTargetAdmin ? 'text-rose-500' : 'text-indigo-500'} />
                                                    <select 
                                                        value={u.title} 
                                                        onChange={(e) => handleTitleChange(u.id, u.name, e.target.value)}
                                                        disabled={!canEdit} // Yetkimiz yoksa Dropdown kilitlenir
                                                        className="rounded border border-slate-200 bg-white text-xs font-semibold text-slate-700 px-2 py-1 outline-none focus:border-indigo-500 transition disabled:opacity-70 disabled:bg-slate-50"
                                                    >
                                                        {isTargetAdmin ? (
                                                            <option value="Sistem Yöneticisi">Sistem Yöneticisi</option>
                                                        ) : (
                                                            AVAILABLE_ROLES.map(role => <option key={role} value={role}>{role}</option>)
                                                        )}
                                                    </select>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3.5">
                                                <div className="flex flex-col text-slate-500 font-medium gap-0.5">
                                                    <span className="flex items-center gap-1"><Calendar size={13} /> {u.date}</span>
                                                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded mt-1 w-fit border border-slate-200 text-slate-600">Ekleyen: {u.added_by}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3.5 text-center">
                                                {canEdit ? (
                                                    <Button onClick={() => handleDelete(u.id, u.name)} variant="ghost" size="sm" className="h-8 px-2 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                                                        <Trash2 size={14} className="mr-1" /> Sil
                                                    </Button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-300 italic font-medium px-2 flex items-center justify-center gap-1">
                                                        <Lock size={10} /> Yetkisiz
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* ----------------------------------------------------
                EN ALT KISIM: PERSONEL İŞLEM VE SİLİNME GÜNLÜĞÜ (AUDIT LOGS)
            ---------------------------------------------------- */}
            <div className="mx-auto mt-8 max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-slate-800 font-bold text-md border-b border-slate-100 pb-3">
                    <History size={18} className="text-amber-500" />
                    <span>Personel İşlem ve Silinme Günlüğü</span>
                </div>
                
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-3 text-[10px] font-bold text-slate-400 uppercase">Yönetici</TableHead>
                                <TableHead className="py-3 text-[10px] font-bold text-slate-400 uppercase">Personel</TableHead>
                                <TableHead className="py-3 text-[10px] font-bold text-slate-400 uppercase">Eylem</TableHead>
                                <TableHead className="py-3 text-[10px] font-bold text-slate-400 uppercase">Gerekçe / Neden</TableHead>
                                <TableHead className="py-3 text-[10px] font-bold text-slate-400 uppercase">Tarih</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userActionLogs.length > 0 ? (
                                userActionLogs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-slate-50/40 border-b border-slate-100 last:border-0 text-xs">
                                        
                                        {/* İşlemi Yapan Yönetici */}
                                        <TableCell className="py-3 font-bold text-slate-700 flex items-center gap-1.5">
                                            <UserCheck size={14} className="text-slate-400" /> {log.admin_name}
                                        </TableCell>
                                        
                                        {/* Etkilenen Personel Detayları */}
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
                                                {log.target_name}
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                    {log.target_title}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">{log.target_email}</div>
                                        </TableCell>
                                        
                                        {/* Yapılan Eylem (Renklendirme Mantığı ile Birlikte) */}
                                        <TableCell className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                                log.action.includes('Silindi') 
                                                ? 'bg-rose-50 text-rose-600 border-rose-100' 
                                                : log.action.includes('Eklendi')
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {log.action}
                                            </span>
                                        </TableCell>

                                        {/* İşlem Gerekçesi */}
                                        <TableCell className="py-3 text-slate-600 italic bg-slate-50/30 max-w-xs truncate" title={log.reason}>
                                            "{log.reason}"
                                        </TableCell>

                                        {/* Tarih ve Saat */}
                                        <TableCell className="py-3 text-slate-400 font-medium">{log.datetime}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                // Hiç Log Yoksa Gösterilecek Boş Durum (Empty State)
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-slate-300 italic">
                                        Henüz işlem kaydı bulunmuyor.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}