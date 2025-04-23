import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Kapture } from '../models/Kapture';
import { StorageService } from './StorageService';

export class CameraService {
    static async capturePhoto(): Promise<Kapture | null> {
        try {
            // Capture la photo
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera
            });

            if (!image.webPath) {
                return null;
            }

            // Crée une nouvelle Kapture
            const newKapture: Kapture = {
                id: Date.now().toString(),
                imagePath: image.webPath,
                caption: '',
                timestamp: new Date()
            };

            // Sauvegarde dans le stockage
            await StorageService.saveKapture(newKapture);

            return newKapture;
        } catch (error) {
            console.error('Erreur lors de la capture:', error);
            return null;
        }
    }
}