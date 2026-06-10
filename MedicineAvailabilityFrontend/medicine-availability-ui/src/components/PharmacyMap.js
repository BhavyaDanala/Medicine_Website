import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

function PharmacyMap({ pharmacies }) {
    return (
        <MapContainer
            center={[17.4485, 78.3908]}
            zoom={12}
            style={{
                height: "500px",
                width: "100%"
            }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {
                pharmacies.map((pharmacy) => (
                    <Marker
                        key={pharmacy.pharmacyId}
                        position={[
                            pharmacy.latitude,
                            pharmacy.longitude
                        ]}
                    >
                        <Popup>
                            <strong>
                                {pharmacy.pharmacyName}
                            </strong>

                            <br />

                            {pharmacy.address}
                        </Popup>
                    </Marker>
                ))
            }
        </MapContainer>
    );


}

export default PharmacyMap;