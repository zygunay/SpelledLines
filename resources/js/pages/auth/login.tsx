import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle, Palette, ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen text-stone-900 bg-stone-50 flex items-center justify-center p-6 selection:bg-rose-200 font-sans">
            <Head title="Giriş Yap | Spelled Lines" />

            <div className="w-full text-stone-900 max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 relative overflow-hidden">
                
                {/* Üst Kısım: Geri Dönüş ve Logo */}
                <Link href={route('home')} className="absolute top-6 left-6 text-stone-400  transition flex items-center gap-1 text-xs font-semibold">
                    <ArrowLeft size={14} /> Vitrine Dön
                </Link>

                <div className="mt-8 flex text-stone-900 flex-col items-center justify-center text-center mb-8">
                    <div className="w-12 h-12 bg-rose-50  text-stone-900  rounded-full flex items-center justify-center mb-4">
                        <Palette size={24} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Tekrar Hoş Geldiniz</h1>
                    <p className="text-sm text-stone-500 mt-1">Siparişlerinizi ve koleksiyonu takip etmek için giriş yapın.</p>
                </div>

                {status && <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg text-center">{status}</div>}

                <form className="flex flex-col gap-5" onSubmit={submit}>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-stone-600 font-bold text-xs uppercase">E-posta Adresi</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="bg-stone-50 border-stone-200 h-10 focus:border-rose-400 focus:ring-rose-400"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ornek@mail.com"
                        />
                        <InputError message={errors.email} className="mt-1 text-xs text-rose-600" />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-stone-600 font-bold text-xs uppercase">Şifre</Label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline">
                                    Şifremi Unuttum
                                </Link>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="bg-stone-50 border-stone-200 h-10 focus:border-rose-400 focus:ring-rose-400"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} className="mt-1 text-xs text-rose-600" />
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-stone-300 text-rose-900 shadow-sm focus:ring-rose-900/20"
                        />
                        <Label htmlFor="remember" className="text-sm font-medium text-stone-600 cursor-pointer">Beni Hatırla</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full h-11 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold shadow-md shadow-rose-900/20 transition-all" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Giriş Yap
                    </Button>

                    <div className="text-center text-sm text-stone-500 mt-2">
                        Hesabınız yok mu?{' '}
                        <Link href={route('register')} className="font-bold text-rose-800 hover:text-rose-950 hover:underline">
                            Hemen Katılın
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}