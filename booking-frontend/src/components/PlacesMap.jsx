import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function PlacesMap({ places }) {
  const first = places?.[0];
  const lat = first?.location?.latitude || 19.0760;
  const lng = first?.location?.longitude || 72.8777;
  return (
    <div className="h-[60vh] rounded-xl overflow-hidden shadow">
      <MapContainer center={[lat, lng]} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {(places||[]).map((p,i) => {
          const la = p.location?.latitude || p.geometry?.location?.lat;
          const lo = p.location?.longitude || p.geometry?.location?.lng;
          if (!la || !lo) return null;
          return (
            <Marker key={i} position={[la,lo]} icon={icon}>
              <Popup><b>{p.displayName?.text || p.name}</b><br/>{p.formattedAddress || p.address}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}