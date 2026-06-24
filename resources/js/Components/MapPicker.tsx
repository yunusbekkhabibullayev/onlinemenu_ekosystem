import { useEffect, useRef, useState } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';
import L from 'leaflet';

const defaultCenter: [number, number] = [41.2995, 69.2401]; // Toshkent

interface MapPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (lat: number, lon: number, displayAddress: string) => void;
    initialLat?: number;
    initialLon?: number;
}

export default function MapPicker({ isOpen, onClose, onSelect, initialLat, initialLon }: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');

    useEffect(() => {
        if (!isOpen || !mapRef.current) return;

        const center: [number, number] =
            initialLat && initialLon ? [initialLat, initialLon] : defaultCenter;

        const map = L.map(mapRef.current).setView(center, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(map);

        const icon = L.divIcon({
            html: '<div class="w-10 h-10 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>',
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });

        const marker = L.marker(center, { icon, draggable: true }).addTo(map);
        markerRef.current = marker;
        mapInstanceRef.current = map;

        const updateFromMarker = async () => {
            const latlng = marker.getLatLng();
            setLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json&accept-language=uz`,
                    { headers: { 'User-Agent': 'OnlineMenu/1.0' } }
                );
                const data = await res.json();
                setSelectedAddress(data?.display_name || '');
            } catch {
                setSelectedAddress(`${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
            } finally {
                setLoading(false);
            }
        };

        marker.on('dragend', updateFromMarker);
        map.on('click', (e: L.LeafletMouseEvent) => {
            marker.setLatLng(e.latlng);
            updateFromMarker();
        });
        updateFromMarker();

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, [isOpen, initialLat, initialLon]);

    const handleConfirm = () => {
        if (markerRef.current) {
            const latlng = markerRef.current.getLatLng();
            onSelect(latlng.lat, latlng.lng, selectedAddress);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[120] bg-black/50" onClick={onClose} aria-hidden />
            <div className="fixed inset-x-0 bottom-0 top-12 z-[121] bg-card rounded-t-3xl shadow-xl flex flex-col safe-bottom">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    <h3 className="font-display text-lg font-bold text-foreground">Kartada tanlash</h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-foreground" />
                    </button>
                </div>
                <div className="flex-1 min-h-0 relative">
                    <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
                </div>
                <div className="p-4 border-t border-border bg-card shrink-0 space-y-3">
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Manzil aniqlanmoqda...</span>
                        </div>
                    ) : selectedAddress ? (
                        <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground line-clamp-2">{selectedAddress}</p>
                        </div>
                    ) : null}
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedAddress}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MapPin className="w-5 h-5" />
                        Manzilni tanlash
                    </button>
                </div>
            </div>
        </>
    );
}
