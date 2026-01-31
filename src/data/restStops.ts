export type Facility =
    | 'nursing_room'
    | 'pharmacy'
    | 'laundry'
    | 'shower'
    | 'observatory'
    | 'photo_spot'
    | 'museum'
    | 'gas_station'
    | 'lpg_station';

export interface RestStopRaw {
    serviceAreaName: string; // 휴게소명
    routeName: string; // 노선명
    svarAddr: string; // 주소
    convenience: string; // 편의시설
    brand?: string; // 브랜드
    telNo?: string; // 전화번호
    // Other fields
    truckSaYn: string;
    maintenanceYn: string;
}

export interface RestStop {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        highwayName: string;
        address: string;
    };
    facilities: Facility[];
    brand?: string;
    telNo?: string;
}

export function mapApiToRestStop(item: RestStopRaw, index: number): RestStop {
    const facilities: Facility[] = [];

    const convenienceStr = item.convenience || '';

    if (convenienceStr.includes('수유실')) facilities.push('nursing_room');
    if (convenienceStr.includes('약국')) facilities.push('pharmacy');
    if (convenienceStr.includes('샤워실')) facilities.push('shower');
    if (convenienceStr.includes('세탁')) facilities.push('laundry');

    // Additional mapping based on keywords if needed

    return {
        id: `ex_${index}`,
        name: item.serviceAreaName,
        location: {
            lat: 0, // Will be resolved by Geocoder in MapView
            lng: 0, // Will be resolved by Geocoder in MapView
            highwayName: item.routeName,
            address: item.svarAddr
        },
        facilities,
        brand: item.brand,
        telNo: item.telNo
    };
}

