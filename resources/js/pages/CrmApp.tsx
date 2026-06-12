import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Palette, Users, LogOut, Brush, Clock, CheckCircle2,
    XCircle, MoreVertical, MessageSquare, Phone, Mail,
    Edit, Trash2, X, Calendar, UserCog, Wallet, User as UserIcon,
    Shield, Lock, UserPlus2, History, UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AVAILABLE_ROLES = [
    'Satış ve İletişim',
    'Operasyon Sorumlusu',
    'Müşteri Destek',
    'İçerik Yöneticisi',
];

interface SystemUser {
    id: number;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    title: string;
    added_by: string;
    updated_by: string | null;
    date: string;
    time: string;
}

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

interface OrderActionLog {
    id: number;
    order_id: number | null;
    admin_name: string;
    customer_name: string;
    customer_email: string;
    action: string;
    details: string;
    datetime: string;
}

interface SessionLog {
    id: number;
    user_name: string;
    action: string;
    email: string;
    phone: string;
    title: string;
    datetime: string;
}

interface Props {
    auth: { user: { name: string; title: string; email: string } };
    customers: any[];
    orders: any[];
    metrics: {
        pending_count: number;
        approved_count: number;
        total_members: number;
        monthly_revenue: number;
    };
    systemUsers?: SystemUser[];
    userActionLogs?: ActionLog[];
    orderActionLogs?: OrderActionLog[];
    userLogs?: SessionLog[];
}

