import { useState, useMemo, useEffect } from 'react';
import { RestStop, Facility, mapApiToRestStop, RestStopRaw } from './data/restStops';
import { fetchRestStopData } from './api/apiClient';
import { FilterBar } from './components/FilterBar';
import { RestStopCard } from './components/RestStopCard';
import { Button } from './components/ui/Button';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { MapView } from './components/MapView';

function App() {
    const [restStops, setRestStops] = useState<RestStop[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRestStop, setSelectedRestStop] = useState<RestStop | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                // Using page 1, 100 rows for demo
                const response = await fetchRestStopData(1, 100);

                if (response?.list) {
                    const rawItems: RestStopRaw[] = response.list;
                    const mappedItems = rawItems.map((item, index) => mapApiToRestStop(item, index));
                    setRestStops(mappedItems);
                } else if (response?.response?.body?.items) {
                    // Fallback for previous structure just in case
                    const rawItems: RestStopRaw[] = response.response.body.items;
                    const mappedItems = rawItems.map((item, index) => mapApiToRestStop(item, index));
                    setRestStops(mappedItems);
                } else {
                    // Fallback if structure is different (some APIs return flat array or lowercase keys)
                    console.warn('Unexpected API response structure:', response);
                    setError('Failed to load data structure');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch rest stop data');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Scroll to selected card
    useEffect(() => {
        if (selectedRestStop) {
            const element = document.getElementById(`card-${selectedRestStop.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [selectedRestStop]);

    const handleToggleFacility = (facility: Facility) => {
        setSelectedFacilities(prev =>
            prev.includes(facility)
                ? prev.filter(f => f !== facility)
                : [...prev, facility]
        );
    };

    const filteredRestStops = useMemo(() => {
        return restStops.filter(stop => {
            const matchesFacilities = selectedFacilities.length === 0 ||
                selectedFacilities.every(facility => stop.facilities.includes(facility));

            const matchesSearch = stop.name.includes(searchQuery.trim());

            return matchesFacilities && matchesSearch;
        });
    }, [selectedFacilities, restStops, searchQuery]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 rounded-lg p-1.5 text-white">
                        <MapPin className="h-5 w-5 fill-current" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">휴게소픽픽</h1>
                </div>
                {/* Search removed from header */}
            </nav>

            <main className="pt-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar / List View */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">당신에게 딱 맞는 휴게소를 찾아보세요</h2>
                        <p className="text-slate-500">원하는 편의시설로 필터링할 수 있습니다.</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <Search className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="휴게소 이름으로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                        />
                    </div>

                    <div className="sticky top-20 z-40 bg-slate-50/95 backdrop-blur-sm pt-2 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                        <FilterBar
                            selectedFacilities={selectedFacilities}
                            onToggleFacility={handleToggleFacility}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {loading && (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <span className="ml-2 text-slate-500">휴게소 불러오는 중...</span>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-20 text-red-500">
                                <p>{error}</p>
                                <p className="text-sm text-slate-400 mt-2">API 키를 확인하거나 나중에 다시 시도해주세요.</p>
                            </div>
                        )}

                        {!loading && !error && filteredRestStops.map(stop => (
                            <div key={stop.id} id={`card-${stop.id}`}>
                                <RestStopCard
                                    data={stop}
                                    isSelected={selectedRestStop?.id === stop.id}
                                    onClick={() => setSelectedRestStop(stop)}
                                />
                            </div>
                        ))}

                        {!loading && !error && filteredRestStops.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400">조건에 맞는 휴게소가 없습니다.</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSelectedFacilities([]);
                                        setSearchQuery('');
                                    }}
                                >
                                    필터 & 검색 초기화
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map View */}
                <div className="block h-[400px] lg:col-span-7 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] order-first lg:order-last mb-8 lg:mb-0 rounded-3xl overflow-hidden shadow-md border border-slate-200">
                    <MapView
                        restStops={filteredRestStops}
                        selectedRestStop={selectedRestStop}
                        onSelectRestStop={setSelectedRestStop}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
