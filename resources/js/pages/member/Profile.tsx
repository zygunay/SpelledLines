import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { ArrowLeft, Brush, CheckCircle2, Clock, LogOut, Mail, Palette, Phone, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderItem {
    id: number;
    subject: string;
    details: string;
    status: string;
    offered_price: string | null;
    agreed_price: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: {
        name: string;
        first_name?: string | null;
        last_name?: string | null;
        email: string;
        phone?: string | null;
        title?: string | null;
    };
    orders: OrderItem[];
}

export default function MemberProfile({ user, orders }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800">
            <Head title="Profilim | Spelled Lines" />

            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between rounded-full border border-stone-200 bg-white px-4 py-3 shadow-sm">
                    <Link href={route('home')} className="flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-900">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-900">
                            <Palette size={18} />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-stone-900">Spelled Lines</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link href={route('home')} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-900">
                            <ArrowLeft size={16} /> Ana Sayfa
                        </Link>
                        <form onSubmit={handleLogout}>
                            <button type="submit" className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900">
                                <LogOut size={16} /> Çıkış Yap
                            </button>
                        </form>
                    </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-900">
                                <UserCircle2 size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-stone-900">{user.first_name || user.name} {user.last_name || ''}</h1>
                                <p className="text-sm text-stone-500">Üye / Müşteri</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
                            <div className="flex items-center gap-2"><Mail size={16} className="text-stone-400" /> {user.email}</div>
                            <div className="mt-2 flex items-center gap-2"><Phone size={16} className="text-stone-400" /> {user.phone || 'Telefon eklenmedi'}</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Brush size={18} className="text-rose-700" />
                        <h2 className="text-lg font-bold text-stone-900">Kendi çizim taleplerim</h2>
                    </div>

                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h3 className="font-semibold text-stone-900">{order.subject}</h3>
                                            <p className="mt-1 text-sm text-stone-500">{order.details}</p>
                                            <p className="mt-2 text-xs text-stone-400">Talep tarihi: {order.created_at}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 text-sm">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                                                {order.status === 'Onaylandı' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                                {order.status}
                                            </span>
                                            <span className="text-stone-500">Teklif: {order.offered_price ? `₺${order.offered_price}` : 'Belirtilmedi'}</span>
                                            <span className="text-stone-500">Net Fiyat: {order.agreed_price ? `₺${order.agreed_price}` : 'Henüz belirlenmedi'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center text-sm text-stone-500">
                            Henüz bir çizim talebi oluşturmadınız.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
