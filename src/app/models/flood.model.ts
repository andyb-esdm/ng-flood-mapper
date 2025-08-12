export interface Flood {
    id: string;
    message: string;
    floodAreaID: string;
    severity: string;
    severityLevel: number,
    floodArea: {
        polygon: string;
        geoJSON: string;
    };
}

export interface FloodResponse {
    items: Flood[]
}