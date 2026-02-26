import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapPicker({ onLocationSelect, initialPosition }) {
    const [position, setPosition] = useState(initialPosition || { lat: 15.2993, lng: 73.9814 }); // Default to Goa

    const handlePositionChange = (pos) => {
        setPosition(pos);
        if (onLocationSelect) {
            onLocationSelect(pos);
        }
    };

    return (
        <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-inner mt-4">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handlePositionChange} />
            </MapContainer>
            <div className="bg-gray-50 p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                <span>Click on map to select venue location</span>
                {position && (
                    <span className="text-indigo-600">
                        Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
                    </span>
                )}
            </div>
        </div>
    );
}
