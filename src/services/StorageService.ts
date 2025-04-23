import { Preferences } from '@capacitor/preferences';
import { Kapture } from '../models/Kapture';

const KAPTURES_KEY = 'kaptures';

export class StorageService {
    // Récupérer toutes les Kaptures
    static async getKaptures(): Promise<Kapture[]> {
        const { value } = await Preferences.get({ key: KAPTURES_KEY });
        if(!value) return [];  

        const kaptures = JSON.parse(value);
        return kaptures.map((k: any) => ({
            ...k,
            timestamp: new Date(k.timestamp)
        }));
    }

    // Sauvegarder une nouvelle Kapture
    static async saveKapture(kapture: Kapture): Promise<void> {
        const kaptures = await this.getKaptures();
        kaptures.push(kapture);
        await Preferences.set({
            key: KAPTURES_KEY,
            value: JSON.stringify(kaptures)
        });
    }

    // Supprimer une Kapture
    static async deleteKapture(kaptureId: Kapture): Promise<void> {
        const kaptures = await this.getKaptures();
        const updatedKaptures = kaptures.filter(k => k.id !== kaptureId.id);
        await Preferences.set({
            key: KAPTURES_KEY,
            value: JSON.stringify(updatedKaptures)
        })
    }

}    