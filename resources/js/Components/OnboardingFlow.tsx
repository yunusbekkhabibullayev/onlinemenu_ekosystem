import { useState, useEffect, useRef, useCallback } from 'react';
import { X, MapPin, Search, ChevronRight, ChevronLeft, Truck, Loader2, UtensilsCrossed, Home, Building2, Briefcase, Check } from 'lucide-react';
import { useAddress } from '@/Contexts/AddressContext';
import { toast } from 'sonner';
import MapPicker from '@/Components/MapPicker';

type Step = 'onboarding' | 'onboarding2' | 'address';

export default function OnboardingFlow() {
    const {
        onboardingCompleted,
        completeOnboarding,
        isAddressConfirmed,
        confirmAddress,
        skipAddress,
        isEditingAddress,
        closeAddressForm,
        address,
    } = useAddress();
    const [step, setStep] = useState<Step>(onboardingCompleted ? 'address' : 'onboarding');
    const [onboardingSlide, setOnboardingSlide] = useState(0);
    const [addressInput, setAddressInput] = useState('');
    const [city, setCity] = useState('');
    const [addressName, setAddressName] = useState('uy');
    const [customAddressName, setCustomAddressName] = useState('');
    const [entrance, setEntrance] = useState('');
    const [floor, setFloor] = useState('');
    const [apartment, setApartment] = useState('');
    const [note, setNote] = useState('');
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [addressType, setAddressType] = useState<'house' | 'apartment'>('apartment');
    const [showAddressNameModal, setShowAddressNameModal] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [addressStep, setAddressStep] = useState<'select' | 'details'>('select');
    const [searchSuggestions, setSearchSuggestions] = useState<Array<{ id?: number; display: string; street: string; city?: string; district?: string; lat?: number; lon?: number }>>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [determinedAddress, setDeterminedAddress] = useState('');
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const addressNameOptions = [
        { value: 'uy', label: 'Uy', icon: Home },
        { value: 'ish', label: 'Ish', icon: Briefcase },
        { value: 'boshqa', label: 'Boshqa', icon: MapPin },
    ] as const;

    useEffect(() => {
        if (address) {
            setAddressInput(address.street || '');
            setDeterminedAddress(address.street || '');
            setCity(address.city || '');
            setAddressName(address.addressName || 'uy');
            setCustomAddressName(address.customAddressName || '');
            setEntrance(address.entrance || '');
            setFloor(address.floor || '');
            setApartment(address.apartment || '');
            setNote(address.note || '');
            setAddressType(address.addressType || 'apartment');
        }
    }, [address, isEditingAddress]);

    useEffect(() => {
        if (isEditingAddress && address?.street) {
            setAddressStep('details');
        } else {
            setAddressStep('select');
        }
    }, [isEditingAddress, address?.street]);

    const handleNext = () => {
        if (step === 'onboarding') {
            if (onboardingSlide === 0) {
                setOnboardingSlide(1);
            } else {
                completeOnboarding();
                setStep('address');
            }
        }
    };

    const handleConfirmAddress = () => {
        const trimmed = addressInput.trim();
        if (!trimmed) return;
        setAddressStep('details');
    };

    const handleSaveAddress = () => {
        const trimmed = addressInput.trim();
        if (!trimmed) return;
        confirmAddress({
            street: trimmed,
            city: city.trim() || undefined,
            addressType,
            addressName: addressName || undefined,
            customAddressName: customAddressName.trim() || undefined,
            entrance: addressType === 'apartment' ? entrance.trim() || undefined : undefined,
            floor: addressType === 'apartment' ? floor.trim() || undefined : undefined,
            apartment: apartment.trim() || undefined,
            note: note.trim() || undefined,
        });
    };

    const handleSkip = () => {
        completeOnboarding();
        skipAddress();
    };

    const fillFromGeocoded = useCallback((display: string, addr?: { road?: string; street?: string; house_number?: string; house?: string; suburb?: string; neighbourhood?: string; city?: string; town?: string }) => {
        setDeterminedAddress(display);
        if (addr) {
            const parts = [
                addr.road || addr.street,
                addr.house_number || addr.house,
                addr.suburb || addr.neighbourhood,
            ].filter(Boolean);
            setAddressInput(parts.join(', ') || display);
            setCity(addr.city || addr.town || '');
        } else {
            setAddressInput(display);
            setCity('');
        }
    }, []);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Brauzeringiz joylashuvni qo\'llab-quvvatlamaydi');
            return;
        }
        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=uz`,
                        { headers: { 'User-Agent': 'OnlineMenu/1.0' } }
                    );
                    const data = await res.json();
                    const addr = data?.address;
                    fillFromGeocoded(data?.display_name || '', addr);
                    toast.success('Joylashuv topildi');
                } catch {
                    toast.error('Manzil aniqlanmadi');
                } finally {
                    setIsDetectingLocation(false);
                }
            },
            () => {
                toast.error('Joylashuvga ruxsat berilmadi');
                setIsDetectingLocation(false);
            }
        );
    };

    const handleMapSelect = (lat: number, lon: number, displayAddress: string) => {
        setShowMapPicker(false);
        fillFromGeocoded(displayAddress);
        toast.success('Manzil tanlandi');
    };

    const fetchSearchSuggestions = useCallback((q: string) => {
        if (q.length < 2) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const [dbRes, nomRes] = await Promise.all([
                    fetch(`/api/addresses/search?q=${encodeURIComponent(q)}`),
                    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=uz`, { headers: { 'User-Agent': 'OnlineMenu/1.0' } }),
                ]);
                const dbData = await dbRes.json();
                const nomData = await nomRes.json();
                const dbItems = (Array.isArray(dbData) ? dbData : []).map((a: { display?: string; street: string; city?: string; district?: string; latitude?: number; longitude?: number }) => ({
                    display: a.display || a.street,
                    street: a.street,
                    city: a.city,
                    district: a.district,
                    lat: a.latitude,
                    lon: a.longitude,
                }));
                const nomItems = (Array.isArray(nomData) ? nomData : []).map((n: { display_name: string; lat: string; lon: string; address?: Record<string, string> }) => ({
                    display: n.display_name,
                    street: n.address?.road || n.address?.street || n.display_name,
                    city: n.address?.city || n.address?.town,
                    lat: parseFloat(n.lat),
                    lon: parseFloat(n.lon),
                }));
                setSearchSuggestions([...dbItems, ...nomItems]);
                setShowSuggestions(true);
            } catch {
                setSearchSuggestions([]);
            }
        }, 300);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setAddressInput(v);
        fetchSearchSuggestions(v);
    };

    const handleSelectSuggestion = (s: { display: string; street: string; city?: string; lat?: number; lon?: number }) => {
        setAddressInput(s.display);
        setDeterminedAddress(s.display);
        setCity(s.city || '');
        setShowSuggestions(false);
    };

    if (isAddressConfirmed && !isEditingAddress) return null;

    if (step === 'onboarding') {
        return (
            <div className="fixed inset-0 z-[100] bg-background flex flex-col">
                <button
                    onClick={handleSkip}
                    className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                >
                    <X className="w-5 h-5 text-foreground" />
                </button>

                <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
                    {onboardingSlide === 0 ? (
                        <>
                            <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                                <Truck className="w-20 h-20 text-primary" />
                            </div>
                            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
                                Bepul yetkazib berish
                            </h1>
                            <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs mb-12">
                                Birinchi buyurtmalaringizni tez va qulay yetkazib beramiz
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                                <UtensilsCrossed className="w-20 h-20 text-primary" />
                            </div>
                            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
                                Sevimlisini tanlang
                            </h1>
                            <p className="text-muted-foreground text-center text-sm sm:text-base max-w-xs mb-12">
                                Mazali taomlarimizdan xohlaganini tanlang
                            </p>
                        </>
                    )}
                </div>

                <div className="px-6 pb-10 safe-bottom">
                    <div className="flex gap-2 justify-center mb-4">
                        <span className={`w-2 h-2 rounded-full transition-colors ${onboardingSlide === 0 ? 'bg-primary' : 'bg-muted'}`} />
                        <span className={`w-2 h-2 rounded-full transition-colors ${onboardingSlide === 1 ? 'bg-primary' : 'bg-muted'}`} />
                    </div>
                    <button
                        onClick={handleNext}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                        Keyingisi
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    const handleCloseAddress = () => {
        if (isEditingAddress) closeAddressForm();
        else handleSkip();
    };

    return (
        <>
            {/* Overlay — faqat desktop uchun modal effekti */}
            <div
                className="hidden lg:block fixed inset-0 z-[100] bg-black/50"
                aria-hidden
            />

            {/* Content: mobile — to'liq ekran, desktop — markazda modal. Overlay ustiga bosilganda yopiladi */}
            <div
                className="fixed inset-0 z-[101] flex items-center justify-center p-0 lg:p-4"
                onClick={(e) => e.target === e.currentTarget && handleCloseAddress()}
            >
                <div className="relative w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-lg flex flex-col bg-background lg:rounded-2xl lg:shadow-xl lg:overflow-hidden">
                    {/* Yopish tugmasi — o'ng tomonda */}
                    <button
                        onClick={handleCloseAddress}
                        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-foreground" />
                    </button>

                    <div className="flex-1 overflow-auto pt-4 pb-8 safe-bottom flex items-center justify-center">
                        <div className="w-full max-w-md px-4 sm:px-6 py-5 sm:py-6 lg:py-8">
                            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1 pr-12 lg:pr-0 text-center sm:text-left">
                                Qayerga yetkazib berilsin?
                            </h1>
                            <p className="text-sm text-muted-foreground mb-5 sm:mb-6 text-center sm:text-left">
                                Manzilingizni kiriting yoki joylashuvingizni tanlang
                            </p>

                            <div className="space-y-3 sm:space-y-4">
                                {addressStep === 'select' ? (
                                    <>
                                        {/* Qadam 1: Manzil tanlash */}
                                        {/* Qidirish — bazadagi manzillar + Nominatim */}
                                        <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={addressInput}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        placeholder="Ko'cha va uyni kiriting"
                                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 min-h-[48px] bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-base"
                                    />
                                    {showSuggestions && searchSuggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-20 max-h-48 overflow-y-auto">
                                            {searchSuggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => handleSelectSuggestion(s)}
                                                    className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                                                >
                                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                                    <span className="line-clamp-2">{s.display}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Kartada tanlash + Joylashuvni aniqlash — ustma-ust bitta ustunda */}
                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowMapPicker(true)}
                                                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-3 px-4 min-h-[48px] rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm sm:text-base font-medium text-foreground"
                                            >
                                                <MapPin className="w-5 h-5 shrink-0 text-primary" />
                                                Kartada tanlash
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDetectLocation}
                                                disabled={isDetectingLocation}
                                                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-3 px-4 min-h-[48px] rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm sm:text-base font-medium text-foreground disabled:opacity-70"
                                            >
                                                {isDetectingLocation ? (
                                                    <Loader2 className="w-5 h-5 shrink-0 animate-spin text-primary" />
                                                ) : (
                                                    <MapPin className="w-5 h-5 shrink-0 text-primary" />
                                                )}
                                                Joylashuvni aniqlash
                                            </button>
                                        </div>

                                        {/* Manzil chiqadigan maydon */}
                                        {addressInput.trim() && (
                                            <div className="rounded-xl bg-secondary border border-border p-4">
                                                <p className="text-xs font-medium text-muted-foreground mb-2">Manzil</p>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <Home className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-foreground leading-snug">{addressInput}</p>
                                                        {city && <p className="text-sm text-muted-foreground mt-0.5">{city}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Manzilni tasdiqlash — keyingi qadamga o'tadi */}
                                        <button
                                            onClick={handleConfirmAddress}
                                            disabled={!addressInput.trim()}
                                            className="w-full py-4 min-h-[52px] rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                                        >
                                            <MapPin className="w-5 h-5" />
                                            Manzilni tasdiqlash
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Qadam 2: Keyingi manzil tafsilotlari */}
                                        <button
                                            type="button"
                                            onClick={() => setAddressStep('select')}
                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Orqaga
                                        </button>

                                {/* Keyingi manzil tafsilotlari */}
                                <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-4">
                                    <h3 className="font-display text-base font-bold text-foreground">Keyingi manzil tafsilotlari</h3>

                                    {/* Tanlangan manzil — yuqorida kartaga o'xshash */}
                                    {addressInput.trim() && (
                                        <div className="rounded-xl bg-secondary border border-border p-4">
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Manzil</p>
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Home className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-foreground leading-snug">{addressInput}</p>
                                                    {city && <p className="text-sm text-muted-foreground mt-0.5">{city}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Manzil nomi — Uy, Ish, Boshqa + alohida yozish */}
                                <div>
                                    <p className="text-sm font-medium text-foreground mb-2">Manzil nomi</p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddressNameModal(true)}
                                            className="flex items-center gap-2 pl-3 pr-3 py-3.5 sm:py-4 min-h-[48px] rounded-xl bg-secondary border-0 focus:ring-2 focus:ring-primary outline-none text-foreground text-base text-left hover:bg-secondary/80 transition-colors shrink-0"
                                        >
                                            {(() => {
                                                const opt = addressNameOptions.find((o) => o.value === addressName);
                                                const Icon = opt?.icon ?? Home;
                                                return <Icon className="w-5 h-5 shrink-0 text-primary" />;
                                            })()}
                                            <span className="whitespace-nowrap">
                                                {addressNameOptions.find((o) => o.value === addressName)?.label ?? 'Uy'}
                                            </span>
                                            <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground rotate-90" />
                                        </button>
                                        <input
                                            type="text"
                                            value={customAddressName}
                                            onChange={(e) => setCustomAddressName(e.target.value)}
                                            placeholder="Manzil nomini alohida yozish kerak"
                                            className="flex-1 min-w-0 px-4 py-3.5 sm:py-4 min-h-[48px] bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-base"
                                        />
                                    </div>
                                    </div>

                                    {/* Manzil turi bottom sheet modal */}
                                {showAddressNameModal && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-[110] bg-black/50"
                                            onClick={() => setShowAddressNameModal(false)}
                                            aria-hidden
                                        />
                                        <div className="fixed inset-x-0 bottom-0 z-[111] bg-card rounded-t-3xl shadow-xl safe-bottom animate-in slide-in-from-bottom duration-300">
                                            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                                                <h3 className="font-display text-lg font-bold text-foreground">Manzil turi</h3>
                                                <button
                                                    onClick={() => setShowAddressNameModal(false)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-foreground" />
                                                </button>
                                            </div>
                                            <div className="p-4 pb-8">
                                                {addressNameOptions.map((opt) => {
                                                    const Icon = opt.icon;
                                                    const isSelected = addressName === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setAddressName(opt.value);
                                                                setShowAddressNameModal(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-secondary transition-colors text-left"
                                                        >
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                <Icon className="w-5 h-5 text-primary" />
                                                            </div>
                                                            <span className="flex-1 font-medium text-foreground">{opt.label}</span>
                                                            {isSelected && (
                                                                <Check className="w-5 h-5 text-primary shrink-0" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Manzil turi — Hovli joy yoki Ko'p qavatli */}
                                <div>
                                    <p className="text-sm font-medium text-foreground mb-2">Manzil turi</p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setAddressType('house')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 min-h-[48px] rounded-xl border-2 transition-all text-sm font-medium ${
                                                addressType === 'house'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                                            }`}
                                        >
                                            <Home className="w-5 h-5 shrink-0" />
                                            Hovli joy
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAddressType('apartment')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 min-h-[48px] rounded-xl border-2 transition-all text-sm font-medium ${
                                                addressType === 'apartment'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                                            }`}
                                        >
                                            <Building2 className="w-5 h-5 shrink-0" />
                                            Ko&apos;p qavatli
                                        </button>
                                        </div>
                                    </div>

                                    {/* Hovli joy: faqat Uy raqami | Ko'p qavatli: Kirish yo'l + Qavat + Xonadon — bitta qatorda */}
                                    {addressType === 'house' ? (
                                    <input
                                        type="text"
                                        value={apartment}
                                        onChange={(e) => setApartment(e.target.value)}
                                        placeholder="Uy raqami"
                                        className="w-full px-4 py-3 min-h-[48px] bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-base"
                                    />
                                ) : (
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                        <input
                                            type="text"
                                            value={entrance}
                                            onChange={(e) => setEntrance(e.target.value)}
                                            placeholder="Kirish yo'l"
                                            className="w-full px-4 py-3 min-h-[48px] bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-base"
                                        />
                                        <input
                                            type="text"
                                            value={floor}
                                            onChange={(e) => setFloor(e.target.value)}
                                            placeholder="Qavat"
                                            className="w-full px-4 py-3 min-h-[48px] bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-base"
                                        />
                                        <input
                                            type="text"
                                            value={apartment}
                                            onChange={(e) => setApartment(e.target.value)}
                                            placeholder="Xonadon"
                                            className="w-full px-4 py-3 min-h-[48px] bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-base"
                                        />
                                    </div>
                                    )}

                                    {/* Kuryer uchun izoh */}
                                    <div>
                                        <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Kuryer uchun izoh (ixtiyoriy)"
                                        rows={3}
                                        className="w-full px-4 py-3 min-h-[80px] bg-secondary border-0 rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground text-base resize-none"
                                        />
                                    </div>
                                </div>

                                        {/* Manzilni saqlash — qadam 2 tugmasi */}
                                        <button
                                            onClick={handleSaveAddress}
                                            className="w-full py-4 min-h-[52px] rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-base mt-2"
                                        >
                                            <MapPin className="w-5 h-5" />
                                            Manzilni saqlash
                                        </button>
                                    </>
                                )}
                            </div>

                            {!isEditingAddress && addressStep === 'select' && (
                                <button
                                    onClick={handleSkip}
                                    className="mt-6 text-sm text-muted-foreground hover:text-foreground underline"
                                >
                                    Keyinroq kiriting
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <MapPicker
                isOpen={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onSelect={handleMapSelect}
            />
        </>
    );
}
