import { IonCard, IonCardContent, IonImg } from '@ionic/react';
import { Kapture } from '../models/Kapture';

interface KaptureItemProps {
  kapture: Kapture;
}

 export default function KaptureItem( kapture: KaptureItemProps ): Promise<Kapture> {
  return (
    <IonCard>
      <IonImg src={kapture.imagePath} alt="Kapture" />
      <IonCardContent>
        <p>{kapture.timestamp.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        {kapture.caption && <p>{kapture.caption}</p>}
      </IonCardContent>
    </IonCard>
  )
}

