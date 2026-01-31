import { Facility } from '../data/restStops';
import { Button } from './ui/Button';

interface FilterBarProps {
    selectedFacilities: Facility[];
    onToggleFacility: (facility: Facility) => void;
}

const filters: { id: Facility; label: string; icon: string }[] = [
    { id: 'nursing_room', label: '수유실', icon: '🍼' },
    { id: 'pharmacy', label: '약국', icon: '💊' },
    { id: 'gas_station', label: '주유소', icon: '⛽️' },
    { id: 'shower', label: '샤워실', icon: '🚿' },
];

export function FilterBar({ selectedFacilities, onToggleFacility }: FilterBarProps) {
    return (
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar px-1">
            {filters.map((filter) => {
                const isSelected = selectedFacilities.includes(filter.id);
                return (
                    <Button
                        key={filter.id}
                        variant={isSelected ? 'accent' : 'outline'}
                        onClick={() => onToggleFacility(filter.id)}
                        className={`rounded-full whitespace-nowrap px-4 h-9 shadow-sm transition-all duration-200 ${isSelected ? 'shadow-md scale-105' : 'bg-white hover:bg-slate-50 border-slate-200'
                            }`}
                    >
                        <span className="mr-1.5">{filter.icon}</span>
                        {filter.label}
                    </Button>
                );
            })}
        </div>
    );
}
