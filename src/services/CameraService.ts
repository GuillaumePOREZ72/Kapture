import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Kapture } from '../models/Kapture';
import { StorageService } from './StorageService';
import { v4 as uuidv4 } from 'uuid';

export class CameraService {
    static async capturePhoto(): Promise<Kapture | null> {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera
            });

            if (!image.webPath) {
                return null;
            }

            const newKapture: Kapture = {
                id: uuidv4(),
                imagePath: image.webPath,
                caption: '',
                timestamp: new Date()
            };

            await StorageService.saveKapture(newKapture);
            
            return newKapture;
        } catch (error) {
            throw new Error(`Erreur lors de la capture: ${error}`);
        }
    }
}
