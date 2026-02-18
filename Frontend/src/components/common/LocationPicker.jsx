import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition, setAddress }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            map.flyTo(e.latlng, map.getZoom());

            // Reverse geocoding (optional but helpful)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    if (data.display_name) {
                        setAddress(data.display_name);
                    }
                })
                .catch(err => console.error("Geocoding error:", err));
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

// Helper to update map view when position changes externally
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function LocationPicker({ selectedPosition, onPositionChange, onAddressChange }) {
    const defaultCenter = [15.2993, 74.1240]; // Default to Goa as example
    const [position, setPosition] = useState(selectedPosition || null);

    const handlePositionChange = (newPos) => {
        setPosition(newPos);
        onPositionChange(newPos);
    };

    return (
        <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
            <MapContainer
                center={position || defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handlePositionChange} setAddress={onAddressChange} />
                {position && <ChangeView center={position} zoom={13} />}
            </MapContainer>
        </div>
    );
}
