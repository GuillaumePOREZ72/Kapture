import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Kapture } from '../models/Kapture';
import { StorageService } from './StorageService';
import { v4 as uuidv4 } from 'uuid';
import { Capacitor } from '@capacitor/core';

export class CameraService {
    static async capturePhoto(): Promise<Kapture | null> {
        try {
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000
            });

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera,
                saveToGallery: true
            });

            if (!image.webPath) {
                throw new Error('Chemin de l\'image non disponible');
            }

            const newKapture: Kapture = {
                id: uuidv4(),
                imagePath: image.webPath,
                caption: '',
                timestamp: new Date(),
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            };

            await StorageService.saveKapture(newKapture);
            return newKapture;

        } catch (error) {
            console.error('Erreur détaillée lors de la capture:', error);
            throw error;
        }
    }
}
