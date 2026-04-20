import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface StaticMapProps {
  coordinates: [number, number];
  title?: string;
}

const StaticMap = ({ coordinates, title }: StaticMapProps) => {
  const position: [number, number] = [coordinates[1], coordinates[0]];

  return (
    <div className='h-[300px] w-full rounded-xl overflow-hidden border shadow-sm z-0'>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        dragging={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <Marker position={position}>{title && <Popup>{title}</Popup>}</Marker>
      </MapContainer>
    </div>
  );
};

export default StaticMap;