export default function CrmApp({
    auth,
    customers = [],
    orders = [],
    metrics,
    systemUsers = [],
    userActionLogs = [],
    orderActionLogs = [],
    userLogs = [],
}: Props) {
    const { post } = useForm();
    const [activeTab, setActiveTab] = useState<'orders' | 'members' | 'admins'>('orders');
    const isAdmin = auth.user.title === 'Sistem Yöneticisi';

    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [orderStatus, setOrderStatus] = useState('');
    const [orderAgreedPrice, setOrderAgreedPrice] = useState('');

    const [editingMember, setEditingMember] = useState<any>(null);
    const { data: memberData, setData: setMemberData, put: updateMember, processing: memberProcessing } = useForm({
        first_name: '', last_name: '', email: '', phone: '',
    });

    const { data: staffData, setData: setStaffData, post: addStaff, processing: staffProcessing, errors: staffErrors, reset: resetStaff } = useForm({
        first_name: '', last_name: '', email: '', phone: '', password: '', title: AVAILABLE_ROLES[0],
    });

    const [showStaffForm, setShowStaffForm] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
    const [staffRoleDrafts, setStaffRoleDrafts] = useState<Record<number, string>>({});

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('crm.logout'));
    };

    const handleOrderSave = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('crm.orders.update', editingOrder.id), {
            status: orderStatus,
            agreed_price: orderAgreedPrice,
        }, {
            preserveScroll: true,
            onSuccess: () => setEditingOrder(null),
        });
    };

    const openOrderEdit = (order: any) => {
        setEditingOrder(order);
        setOrderStatus(order.status);
        setOrderAgreedPrice(order.agreed_price ?? order.offered_price ?? '');
    };

    const openMemberEdit = (member: any) => {
        setEditingMember(member);
        setMemberData({
            first_name: member.first_name || member.name?.split(' ')[0] || '',
            last_name: member.last_name || member.name?.split(' ').slice(1).join(' ') || '',
            email: member.email,
            phone: member.phone || '',
        });
    };

    const handleMemberUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateMember(route('crm.members.update', editingMember.id), {
            preserveScroll: true,
            onSuccess: () => setEditingMember(null),
        });
    };

    const handleMemberDelete = (id: number, name: string) => {
        if (confirm(`${name} isimli üyeyi sistemden silmek istediğinize emin misiniz?`)) {
            router.delete(route('crm.members.destroy', id), { preserveScroll: true });
        }
    };

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        addStaff(route('crm.users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetStaff('first_name', 'last_name', 'email', 'phone', 'password');
                setShowStaffForm(false);
            },
        });
    };

    const handleTitleChange = (userId: number, userName: string, newTitle: string) => {
        const reason = prompt(`"${userName}" adlı yetkilinin rolünü değiştirmek üzeresiniz.\nLütfen bu değişikliğin nedenini yazın:`);
        if (reason !== null) {
            router.put(route('crm.users.update', userId), {
                title: newTitle,
                reason: reason || 'Neden belirtilmedi.',
            }, { preserveScroll: true });
        }
    };

    const handleEditStaffRole = (userId: number, currentTitle: string) => {
        setEditingStaffId(userId);
        setStaffRoleDrafts(prev => ({ ...prev, [userId]: currentTitle }));
    };

    const handleRoleUpdate = (userId: number, userName: string) => {
        const nextTitle = staffRoleDrafts[userId] ?? '';
        if (!nextTitle) {
            return;
        }

        handleTitleChange(userId, userName, nextTitle);
        setEditingStaffId(null);
    };

    const handleStaffDelete = (id: number, name: string) => {
        const reason = prompt(`"${name}" adlı yetkiliyi sistemden kalıcı olarak silmek üzeresiniz.\nLÜTFEN SİLME NEDENİNİ YAZIN:`);
        if (reason !== null) {
            router.delete(route('crm.users.destroy', id), {
                data: { reason: reason || 'Neden belirtilmedi.' },
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Bekliyor': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-max"><Clock size={12}/> Bekliyor</span>;
            case 'İletişime Geçildi': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 w-max"><MessageSquare size={12}/> İletişimde</span>;
            case 'Onaylandı': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Onaylandı</span>;
            case 'Reddedildi':
            case 'İptal': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 w-max"><XCircle size={12}/> {status}</span>;
            default: return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200 w-max">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex">
            <Head title="Stüdyo Yönetimi | Spelled Lines" />

            <aside className="w-64 bg-white border-r border-stone-200 flex flex-col hidden md:flex shrink-0">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-stone-200 text-rose-900">
                    <Palette size={24} strokeWidth={2.5} />
                    <span className="font-extrabold tracking-tight text-lg">Spelled Lines</span>
                </div>

                <div className="p-6">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Stüdyo Paneli</p>
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${activeTab === 'orders' ? 'bg-rose-50 text-rose-900' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}>
                            <Brush size={18} /> Çizim Talepleri
                        </button>
                        <button onClick={() => setActiveTab('members')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${activeTab === 'members' ? 'bg-rose-50 text-rose-900' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}>
                            <Users size={18} /> Topluluk Üyeleri
                        </button>
                        <button
                            onClick={() => { if (isAdmin) setActiveTab('admins'); }}
                            disabled={!isAdmin}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition ${
                                !isAdmin
                                    ? 'opacity-50 cursor-not-allowed bg-stone-50 text-stone-400'
                                    : activeTab === 'admins'
                                        ? 'bg-rose-50 text-rose-900'
                                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                            }`}
                        >
                            <div className="flex items-center gap-3"><Shield size={18} /> Yetkili Yönetimi</div>
                            {!isAdmin && <Lock size={14} className="text-stone-400" />}
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-stone-200 bg-stone-50/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-rose-900 text-white flex items-center justify-center font-bold">
                            {auth.user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-stone-900">{auth.user.name}</p>
                            <p className="text-[10px] text-stone-500 uppercase">{auth.user.title}</p>
                        </div>
                    </div>
                    <form onSubmit={handleLogout}>
                        <Button variant="outline" className="w-full h-9 text-xs font-bold border-stone-300 text-stone-700 bg-white hover:bg-stone-100 hover:text-stone-900">
                            <LogOut size={14} className="mr-2" /> Güvenli Çıkış
                        </Button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-bold text-stone-800">Stüdyo Yönetim Merkezi</h1>
                    <Link href={route('storefront')} className="text-sm font-semibold text-rose-700 hover:text-rose-900 underline underline-offset-4">Vitrine Dön</Link>
                </header>

                <div className="p-8 overflow-y-auto bg-stone-50 flex-1 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-center">
                            <p className="text-stone-500 text-xs font-bold uppercase">Bekleyen Çizim Talebi</p>
                            <p className="text-3xl font-extrabold text-amber-600 mt-1">{metrics?.pending_count || 0}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-center">
                            <p className="text-stone-500 text-xs font-bold uppercase">Onaylanan / Çizilen</p>
                            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{metrics?.approved_count || 0}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-center">
                            <p className="text-stone-500 text-xs font-bold uppercase">Toplam Topluluk Üyesi</p>
                            <p className="text-3xl font-extrabold text-stone-800 mt-1">{metrics?.total_members || 0}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-center">
                            <p className="text-stone-500 text-xs font-bold uppercase">Aylık Stüdyo Geliri</p>
                            <p className="text-3xl font-extrabold text-rose-900 mt-1">₺{metrics?.monthly_revenue || 0}</p>
                        </div>
                    </div>

                    {activeTab === 'orders' && (
                        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-stone-200 bg-white">
                                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Brush size={20} className="text-rose-700"/> Çizim Talepleri ve Siparişler</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-extrabold">
                                        <tr>
                                            <th className="px-6 py-4">Müşteri Detayı</th>
                                            <th className="px-6 py-4">İletişim</th>
                                            <th className="px-6 py-4 w-1/4">Konu / Talep</th>
                                            <th className="px-6 py-4">Fiyat (₺)</th>
                                            <th className="px-6 py-4">Durum</th>
                                            <th className="px-6 py-4 bg-rose-50/50">Son İşlem</th>
                                            <th className="px-6 py-4 text-center">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {orders && orders.length > 0 ? (
                                            orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-stone-800 flex items-center gap-2">
                                                            {order.first_name} {order.last_name}
                                                            {order.user_id ? (
                                                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold uppercase flex items-center gap-1"><UserIcon size={10}/> Kayıtlı</span>
                                                            ) : (
                                                                <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 border border-stone-200 text-[9px] font-bold uppercase">Misafir</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-stone-400 mt-1">{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1.5 text-xs text-stone-500">
                                                            <span className="flex items-center gap-1.5"><Phone size={14} className="text-stone-400" /> {order.phone}</span>
                                                            <span className="flex items-center gap-1.5"><Mail size={14} className="text-stone-400" /> {order.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-stone-800 font-bold mb-1">{order.subject}</div>
                                                        <div className="text-[10px] text-stone-500 line-clamp-2">{order.details}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <span className="text-stone-400">Teklif: {order.offered_price ? `₺${order.offered_price}` : 'Yok'}</span>
                                                            <span className="font-extrabold text-emerald-600">Net: {order.agreed_price ? `₺${order.agreed_price}` : '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                                    <td className="px-6 py-4 bg-rose-50/20 whitespace-nowrap">
                                                        {order.updated_by ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-rose-900">{order.updated_by}</span>
                                                                <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5"><Calendar size={10}/> {new Date(order.updated_at).toLocaleDateString('tr-TR')}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-stone-400 italic">İşlem yapılmadı</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button onClick={() => openOrderEdit(order)} className="p-2 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-full transition" title="Siparişi Güncelle">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={7} className="px-6 py-8 text-center text-stone-400">Sisteme henüz düşen bir sipariş/talep bulunmamaktadır.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-stone-200 bg-white">
                                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Users size={20} className="text-stone-500"/> Siteye Kayıt Olan Üyeler</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-extrabold">
                                        <tr>
                                            <th className="px-6 py-4">Üye Adı</th>
                                            <th className="px-6 py-4">İletişim</th>
                                            <th className="px-6 py-4">Kayıt Tarihi</th>
                                            <th className="px-6 py-4 text-right">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {customers.length > 0 ? (
                                            customers.map((user: any) => (
                                                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-stone-800">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-xs">
                                                                {user.name ? user.name.charAt(0) : 'U'}
                                                            </div>
                                                            {user.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-stone-600">
                                                        <div className="flex flex-col text-xs gap-1.5">
                                                            <span className="flex items-center gap-1.5"><Mail size={14} className="text-stone-400" /> {user.email}</span>
                                                            <span className="flex items-center gap-1.5"><Phone size={14} className="text-stone-400" /> {user.phone || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-stone-500 text-xs">
                                                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => openMemberEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition" title="Düzenle">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button onClick={() => handleMemberDelete(user.id, user.name)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-md transition" title="Sil">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-400">Henüz kayıtlı üye bulunmamaktadır.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admins' && isAdmin && (
                        <div className="space-y-8">
                            {/* Yetkililer Listesi */}
                            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-stone-200 bg-white flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Shield size={20} className="text-emerald-700"/> Yetkililer Listesi</h2>
                                        <p className="text-xs text-stone-500 mt-1">Sisteme erişimi olan personel ve yetkileri.</p>
                                    </div>
                                    <Button
                                        onClick={() => setShowStaffForm(!showStaffForm)}
                                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-2 h-9 text-xs"
                                    >
                                        <UserPlus2 size={16} /> Yeni Yetkili Ekle
                                    </Button>
                                </div>

                                {showStaffForm && (
                                    <div className="p-6 border-b border-stone-200 bg-stone-50">
                                        <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
                                            <div>
                                                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Ad</label>
                                                <Input required value={staffData.first_name} onChange={e => setStaffData('first_name', e.target.value)} className="h-9 text-xs bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Soyad</label>
                                                <Input value={staffData.last_name} onChange={e => setStaffData('last_name', e.target.value)} className="h-9 text-xs bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">E-Posta</label>
                                                <Input required type="email" value={staffData.email} onChange={e => setStaffData('email', e.target.value)} className="h-9 text-xs bg-white" />
                                                {staffErrors.email && <span className="text-[10px] text-rose-500">{staffErrors.email}</span>}
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Telefon</label>
                                                <Input value={staffData.phone} onChange={e => setStaffData('phone', e.target.value.replace(/\D/g, '').slice(0, 11))} className="h-9 text-xs bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Geçici Şifre</label>
                                                <Input required type="password" value={staffData.password} onChange={e => setStaffData('password', e.target.value)} className="h-9 text-xs bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Ünvan / Rol</label>
                                                <select value={staffData.title} onChange={e => setStaffData('title', e.target.value)} className="w-full rounded-md border border-stone-200 bg-white text-stone-800 text-xs px-2 h-9 outline-none">
                                                    {AVAILABLE_ROLES.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="xl:col-span-6">
                                                <Button disabled={staffProcessing} type="submit" className="h-9 text-xs bg-emerald-700 hover:bg-emerald-800 text-white">
                                                    Sisteme Ekle
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-extrabold">
                                            <tr>
                                                <th className="px-6 py-4">Yetkili / Personel</th>
                                                <th className="px-6 py-4">İletişim</th>
                                                <th className="px-6 py-4">Unvan (Yetki)</th>
                                                <th className="px-6 py-4">Kayıt Detayı</th>
                                                <th className="px-6 py-4 text-right">İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {systemUsers.length > 0 ? (
                                                systemUsers.map((admin) => {
                                                    const isTargetAdmin = admin.title === 'Sistem Yöneticisi';
                                                    const canEdit = isAdmin && !isTargetAdmin;
                                                    const displayName = [admin.first_name, admin.last_name].filter(Boolean).join(' ') || admin.name;
                                                    const selectedRole = staffRoleDrafts[admin.id] ?? admin.title;
                                                    const isEditingThisStaff = editingStaffId === admin.id;
                                                    return (
                                                        <tr key={admin.id} className="hover:bg-stone-50 transition-colors">
                                                            <td className="px-6 py-4 font-bold text-stone-800">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">
                                                                        {displayName.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold">{displayName}</div>
                                                                        <div className="text-[10px] text-stone-400">{admin.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-stone-600 text-xs">
                                                                <span className="flex items-center gap-2"><Mail size={14} className="text-stone-400" /> {admin.email}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {isEditingThisStaff ? (
                                                                    <select
                                                                        value={selectedRole}
                                                                        onChange={(e) => setStaffRoleDrafts(prev => ({ ...prev, [admin.id]: e.target.value }))}
                                                                        disabled={!canEdit}
                                                                        className="rounded border border-stone-200 bg-white text-xs font-semibold text-stone-700 px-2 py-1 outline-none disabled:opacity-70 disabled:bg-stone-50"
                                                                    >
                                                                        {AVAILABLE_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                                                    </select>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">{admin.title}</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-xs text-stone-500">
                                                                <span className="flex items-center gap-1"><Calendar size={12}/> {admin.date} {admin.time}</span>
                                                                <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded mt-1 inline-block">Ekleyen: {admin.added_by}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                {canEdit ? (
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        {isEditingThisStaff ? (
                                                                            <button onClick={() => handleRoleUpdate(admin.id, displayName)} className="px-3 py-2 text-emerald-700 hover:bg-emerald-50 rounded-md transition text-xs font-bold flex items-center gap-1">
                                                                                <Edit size={14} /> Kaydet
                                                                            </button>
                                                                        ) : (
                                                                            <button onClick={() => handleEditStaffRole(admin.id, admin.title)} className="px-3 py-2 text-emerald-700 hover:bg-emerald-50 rounded-md transition text-xs font-bold flex items-center gap-1">
                                                                                <Edit size={14} /> Güncelle
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => handleStaffDelete(admin.id, admin.name)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-md transition text-xs font-bold flex items-center gap-1">
                                                                            <Trash2 size={14} /> Sil
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[10px] text-stone-300 italic flex items-center gap-1 justify-end"><Lock size={10}/> Korumalı</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-400">Henüz yetkili personel bulunmamaktadır.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* İşlem Logları */}
                            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-stone-200">
                                    <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><History size={20} className="text-amber-600"/> Yetkili İşlem Günlüğü</h2>
                                    <p className="text-xs text-stone-500 mt-1">Yetkililerin yaptığı ekleme, güncelleme ve silme işlemleri.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-extrabold">
                                            <tr>
                                                <th className="px-6 py-4">İşlemi Yapan</th>
                                                <th className="px-6 py-4">Hedef Personel</th>
                                                <th className="px-6 py-4">Yetki</th>
                                                <th className="px-6 py-4">İşlem</th>
                                                <th className="px-6 py-4">Gerekçe</th>
                                                <th className="px-6 py-4">Tarih / Saat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {userActionLogs.length > 0 ? (
                                                userActionLogs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-stone-50 transition-colors text-xs">
                                                        <td className="px-6 py-4 font-bold text-stone-700">
                                                            <span className="flex items-center gap-1.5"><UserCheck size={14} className="text-stone-400"/> {log.admin_name}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-stone-700">{log.target_name}</div>
                                                            <div className="text-stone-400">{log.target_email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">{log.target_title}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                                                log.action.includes('Silindi')
                                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                                    : log.action.includes('Eklendi')
                                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}>{log.action}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-stone-500 italic max-w-xs truncate" title={log.reason}>"{log.reason}"</td>
                                                        <td className="px-6 py-4 text-stone-400 font-medium whitespace-nowrap">{log.datetime}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-400">Henüz işlem kaydı bulunmuyor.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Çizim Talepleri Günlüğü */}
                            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-stone-200">
                                    <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Brush size={20} className="text-rose-700"/> Çizim Talepleri Günlüğü</h2>
                                    <p className="text-xs text-stone-500 mt-1">Talep güncellemeleri ve değişiklikleri burada takip edilir.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-extrabold">
                                            <tr>
                                                <th className="px-6 py-4">İşlemi Yapan</th>
                                                <th className="px-6 py-4">Müşteri</th>
                                                <th className="px-6 py-4">İşlem</th>
                                                <th className="px-6 py-4">Detay</th>
                                                <th className="px-6 py-4">Tarih / Saat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {orderActionLogs.length > 0 ? (
                                                orderActionLogs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-stone-50 transition-colors text-xs">
                                                        <td className="px-6 py-4 font-bold text-stone-700">{log.admin_name}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-stone-700">{log.customer_name}</div>
                                                            <div className="text-stone-400">{log.customer_email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-0.5 rounded text-[11px] font-medium border bg-amber-50 text-amber-600 border-amber-100">{log.action}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-stone-500 italic max-w-xs truncate" title={log.details}>{log.details}</td>
                                                        <td className="px-6 py-4 text-stone-400 font-medium whitespace-nowrap">{log.datetime}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-400">Henüz çizim talebi günlüğü bulunmuyor.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Giriş / Çıkış Logları */}
                            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-stone-200">
                                    <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2"><Clock size={20} className="text-blue-600"/> Giriş / Çıkış Günlüğü</h2>
                                    <p className="text-xs text-stone-500 mt-1">Yetkililerin sisteme giriş ve çıkış saatleri.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500 font-extrabold">
                                            <tr>
                                                <th className="px-6 py-4">Personel</th>
                                                <th className="px-6 py-4">E-Posta</th>
                                                <th className="px-6 py-4">Yetki</th>
                                                <th className="px-6 py-4">İşlem</th>
                                                <th className="px-6 py-4">Tarih / Saat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {userLogs.length > 0 ? (
                                                userLogs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-stone-50 transition-colors text-xs">
                                                        <td className="px-6 py-4 font-bold text-stone-700">{log.user_name}</td>
                                                        <td className="px-6 py-4 text-stone-500">{log.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{log.title}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                                                log.action === 'Giriş Yaptı'
                                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                    : 'bg-stone-100 text-stone-600 border-stone-200'
                                                            }`}>{log.action}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-stone-400 font-medium whitespace-nowrap">{log.datetime}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-400">Henüz giriş/çıkış kaydı bulunmuyor.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setEditingOrder(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"><X size={20}/></button>
                        <h2 className="text-lg font-bold text-stone-900 mb-1 border-b border-stone-100 pb-3">Talebi Güncelle: {editingOrder.first_name}</h2>
                        <form onSubmit={handleOrderSave} className="mt-4 space-y-4">
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 mb-4">
                                <p className="text-xs text-stone-500 mb-2">Müşterinin Teklifi: <span className="font-bold text-stone-800">₺{editingOrder.offered_price || '0'}</span></p>
                                <label className="text-xs font-bold text-emerald-700 uppercase block mb-1 flex items-center gap-1"><Wallet size={14}/> Anlaşılan Net Fiyat (₺)</label>
                                <Input type="number" value={orderAgreedPrice} onChange={(e) => setOrderAgreedPrice(e.target.value)} className="bg-white border-stone-200 text-stone-900 h-10 focus:border-rose-400 focus:ring-rose-400"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Talep Durumu (Statü)</label>
                                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full rounded-md border border-stone-200 bg-white text-stone-900 px-3 h-10 focus:border-rose-400 focus:ring-rose-400 outline-none">
                                    <option value="Bekliyor">Bekliyor (İşlem Yapılmadı)</option>
                                    <option value="İletişime Geçildi">İletişime Geçildi / Detaylar Konuşuluyor</option>
                                    <option value="Onaylandı">Onaylandı (Çizim Aşamasında)</option>
                                    <option value="Reddedildi">Reddedildi</option>
                                    <option value="İptal">İptal Edildi</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" className="bg-white text-stone-600 border border-stone-300 hover:bg-stone-100" onClick={() => setEditingOrder(null)}>İptal</Button>
                                <Button type="submit" className="bg-rose-900 hover:bg-rose-950 text-white">Kaydet ve Güncelle</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setEditingMember(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"><X size={20}/></button>
                        <h2 className="text-lg font-bold text-stone-900 mb-1 flex items-center gap-2 border-b border-stone-100 pb-3"><UserCog size={20} className="text-blue-600"/> Üye Bilgilerini Düzenle</h2>
                        <form onSubmit={handleMemberUpdate} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Ad</label>
                                    <Input value={memberData.first_name} onChange={e => setMemberData('first_name', e.target.value)} className="bg-white border-stone-200 text-stone-900" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Soyad</label>
                                    <Input value={memberData.last_name} onChange={e => setMemberData('last_name', e.target.value)} className="bg-white border-stone-200 text-stone-900" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase block mb-1">E-Posta</label>
                                <Input type="email" value={memberData.email} onChange={e => setMemberData('email', e.target.value)} className="bg-white border-stone-200 text-stone-900" required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Telefon</label>
                                <Input value={memberData.phone} onChange={e => setMemberData('phone', e.target.value)} className="bg-white border-stone-200 text-stone-900" />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" className="bg-white text-stone-600 border border-stone-300 hover:bg-stone-100" onClick={() => setEditingMember(null)}>İptal</Button>
                                <Button type="submit" disabled={memberProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">Değişiklikleri Kaydet</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
