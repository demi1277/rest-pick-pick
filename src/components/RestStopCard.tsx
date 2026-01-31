import { MapPin } from 'lucide-react';
import { RestStop, Facility } from '../data/restStops';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';

interface RestStopCardProps {
    data: RestStop;
    onClick?: () => void;
    isSelected?: boolean;
}

const facilityIcons: Record<Facility, string> = {
    nursing_room: '🍼',
    pharmacy: '💊',
    laundry: '🧺',
    shower: '🚿',
    observatory: '🔭',
    photo_spot: '📸',
    museum: '🏛️',
    gas_station: '⛽️',
    lpg_station: '🔥',
};

const facilityLabels: Record<Facility, string> = {
    nursing_room: '수유실',
    pharmacy: '약국',
    laundry: '세탁소',
    shower: '샤워실',
    observatory: '전망대',
    photo_spot: '포토존',
    museum: '박물관',
    gas_station: '주유소',
    lpg_station: 'LPG 충전소',
};

export function RestStopCard({ data, onClick, isSelected }: RestStopCardProps) {
    return (
        <Card
            className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group cursor-pointer bg-white ${isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
            onClick={onClick}
        >
            <CardHeader className="pb-3 pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{data.name}</h3>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {data.location.highwayName}
                        </p>
                        {/* Address or Phone */}
                        {data.location.address && (
                            <p className="text-xs text-slate-400 mt-1 truncate max-w-[250px]">
                                {data.location.address}
                            </p>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {data.facilities.slice(0, 5).map((facility) => (
                        <Badge key={facility} variant="outline" className="text-[10px] px-2 py-0.5 border-slate-200 bg-slate-50">
                            {facilityIcons[facility]} {facilityLabels[facility]}
                        </Badge>
                    ))}
                    {data.facilities.length > 5 && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-slate-200 bg-slate-50">
                            +{data.facilities.length - 5}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col gap-1 mt-3">
                    {data.telNo && (
                        <div className="text-xs text-slate-500 flex items-center">
                            <span className="font-semibold w-12 text-slate-400">Tel</span>
                            {data.telNo}
                        </div>
                    )}
                    {data.brand && (
                        <div className="text-xs text-slate-500 flex items-center">
                            <span className="font-semibold w-12 text-slate-400">Info</span>
                            <span className="line-clamp-1" title={data.brand}>{data.brand}</span>
                        </div>
                    )}
                </div>
            </CardContent>


        </Card>
    );
}
