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
        try {
            const kaptures = await this.getKaptures();
            console.log('Sauvegarde de la Kapture avec location:', kapture.location); 
            kaptures.push(kapture);
            await Preferences.set({
                key: KAPTURES_KEY,
                value: JSON.stringify(kaptures)
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            throw error;
        }
    }

    // Mettre à jour une Kapture
    static async updateKapture(updatedKapture: Kapture): Promise<void> {
        const kaptures = await this.getKaptures();
        const kaptureToUpdate = kaptures.find(k => k.id === updatedKapture.id)

        if(!kaptureToUpdate) {
            throw new Error('Kapture non trouvée');
        }

        Object.assign(kaptureToUpdate, updatedKapture);

        await Preferences.set({
            key: KAPTURES_KEY,
            value: JSON.stringify(kaptures)
        });
    }

    // Supprimer une Kapture
    static async deleteKapture(kaptureId: string): Promise<void> {
        const kaptures = await this.getKaptures();
        const updatedKaptures = kaptures.filter(k => k.id !== kaptureId);
        await Preferences.set({
            key: KAPTURES_KEY,
            value: JSON.stringify(updatedKaptures)
        });
    }

}    
