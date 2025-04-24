import { IonButton, IonCard, IonCardContent, IonIcon, IonImg, IonInput } from '@ionic/react';
import { trash } from 'ionicons/icons'
import { Kapture } from '../models/Kapture';
import { useState } from 'react';
import { StorageService } from '../services/StorageService';
import './KaptureItem.css';

interface KaptureItemProps {
  kapture: Kapture;
  onDelete: (kaptureId: string) => void;
}

const KaptureItem: React.FC<KaptureItemProps> = ({ kapture, onDelete }) => {
  const [caption, setCaption] = useState(kapture.caption);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveCaption = async () => {
    try {
      const updatedKapture = { ...kapture, caption };
      await StorageService.updateKapture(updatedKapture);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la légende:', error);
      throw error
    }
  }

  const handleCancel = () => {
    setCaption(kapture.caption);
    setIsEditing(false);
  }

  const handleDelete = async () => {
    try {
      await StorageService.deleteKapture(kapture.id);
      onDelete(kapture.id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error
    }
  };

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

        {isEditing ? (
          <div>
            <IonInput
                value={caption}
                placeholder="Ajouter une légende..."
                onIonInput={e => setCaption(e.detail.value!)}
            />
            <IonButton size="small" onClick={handleSaveCaption}>Sauvegarder</IonButton>
            <IonButton size="small" fill="clear" onClick={handleCancel}>Annuler</IonButton>
          </div>
        ) : (
          <div onClick={() => setIsEditing(true)}>
            {caption ? <p>{caption}</p> : <p className='add-caption'>Ajouter une légende...</p>}
          </div>
        )}
        <IonButton
            fill="clear"
            color="danger"
            onClick={handleDelete}
            className="delete-button"
          >
          <IonIcon icon={trash} />
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default KaptureItem;

