import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { Kapture } from '../models/Kapture';
import { StorageService } from '../services/StorageService';
import L from 'leaflet';
import './Tab2.css';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet sur mobile
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Tab2: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const isFirstLoadRef = useRef(true); // Pour suivre le premier chargement

  // Initialiser la carte
  useEffect(() => {
    if (!mapRef.current) {
      // Initialiser la carte avec des options supplémentaires
      mapRef.current = L.map('map', {
        zoomControl: true,
        attributionControl: true,
        fadeAnimation: true,
        zoomAnimation: true
      });
      
      // Utiliser un fournisseur de tuiles plus stable
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '© OpenStreetMap contributors',
        crossOrigin: true,
        detectRetina: true
      }).addTo(mapRef.current);

      // Forcer un rafraîchissement de la carte après son initialisation
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);
    }
    
    loadKaptures();

    const interval = setInterval(() => {
      loadKaptures();
    }, 10000);

    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const loadKaptures = async () => {
    try {
      const loadedKaptures = await StorageService.getKaptures();
      const kapturesWithLocation = loadedKaptures.filter(k => k.location);
      
      // Nettoyer les marqueurs existants
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Ajouter les nouveaux marqueurs
      kapturesWithLocation.forEach(kapture => {
        if (mapRef.current && kapture.location) {
          const marker = L.marker([
            kapture.location.latitude,
            kapture.location.longitude
          ]).addTo(mapRef.current);
          
          marker.bindPopup(`
            <div style="text-align: center;">
              <img src="${kapture.imagePath}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 8px;"/>
              <p style="margin: 5px 0; font-weight: bold;">${kapture.caption || 'Sans légende'}</p>
              <p style="margin: 5px 0; color: #666;">
                ${new Date(kapture.timestamp).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          `, {
            maxWidth: 200
          });

          markersRef.current.push(marker);
        }
      });

      // Centrer la carte uniquement au premier chargement ou sur un nouveau marqueur
      if (isFirstLoadRef.current && kapturesWithLocation.length > 0) {
        const lastKapture = kapturesWithLocation[kapturesWithLocation.length - 1];
        mapRef.current?.setView([
          lastKapture.location!.latitude,
          lastKapture.location!.longitude
        ], 13);
        isFirstLoadRef.current = false;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des Kaptures:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Carte des Kaptures</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Carte des Kaptures</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="map" style={{ height: '100%', width: '100%' }}></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;








