import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { camera } from 'ionicons/icons';
import { CameraService } from '../services/CameraService';
import './Tab1.css';


const Tab1: React.FC = () => {
  const handleCapture = async () => {
    const result = await CameraService.capturePhoto();
    if (result) {
      console.log('Photo capturée:', result);
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
        {/* composant galerie ajouté plus tard*/}
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
