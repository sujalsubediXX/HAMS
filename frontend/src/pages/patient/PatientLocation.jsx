import React, { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useAuth } from "../../Utils/AuthProvider.jsx";

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const PatientLocation = () => {
  const { user } = useAuth();
  const center = [27.7172, 85.324];
  const [locations, setlocations] = useState([]);
  console.log(user.email);

  useEffect(() => {
    const fetchlocation = async () => {
      try {
        const getlocation = await axios.get(
          `https://hams-eegi.onrender.com/api/user/getuserlocation?email=${user.email}`,
          { withCredentials: true }
        );
        if (getlocation.status === 200) {
          console.log(getlocation.data.data);
          setlocations((prev) => [
            ...prev,
            {
              _id: "user-location",
              location: {
                lat: getlocation.data.data.lat,
                lng: getlocation.data.data.lng,
              },
              name: "Your Location",
              address: "You are here",
              city: "Current City",
            },
          ]);
        }
      } catch (error) {
        console.log("Failed to fetch user location");
      }

      try {
        const res = await axios.get(
          "https://hams-eegi.onrender.com/api/hospital/location",
          { withCredentials: true }
        );
        if (res.status === 201) {
          if (Array.isArray(res.data.location)) {
            setlocations((prev) => [...prev, ...res.data.location]);
          } else {
            setlocations((prev) => [
              ...prev,
              {
                location: res.data.location,
                name: "Branch Location",
                address: "Unknown",
                _id: "branch-default",
              },
            ]);
          }
        } else {
          console.error("Failed to fetch branch location.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchlocation();
  }, [user.email]);

  return (
    <main className="flex flex-col pt-[16vh]">
      <div
        style={{ height: "600px", width: "90%", padding: "1rem" }}
        className="mx-auto z-10"
      >
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />

          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.location.lat, loc.location.lng]}>
              <Popup>{loc.address}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  );
};

export default PatientLocation;
