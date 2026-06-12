import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, Brush, LogIn, UserPlus, ArrowRight, PenTool, Heart, MessageCircle, X, Send, Info, CheckCircle2, Instagram } from 'lucide-react';

// ==========================================
// 1. RESİMLERİ İÇERİ AKTARMA (VITE IMPORTS)
// ==========================================
import imgMlpm from './image/mlmp.jpeg';
import imgTheArtz from './image/theartz.jpg';
import imgRabbit from './image/rabbit.jpg';
import imgMishaPasha from './image/MisaPasha.jpg'; 
import imgDragonDark from './image/dragondark.jpg';
import imgEye from './image/Eye.jpg';
import imgChest from './image/chest.jpg';
import imgOwl from './image/owl.jpg';

interface ArtworkItem {
    id: number;
    title: string;
    category: string;
    tool: string;
    liked_by_user?: boolean;
    likes_count: number;
    comments: Array<{ id: number; comment: string; created_at: string; user_name: string }>;
}

interface Props {
    auth: {
        user: { name: string; email: string; title: string; phone?: string | null; } | null;
    };
    canLogin: boolean;
    canRegister: boolean;
    status?: string;
    artworks: ArtworkItem[];
}

const artworksData = [
    { id: 1, title: 'Pasha, Misha, Limon, Mia', category: 'Illustration', tool: 'CSP', image: imgMlpm },
    { id: 2, title: 'Different eyes, same heart, one love.', category: 'Portrait', tool: 'CSP', image: imgTheArtz },
    { id: 3, title: 'Is what I see heavier, or the flowers I grow within?', category: 'Surrealism', tool: 'CSP', image: imgRabbit },
    { id: 4, title: 'My little friends, a part of my life.', category: 'Pet Portrait', tool: 'CSP', image: imgMishaPasha },
    { id: 5, title: 'A gothic watercolor vision of a decaying dragon...', category: 'Dark Fantasy', tool: 'CSP', image: imgDragonDark },
    { id: 6, title: 'Letting go is also a way of healing.', category: 'Portrait', tool: 'CSP', image: imgEye },
    { id: 7, title: 'Some words remain unspoken; we quietly drift away...', category: 'Still Life', tool: 'CSP', image: imgChest },
    { id: 8, title: 'Away from all the noise of the world.', category: 'Sketch', tool: 'CSP', image: imgOwl },
];

export default function Welcome({ auth, canLogin, canRegister, status, artworks }: Props) {
    const artworkList = artworksData.map((art) => {
        const serverArt = artworks.find((item) => item.id === art.id);
        return {
            ...art,
            liked_by_user: serverArt?.liked_by_user ?? false,
            likes_count: serverArt?.likes_count ?? 0,
            comments: serverArt?.comments ?? [],
        };
    });

    // 1. Galeri Modalı State
    const [selectedArt, setSelectedArt] = useState<null | typeof artworkList[number]>(null);
    const [commentText, setCommentText] = useState('');
    const [artworkState, setArtworkState] = useState(artworkList);

    // 2. Sipariş (Commission) Modalı State ve Formu
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [subjectWordCount, setSubjectWordCount] = useState(0);

    useEffect(() => {
        setArtworkState(artworkList);
    }, [artworks]);
    
    // Auth User varsa ismini Ad ve Soyad olarak ayırıyoruz (Eğer tek isimse hepsi Ad olur)
    const userFirstName = auth.user?.name?.split(' ')[0] || '';
    const userLastName = auth.user?.name?.split(' ').slice(1).join(' ') || '';

    // Sipariş formu verileri
   const { data: orderData, setData: setOrderData, post: postOrder, processing: orderProcessing } = useForm({
        first_name: userFirstName,
        last_name: userLastName,
        email: auth.user?.email || '',
        phone: '',
        subject: '',
        details: '',
        material: 'Dijital İllüstrasyon (CSP)',
        size: '1080x1080 (Dijital Kare)',
        budget: '',
        offered_price: '' // budget yerine bunu yazıyoruz
    });

    // Modalları Yönetme
    const openModal = (art: typeof artworkList[number]) => {
        setSelectedArt(art);
        setCommentText('');
    };

    const toggleLike = (artworkId: number) => {
        if (!auth.user) {
            return;
        }

        router.post(route('artworks.like', artworkId), {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                const payload = page.props?.artworks as ArtworkItem[] | undefined;
                if (payload) {
                    setArtworkState((prev) => prev.map((art) => {
                        const found = payload.find((item) => item.id === art.id);
                        return found ? { ...art, liked_by_user: found.liked_by_user ?? false, likes_count: found.likes_count, comments: found.comments } : art;
                    }));
                    setSelectedArt((prev) => {
                        if (!prev) {
                            return prev;
                        }

                        const found = payload.find((item) => item.id === prev.id);
                        return found ? { ...prev, liked_by_user: found.liked_by_user ?? false, likes_count: found.likes_count, comments: found.comments } : prev;
                    });
                }
            },
        });
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.user || !selectedArt || !commentText.trim()) {
            return;
        }

        router.post(route('artworks.comment', selectedArt.id), { comment: commentText.trim() }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const payload = page.props?.artworks as ArtworkItem[] | undefined;
                if (payload) {
                    setArtworkState((prev) => prev.map((art) => {
                        const found = payload.find((item) => item.id === art.id);
                        return found ? { ...art, liked_by_user: found.liked_by_user ?? false, likes_count: found.likes_count, comments: found.comments } : art;
                    }));
                    setSelectedArt((prev) => {
                        if (!prev) {
                            return prev;
                        }

                        const found = payload.find((item) => item.id === prev.id);
                        return found ? { ...prev, liked_by_user: found.liked_by_user ?? false, likes_count: found.likes_count, comments: found.comments } : prev;
                    });
                }
                setCommentText('');
            },
        });
    };

