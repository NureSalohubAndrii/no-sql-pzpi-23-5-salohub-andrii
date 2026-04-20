import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { reverseGeocoding } from '@/api/nominatim.api';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  value: [number, number];
  onChange: (coords: [number, number]) => void;
  onAddressChange?: (address: string) => void;
}

const MapEvents = ({
  onChange,
  onAddressChange,
}: {
  onChange: (coords: [number, number]) => void;
  onAddressChange?: (address: string) => void;
}) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      onChange([lng, lat]);

      if (onAddressChange) {
        try {
          const data = await reverseGeocoding(lat, lng);
          if (data && data.properties) {
            onAddressChange(data.properties.displayName);
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
        }
      }
    },
  });
  return null;
};

const LocationPicker = ({ value, onChange, onAddressChange }: LocationPickerProps) => {
  const position: [number, number] = [value[1], value[0]];

  return (
    <div className='h-[300px] w-full rounded-md overflow-hidden border border-input relative'>
      <MapContainer
        center={position[0] !== 0 ? position : [49.9935, 36.2304]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapEvents onChange={onChange} onAddressChange={onAddressChange} />
        {value[0] !== 0 && <Marker position={position} />}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
