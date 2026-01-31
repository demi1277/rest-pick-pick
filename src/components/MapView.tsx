import { useEffect, useRef, useState } from 'react';
import { RestStop } from '../data/restStops';
import { MapPin } from 'lucide-react';



interface MapViewProps {
    restStops: RestStop[];
    selectedRestStop: RestStop | null;
    onSelectRestStop: (stop: RestStop) => void;
}

declare global {
    interface Window {
        kakao: any;
    }
}

export function MapView({ restStops, selectedRestStop, onSelectRestStop }: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mapInstance = useRef<any>(null);
    const markers = useRef<any[]>([]);

    useEffect(() => {
        const script = document.createElement('script');
        const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;

        if (!apiKey) {
            setError('Kakao Map API Key is missing.');
            return;
        }

        // Include services library for Geocoder
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                setMapLoaded(true);
            });
        };

        script.onerror = () => {
            setError('Failed to load Kakao Maps SDK.');
        };

        document.head.appendChild(script);

        return () => {
            // document.head.removeChild(script);
        };
    }, []);

    // Handle initial map load and markers
    useEffect(() => {
        if (!mapLoaded || !mapContainer.current || !window.kakao) return;

        // Initialize Map
        if (!mapInstance.current) {
            const options = {
                center: new window.kakao.maps.LatLng(36.5, 127.5),
                level: 12
            };
            mapInstance.current = new window.kakao.maps.Map(mapContainer.current, options);
        }

        const map = mapInstance.current;
        const geocoder = new window.kakao.maps.services.Geocoder();

        // Clear existing markers
        markers.current.forEach(m => m.setMap(null));
        markers.current = [];

        const bounds = new window.kakao.maps.LatLngBounds();
        let validMarkersCount = 0;

        // Process RestStops
        restStops.forEach((stop) => {
            // Helper to add marker
            const addMarker = (position: any) => {
                const marker = new window.kakao.maps.Marker({
                    position: position,
                    title: stop.name,
                    map: map,
                    clickable: true
                });

                // Add click listener to marker
                window.kakao.maps.event.addListener(marker, 'click', function () {
                    onSelectRestStop(stop);
                });

                markers.current.push(marker);
                bounds.extend(position);
                validMarkersCount++;

                // Fit bounds after adding some markers (only if no specific selection)
                if (validMarkersCount > 0 && !selectedRestStop) {
                    map.setBounds(bounds);
                }
            };

            if (stop.location.lat !== 0 && stop.location.lng !== 0) {
                // Use existing coordinates
                const position = new window.kakao.maps.LatLng(stop.location.lat, stop.location.lng);
                addMarker(position);
            } else if (stop.location.address) {
                // Use Geocoder
                geocoder.addressSearch(stop.location.address, function (result: any, status: any) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        addMarker(coords);
                    }
                });
            }
        });

    }, [mapLoaded, restStops]); // Removed selectedRestStop from dependency to prevent re-rendering markers on selection

    // Handle selection change (Pan to location)
    useEffect(() => {
        if (!mapLoaded || !mapInstance.current || !selectedRestStop || !window.kakao) return;

        const map = mapInstance.current;
        const geocoder = new window.kakao.maps.services.Geocoder();

        if (selectedRestStop.location.lat !== 0 && selectedRestStop.location.lng !== 0) {
            const moveLatLon = new window.kakao.maps.LatLng(selectedRestStop.location.lat, selectedRestStop.location.lng);
            map.panTo(moveLatLon);
        } else if (selectedRestStop.location.address) {
            geocoder.addressSearch(selectedRestStop.location.address, function (result: any, status: any) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    map.panTo(coords);
                }
            });
        }

        // Open InfoWindow logic could be added here if desired
    }, [selectedRestStop, mapLoaded]);

    if (error) {
        return (
            <div className="w-full h-full bg-slate-100 rounded-3xl flex items-center justify-center p-8 text-center text-slate-500 border border-slate-200">
                <div>
                    <MapPin className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100 relative">
            <div ref={mapContainer} className="w-full h-full" />
            {!mapLoaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-sm z-10">
                    <span className="animate-pulse text-slate-400">Loading Map...</span>
                </div>
            )}
        </div>
    );
}
