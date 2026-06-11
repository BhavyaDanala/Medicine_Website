import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import { theme } from "../styles/theme";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const MapWrapper = styled.div`
  border-radius: ${theme.spacing.lg};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: ${theme.spacing.md};
  }
`;

const StyledMapContainer = styled(MapContainer)`
  height: 500px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 350px;
  }
`;

const PopupContent = styled.div`
  font-family: ${theme.fonts.primary};
  
  strong {
    color: ${theme.colors.medicalBlue};
    font-size: ${theme.fontSizes.md};
  }
  
  p {
    margin: ${theme.spacing.xs} 0 0 0;
    color: ${theme.colors.darkGray};
    font-size: ${theme.fontSizes.sm};
  }
`;

function PharmacyMap({ pharmacies }) {
    const center = pharmacies.length > 0 
        ? [pharmacies[0].latitude, pharmacies[0].longitude]
        : [17.4485, 78.3908];

    const isValidLatLng = (lat, lng) => {
        return lat !== null && lat !== undefined && 
               lng !== null && lng !== undefined &&
               !isNaN(lat) && !isNaN(lng) &&
               lat >= -90 && lat <= 90 &&
               lng >= -180 && lng <= 180;
    };

    return (
        <MapWrapper>
            <StyledMapContainer
                center={center}
                zoom={12}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pharmacies.filter(pharmacy => 
                    isValidLatLng(pharmacy.latitude, pharmacy.longitude)
                ).map((pharmacy) => (
                    <Marker
                        key={pharmacy.pharmacyId}
                        position={[
                            pharmacy.latitude,
                            pharmacy.longitude
                        ]}
                    >
                        <Popup>
                            <PopupContent>
                                <strong>{pharmacy.pharmacyName}</strong>
                                <p>{pharmacy.address}</p>
                                {pharmacy.distanceKm && (
                                    <p>Distance: {pharmacy.distanceKm.toFixed(2)} km</p>
                                )}
                            </PopupContent>
                        </Popup>
                    </Marker>
                ))}
            </StyledMapContainer>
        </MapWrapper>
    );
}

export default PharmacyMap;