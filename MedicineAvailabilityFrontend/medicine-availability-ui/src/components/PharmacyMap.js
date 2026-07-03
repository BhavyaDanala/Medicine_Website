import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

delete L.Icon.Default.prototype._getIconUrl;

// Normal blue pin
const normalIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Highlighted red/orange pin for hovered pharmacy
const highlightIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
      <path fill="#ef4444" stroke="#ffffff" stroke-width="1.5"
        d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>`,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
    className: '',
});

// Closed (greyed) pin
const closedIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="22" height="33">
      <path fill="#94a3b8" stroke="#ffffff" stroke-width="1"
        d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>`,
    iconSize: [22, 33],
    iconAnchor: [11, 33],
    popupAnchor: [0, -33],
    className: '',
});

const MapWrapper = styled.div`
  height: 100%;
  min-height: 520px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 16px;
  }
`;

const MapLegend = styled.div`
  position: absolute;
  bottom: 20px;
  left: 16px;
  background: rgba(255,255,255,0.95);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
`;

const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;

function FlyToSelected({ pharmacy }) {
    const map = useMap();
    useEffect(() => {
        if (pharmacy && pharmacy.latitude && pharmacy.longitude) {
            map.flyTo([pharmacy.latitude, pharmacy.longitude], 15, { duration: 0.8 });
        }
    }, [pharmacy, map]);
    return null;
}

function PharmacyMap({ pharmacies, hoveredPharmacyId, isOpenFn }) {
    const markersRef = useRef({});
    const hoveredPharmacy = pharmacies.find(p => p.pharmacyId === hoveredPharmacyId);

    const center = pharmacies.length > 0
        ? [pharmacies[0].latitude, pharmacies[0].longitude]
        : [17.4485, 78.3908];

    const isValid = (lat, lng) =>
        lat != null && lng != null && !isNaN(lat) && !isNaN(lng) &&
        lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

    const getIcon = (pharmacy) => {
        if (pharmacy.pharmacyId === hoveredPharmacyId) return highlightIcon;
        if (isOpenFn && !isOpenFn(pharmacy.openingTime, pharmacy.closingTime)) return closedIcon;
        return normalIcon;
    };

    return (
        <MapWrapper>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FlyToSelected pharmacy={hoveredPharmacy} />
                {pharmacies.filter(p => isValid(p.latitude, p.longitude)).map((pharmacy) => (
                    <Marker
                        key={pharmacy.pharmacyId}
                        position={[pharmacy.latitude, pharmacy.longitude]}
                        icon={getIcon(pharmacy)}
                        ref={el => { if (el) markersRef.current[pharmacy.pharmacyId] = el; }}
                    >
                        <Popup maxWidth={240}>
                            <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px 0' }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>
                                    {pharmacy.pharmacyName}
                                </div>
                                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                                    📍 {pharmacy.address}
                                </div>
                                {pharmacy.phoneNumber && (
                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                                        📞 {pharmacy.phoneNumber}
                                    </div>
                                )}
                                {pharmacy.openingTime && (
                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                                        🕐 {pharmacy.openingTime} – {pharmacy.closingTime}
                                    </div>
                                )}
                                {pharmacy.distanceKm != null && (
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a56db', marginTop: 6 }}>
                                        📌 {Number(pharmacy.distanceKm).toFixed(2)} km away
                                    </div>
                                )}
                                {isOpenFn && (
                                    <div style={{
                                        display: 'inline-block',
                                        marginTop: 6,
                                        padding: '2px 8px',
                                        borderRadius: 999,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        background: isOpenFn(pharmacy.openingTime, pharmacy.closingTime) ? '#dcfce7' : '#fee2e2',
                                        color: isOpenFn(pharmacy.openingTime, pharmacy.closingTime) ? '#166534' : '#991b1b',
                                    }}>
                                        {isOpenFn(pharmacy.openingTime, pharmacy.closingTime) ? '● Open Now' : '● Closed'}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <MapLegend>
                <LegendItem><LegendDot $color="#1a56db" /> Open Pharmacy</LegendItem>
                <LegendItem><LegendDot $color="#ef4444" /> Selected</LegendItem>
                <LegendItem><LegendDot $color="#94a3b8" /> Closed</LegendItem>
            </MapLegend>
        </MapWrapper>
    );
}

export default PharmacyMap;