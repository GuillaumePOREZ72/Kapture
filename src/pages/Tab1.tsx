import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, useIonToast } from '@ionic/react';
import { camera } from 'ionicons/icons';
import { CameraService } from '../services/CameraService';
import { StorageService } from '../services/StorageService';
import { Kapture } from '../models/Kapture';
import KaptureItem from '../components/KaptureItem';
import { useState, useEffect } from 'react';
import './Tab1.css';


const Tab1: React.FC = () => {
  const [kaptures, setKaptures] = useState<Kapture[]>([]);
  const [presentToast] = useIonToast();

  useEffect(() => {
    loadKaptures();
  }, []);

  const loadKaptures = async () => {
    try {
      const loadedKaptures = await StorageService.getKaptures();
      setKaptures(loadedKaptures);  
    } catch (error) {
      presentToast({
        message: `Erreur lors du chargement des Kaptures: ${error}`,
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
    }
  };

  const handleCapture = async () => {
    try {
      const result = await CameraService.capturePhoto();
      if (result) {
        console.log('Photo capturée:', result);
        setKaptures(prevKaptures => [...prevKaptures, result]);
        presentToast({
          message: 'Photo capturée avec succès !',
          duration: 2000,
          color: 'success',
          position: 'top'
        })
      }
    } catch (error) {
      presentToast({
        message: `Erreur lors de la capture: ${error}`,
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mes Kaptures</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mes Kaptures</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className='gallery-container'>
          {kaptures.map(kapture => (
            <KaptureItem key={kapture.id} kapture={kapture} />
          ))}
        </div>
        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
          <IonFabButton onClick={handleCapture}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
