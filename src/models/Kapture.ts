export interface Kapture {
    id: string;
    imagePath: string;
    caption: string;
    timestamp: Date;
    location?: {
        latitude: number;
        longitude: number;
    };
}