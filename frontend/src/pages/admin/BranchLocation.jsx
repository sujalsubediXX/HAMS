import React, {useState, useEffect } from "react";
import axios from "axios";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const BranchLocation = () => {
  const center = [27.7172, 85.3240]; 
  const [locations,setlocations]=useState([]);
  useEffect(()=>{
    const fetchlocation=async()=>{
        try {
            const res=await axios.get("https://hams-eegi.onrender.com/api/hospital/location");
            if(res.status==201){
           setlocations(res.data.location)
            }else{
             toast.error("failed to fetch branch location.")
            }
        } catch (error) {
            console.log(error)
        }
    }
  fetchlocation();
  },[])



  return (
    <main className="flex flex-col w-[86vw]">
      <h2 style={{ textAlign: "center", marginTop: "1rem" }}>
        🗺️ Locations Map 
      </h2>
      <div style={{ height: '1000px', width: '100%', padding: '1rem' }}>
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
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

export default BranchLocation;


