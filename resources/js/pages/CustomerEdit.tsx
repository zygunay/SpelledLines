import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface Props {
    customer: { id: number; first_name: string; last_name: string; email: string; phone: string; };
}

export default function CustomerEdit({ customer}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
    });



    return (
        <div className="min-h-screen bg-white p-6 flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
                <Link href={route('crm.index')} className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-4">
                    <ArrowLeft size={14} /> İptal Et ve Dön
                </Link>
                <h1 className="text-xl font-bold text-slate-800">Müşteri Düzenle</h1>
                <p className="text-xs text-slate-400 mt-0.5 mb-6">Müşteri kayıt verilerini güncelleyin.</p>

                <form onSubmit={e => { e.preventDefault(); put(route('crm.update', customer.id)); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Adı</label>
                            <Input required value={data.first_name} onChange={e => setData('first_name', e.target.value)} className="bg-white text-slate-900 text-xs h-9" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Soyadı</label>
                            <Input required value={data.last_name} onChange={e => setData('last_name', e.target.value)} className="bg-white text-slate-900 text-xs h-9" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">E-posta</label>
                        <Input required type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="bg-white text-slate-900 text-xs h-9" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Telefon</label>
                        <Input required type="text" pattern="[0-9]{11}" value={data.phone} onChange={e => setData('phone', e.target.value.replace(/\D/g, '').slice(0, 11))} className="bg-white text-slate-900 text-xs h-9" />
                    </div>
                    <Button type="submit" disabled={processing} className="bg-amber-500 hover:bg-amber-600 text-white w-full h-9 text-xs font-semibold rounded-xl mt-2">
                        <Check size={15} className="mr-1" /> Değişiklikleri Kaydet
                    </Button>
                </form>
            </div>
        </div>
    );
}