const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Artık sadece alert vermiyor, route('orders.store') ile veriyi veritabanına yolluyor!
        postOrder(route('orders.store'), {
            onSuccess: () => {
                alert('Talebiniz başarıyla alındı! Spelled Lines olarak en kısa sürede dönüş yapacağız.');
                setIsOrderModalOpen(false);
            }
        });
    };
    // Konu (Subject) için 90 Kelime Sınırı Fonksiyonu
    const handleSubjectChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
        
        if (words.length <= 90) {
            setOrderData('subject', text);
            setSubjectWordCount(words.length);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-rose-200 selection:text-rose-900 relative">
            <Head title="Spelled Lines | Digital Art Studio" />

            {/* ÜST NAVİGASYON */}
            <header className="fixed top-0 z-40 w-full border-b border-stone-200 bg-white/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-2 text-rose-900">
                        <Palette size={24} strokeWidth={2.5} />
                        <span className="text-xl font-extrabold tracking-tight">Spelled Lines</span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            // Welcome.tsx içindeki Header kısmında bulunur:
<Link href={auth.user.title !== 'user' ? route('crm.index') : route('member.profile')}>
    <Button
        variant="outline"
        className="h-9 rounded-full border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-900"
    >
        {auth.user.title !== 'user' ? 'Stüdyo Yönetimi (CRM)' : 'Profilim'}
    </Button>
</Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link href={route('login')}>
                                        <Button variant="ghost" className="h-9 text-stone-500 hover:text-rose-900 font-medium">
                                            <LogIn size={16} className="mr-2" /> Giriş Yap
                                        </Button>
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link href={route('register')}>
                                        <Button className="h-9 rounded-full bg-rose-900 px-5 text-white hover:bg-rose-950 shadow-sm transition">
                                            <UserPlus size={16} className="mr-2" /> Topluluğa Katıl
                                        </Button>
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            </header>

    
            <main className="pt-28 pb-12 sm:pt-36 sm:pb-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    {status && (
                        <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                            {status}
                        </div>
                    )}
                    <div className="mx-auto max-w-2xl">
                        <div className="mb-6 flex justify-center">
                            <span className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-rose-800">
                                <Brush size={14} /> Yeni Koleksiyon Yayında
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
                            Duyguların <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-900 to-rose-600">Dijital Tuvale</span> Yansıması
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-stone-500">
                            Hayal gücünün sınırlarını zorlayan karakter tasarımları, 
                            illüstrasyonlar ve eşsiz dijital sanat eserleri. 
                            Çizgilerin ardındaki büyüye hoş geldiniz.
                        </p>
                    </div>
                </div>
            </main>

            {/* GALERİ */}
            <section className="bg-white py-20 border-t border-stone-200">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {artworkState.map((art) => (
                            <div 
                                key={art.id} 
                                onClick={() => openModal(art)}
                                className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col"
                            >
                                <div className="aspect-[4/5] relative overflow-hidden bg-stone-200">
                                    <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-4 text-white">
                                            <span className="flex items-center gap-1 font-semibold"><Heart size={20} /> {art.likes_count}</span>
                                            <span className="flex items-center gap-1 font-semibold"><MessageCircle size={20} /> {art.comments.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-stone-800 text-sm group-hover:text-rose-900 transition-colors line-clamp-2">{art.title}</h3>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[9px] font-bold rounded uppercase tracking-wider">{art.category}</span>
                                            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[9px] font-bold rounded uppercase tracking-wider">{art.tool}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* İNTERAKTİF ÇİZİM PANELİ (MODAL) */}
            {selectedArt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4 md:p-10 transition-opacity" onClick={() => setSelectedArt(null)}>
                    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-6xl max-h-full flex flex-col md:flex-row relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedArt(null)} className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white text-stone-800 rounded-full p-2 transition shadow-sm">
                            <X size={20} />
                        </button>

                        <div className="md:w-2/3 bg-stone-100 flex items-center justify-center p-4 overflow-y-auto min-h-[40vh] md:min-h-[80vh]">
                            <img src={selectedArt.image} alt={selectedArt.title} className="max-w-full max-h-[85vh] object-contain shadow-lg rounded-md" />
                        </div>

                        <div className="md:w-1/3 flex flex-col h-[50vh] md:h-auto max-h-[85vh] border-l border-stone-200 bg-white">
                            <div className="p-6 border-b border-stone-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-900 font-bold">SL</div>
                                    <div>
                                        <div className="font-bold text-sm text-stone-800">Spelled Lines</div>
                                        <div className="text-[10px] text-stone-400">Digital Artist</div>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-stone-900">{selectedArt.title}</h2>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-rose-50 text-rose-800 text-[10px] font-bold rounded uppercase">{selectedArt.category}</span>
                                    <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded uppercase">{selectedArt.tool}</span>
                                </div>
                                <div className="mt-6 flex items-center gap-4">
                                    <button onClick={() => toggleLike(selectedArt.id)} className={`flex items-center gap-2 font-bold transition-colors ${selectedArt.liked_by_user ? 'text-rose-600' : 'text-stone-400 hover:text-rose-600'}`}>
                                        <Heart size={24} fill={selectedArt.liked_by_user ? 'currentColor' : 'none'} />
                                        <span>{selectedArt.likes_count}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50 flex flex-col gap-3">
                                {selectedArt.comments.length > 0 ? (
                                    selectedArt.comments.map((comment) => (
                                        <div key={comment.id} className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-stone-800">{comment.user_name}</p>
                                                <p className="text-[10px] uppercase text-stone-400">{comment.created_at}</p>
                                            </div>
                                            <p className="mt-2 text-sm text-stone-600">{comment.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                                        <MessageCircle size={36} className="mb-3 opacity-30" />
                                        <p className="text-sm font-medium text-stone-500">Henüz yorum yapılmamış.</p>
                                        <p className="text-xs mt-1">Bu esere ilk yorumu sen yap!</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-stone-200 bg-white">
                                <form className="flex items-center gap-2" onSubmit={submitComment}>
                                    <input 
                                        type="text" 
                                        placeholder={auth.user ? "Yorum ekle..." : "Yorum yapmak için giriş yapın"} 
                                        disabled={!auth.user}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="flex-1 bg-stone-100 border-transparent rounded-full px-4 py-2 text-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 disabled:opacity-50 outline-none"
                                    />
                                    <button disabled={!auth.user || !commentText} className="p-2 text-rose-600 disabled:text-stone-300 hover:text-rose-800 transition">
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                ÇİZİM TALEBİ (COMMISSION) MODALI
            ========================================== */}
            {isOrderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4 md:p-6 transition-opacity" onClick={() => setIsOrderModalOpen(false)}>
                    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl max-h-[95vh] flex flex-col relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                            <div>
                                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2"><PenTool size={20} className="text-rose-700" /> Özel Çizim Talebi Oluştur</h2>
                                <p className="text-xs text-stone-500 mt-1">Talebinizi inceleyip size e-posta veya telefon üzerinden dönüş yapacağım.</p>
                            </div>
                            <button onClick={() => setIsOrderModalOpen(false)} className="bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-full p-2 transition">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            
                            {/* DİNAMİK BANNER (Kullanıcı Giriş Yapmışsa Hoşgeldin, Yapmamışsa Misafir Uyarısı) */}
                            {auth.user ? (
                                <div className="mb-6 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                                    <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                                    <div>
                                        <h4 className="text-sm font-bold text-emerald-900">Hoş geldiniz, {auth.user.name}!</h4>
                                        <p className="text-xs text-emerald-700 mt-0.5">Siparişinizi oluşturduktan sonra, onay ve hazırlık süreçlerini profilinizden anlık olarak takip edebilirsiniz.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3">
                                    <Info className="text-rose-600 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <h4 className="text-sm font-bold text-rose-900">Misafir Olarak Sipariş Veriyorsunuz</h4>
                                        <p className="text-xs text-rose-700 mt-1">
                                            Siparişinizi sistem üzerinden takip edebilmek ve onay süreçlerini görmek için işlemden önce 
                                            <Link href={route('login')} className="font-bold underline ml-1 hover:text-rose-900">Giriş Yapmanızı</Link> veya 
                                            <Link href={route('register')} className="font-bold underline ml-1 hover:text-rose-900">Kayıt Olmanızı</Link> tavsiye ederiz. 
                                            Yine de misafir olarak sipariş oluşturabilirsiniz.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleOrderSubmit} className="space-y-6">
                                {/* Kişisel Bilgiler Alanı (Ad ve Soyad ) */}
                                <div>
                                    <h3 className="text-sm font-bold text-stone-800 mb-3 border-b border-stone-100 pb-2">1. Kişisel ve İletişim Bilgileriniz</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Ad</label>
                                            <Input required value={orderData.first_name} onChange={e => setOrderData('first_name', e.target.value)} className="bg-stone-50 text-sm h-10 focus:border-rose-400" placeholder="Örn: Zeynepnur" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Soyad</label>
                                            <Input required value={orderData.last_name} onChange={e => setOrderData('last_name', e.target.value)} className="bg-stone-50 text-sm h-10 focus:border-rose-400" placeholder="Örn: Günay" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">E-Posta</label>
                                            <Input required type="email" value={orderData.email} onChange={e => setOrderData('email', e.target.value)} className="bg-stone-50 text-sm h-10 focus:border-rose-400" placeholder="ornek@mail.com" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Telefon Numarası</label>
                                            <Input required type="text" pattern="[0-9]{11}" value={orderData.phone} onChange={e => setOrderData('phone', e.target.value.replace(/\D/g, '').slice(0, 11))} className="bg-stone-50 text-sm h-10 focus:border-rose-400" placeholder="05554443322 (11 Haneli)" />
                                        </div>
                                    </div>
                                </div>

                                {/* Proje Detayları Alanı */}
                                <div>
                                    <h3 className="text-sm font-bold text-stone-800 mb-3 border-b border-stone-100 pb-2">2. Proje Detayları</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Materyal / Tarz</label>
                                            <select value={orderData.material} onChange={e => setOrderData('material', e.target.value)} className="w-full rounded-md border border-stone-200 bg-stone-50 text-stone-800 text-sm px-3 h-10 focus:border-rose-400 focus:ring-rose-400 outline-none">
                                                <option value="Dijital İllüstrasyon (CSP)">Dijital İllüstrasyon (CSP)</option>
                                                <option value="Sulu Boya Etkisi">Sulu Boya Etkisi (Sketchbook vb.)</option>
                                                <option value="Karakalem Eskiz">Karakalem Eskiz</option>
                                                <option value="Karakter Tasarımı">Karakter Tasarımı</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Tuval / Çıktı Boyutu</label>
                                            <select value={orderData.size} onChange={e => setOrderData('size', e.target.value)} className="w-full rounded-md border border-stone-200 bg-stone-50 text-stone-800 text-sm px-3 h-10 focus:border-rose-400 focus:ring-rose-400 outline-none">
                                                <option value="1080x1080 (Dijital Kare)">1080x1080 (Dijital Kare - Sosyal Medya)</option>
                                                <option value="A4 (21 x 29.7 cm)">A4 Boyutu (21 x 29.7 cm)</option>
                                                <option value="A3 (29.7 x 42 cm)">A3 Boyutu (29.7 x 42 cm)</option>
                                                <option value="4K Dijital Çözünürlük">4K Dijital Yüksek Çözünürlük</option>
                                                <option value="Özel Boyut (Açıklamada Belirtin)">Özel Boyut (Açıklamada Belirtin)</option>
                                            </select>
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Bütçe / Fiyat Teklifiniz (₺)</label>
                                            <Input type="number" placeholder="Örn: 1500" value={orderData.budget} onChange={e => setOrderData('budget', e.target.value)} className="bg-stone-50 text-sm h-10 focus:border-rose-400 w-1/2" />
                                            <p className="text-[10px] text-stone-400 mt-1">Aklınızdaki bütçeyi belirtebilirsiniz. Kesin fiyatlandırma, detaylar konuşulduktan sonra yapılacaktır.</p>
                                        </div>

                                        {/* (90 KELİME SINIRLI) */}
                                        <div className="md:col-span-2 mt-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Konu <span className="text-stone-400 normal-case font-normal">(Maksimum 90 Kelime)</span></label>
                                            <textarea 
                                                required
                                                rows={2}
                                                placeholder="Örn: Kendi tasarladığım fantastik karakterin ormandaki portresi..."
                                                value={orderData.subject}
                                                onChange={handleSubjectChange}
                                                className="w-full rounded-md border border-stone-200 bg-stone-50 text-stone-800 text-sm p-3 focus:border-rose-400 focus:ring-rose-400 outline-none resize-none"
                                            ></textarea>
                                            <p className="text-[10px] flex justify-between mt-1">
                                                <span className="text-stone-400">Çizimin ana temasını kısaca özetleyin.</span>
                                                <span className={`font-bold ${subjectWordCount >= 90 ? 'text-rose-600' : 'text-stone-500'}`}>({subjectWordCount}/90 Kelime)</span>
                                            </p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Çizim Detayları ve Ek İstekler</label>
                                            <textarea 
                                                required
                                                rows={4}
                                                placeholder="Lütfen çizilmesini istediğiniz karakteri, renk paletini veya atmosferi tüm detaylarıyla anlatın..."
                                                value={orderData.details}
                                                onChange={e => setOrderData('details', e.target.value)}
                                                className="w-full rounded-md border border-stone-200 bg-stone-50 text-stone-800 text-sm p-3 focus:border-rose-400 focus:ring-rose-400 outline-none resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* İPTAL VE GÖNDER BUTONLARI */}
                        <div className="p-5 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 rounded-b-2xl">
                            <Button variant="outline" onClick={() => setIsOrderModalOpen(false)} className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 font-semibold px-6">
                                İptal Et
                            </Button>
                            <Button onClick={handleOrderSubmit} className="bg-rose-900 hover:bg-rose-950 text-white shadow-sm px-6 font-semibold">
                                Talebi Gönder
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* SİPARİŞ VE INSTAGRAM BUTONLARI (YÜZEN BUTONLAR) */}
            <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end gap-3">
                <a 
                    href="https://www.instagram.com/spelledlines/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <Button 
                        type="button"
                        className="h-12 px-5 rounded-full shadow-lg shadow-pink-900/20 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all border-0"
                    >
                        <Instagram size={20} />
                        <span className="hidden sm:inline">Instagram'da Takip Et</span>
                    </Button>
                </a>

                <Button 
                    onClick={() => setIsOrderModalOpen(true)}
                    className="h-14 px-6 rounded-full shadow-2xl shadow-rose-900/30 bg-rose-900 hover:bg-rose-950 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all"
                >
                    <PenTool size={20} />
                    <span className="hidden sm:inline">Çizim Talebi Oluştur</span>
                </Button>
            </div>

            {/* FOOTER */}
            <footer className="bg-stone-900 py-10 text-center">
                <p className="text-stone-400 text-sm">
                    © {new Date().getFullYear()} Spelled Lines Studio. Tüm hakları saklıdır.
                </p>
            </footer>
        </div>
    );
}