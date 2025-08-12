export interface Flood {
    id: string;
    message: string;
    floodAreaID: string;
    floodArea: {
        polygon: string;
        geoJSON: string;
    };
}

export interface FloodResponse {
    items: Flood[]
}