import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle, Palette, ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 selection:bg-rose-200 selection:text-rose-900 font-sans">
            <Head title="Kayıt Ol | Spelled Lines" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 relative overflow-hidden">
                
                <Link href={route('home')} className="absolute top-6 left-6 text-stone-400 hover:text-rose-900 transition flex items-center gap-1 text-xs font-semibold">
                    <ArrowLeft size={14} /> Vitrine Dön
                </Link>

                <div className="mt-6 flex flex-col items-center justify-center text-center mb-8">
                    <div className="w-12 h-12 bg-rose-50 text-rose-900 rounded-full flex items-center justify-center mb-4">
                        <Palette size={24} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Topluluğa Katılın</h1>
                    <p className="text-sm text-stone-500 mt-1">Sanat eserlerimizi takip etmek ve sipariş vermek için hesap oluşturun.</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    
                    {/* AD VE SOYAD (YAN YANA 2 KUTU) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name" className="text-stone-600 font-bold text-xs uppercase">Ad</Label>
                            <Input
                                id="first_name"
                                type="text"
                                value={data.first_name}
                                className="bg-stone-50 border-stone-200 h-10 text-stone-900 focus:border-rose-400 focus:ring-rose-400"
                                autoFocus
                                onChange={(e) => setData('first_name', e.target.value)}
                                placeholder="Örn: Zeynepnur"
                            />
                            <InputError message={errors.first_name} className="mt-1 text-xs text-rose-600" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name" className="text-stone-600 font-bold text-xs uppercase">Soyad</Label>
                            <Input
                                id="last_name"
                                type="text"
                                value={data.last_name}
                                className="bg-stone-50 border-stone-200 h-10 text-stone-900 focus:border-rose-400 focus:ring-rose-400"
                                onChange={(e) => setData('last_name', e.target.value)}
                                placeholder="Örn: Günay"
                            />
                            <InputError message={errors.last_name} className="mt-1 text-xs text-rose-600" />
                        </div>
                    </div>

                    {/* KULLANICI ADI (NICKNAME) */}
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-stone-600 font-bold text-xs uppercase">Kullanıcı Adı</Label>
                        <Input
                            id="username"
                            type="text"
                            value={data.username}
                            className="bg-stone-50 border-stone-200 h-10 text-stone-900 focus:border-rose-400 focus:ring-rose-400"
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Örn: spelledlines"
                        />
                        <InputError message={errors.username} className="mt-1 text-xs text-rose-600" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-stone-600 font-bold text-xs uppercase">E-posta Adresi</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            className="bg-stone-50 border-stone-200 h-10 text-stone-900 focus:border-rose-400 focus:ring-rose-400"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ornek@mail.com"
                        />
                        <InputError message={errors.email} className="mt-1 text-xs text-rose-600" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-stone-600 font-bold text-xs uppercase">Şifre</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            className="bg-stone-50 border-stone-200 h-10 text-stone-900 focus:border-rose-400 focus:ring-rose-400"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Güçlü bir şifre belirleyin"
                        />
                        <InputError message={errors.password} className="mt-1 text-xs text-rose-600" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-stone-600 font-bold text-xs uppercase">Şifre (Tekrar)</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            className="bg-stone-50 border-stone-200 h-10 text-stone-900 focus:border-rose-400 focus:ring-rose-400"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Şifrenizi doğrulayın"
                        />
                        <InputError message={errors.password_confirmation} className="mt-1 text-xs text-rose-600" />
                    </div>

                    <Button type="submit" className="mt-4 w-full h-11 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold shadow-md shadow-rose-900/20 transition-all" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Hesap Oluştur
                    </Button>

                    <div className="text-center text-sm text-stone-500 mt-2">
                        Zaten bir hesabınız var mı?{' '}
                        <Link href={route('login')} className="font-bold text-rose-800 hover:text-rose-950 hover:underline">
                            Giriş Yapın
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}