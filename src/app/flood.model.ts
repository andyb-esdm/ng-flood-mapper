export interface Flood {
    id: string;
    message: string;
    floodAreaId: string;
    floodArea: {
        polygon: string;
        geoJSON: string;
    };

}

export interface FloodResponse {
    items: Flood[]
}