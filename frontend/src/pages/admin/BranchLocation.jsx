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
            const res=await axios.get("http://localhost:3000/api/location/branch");
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


//   const locations = [
//     { name: "Kathmandu-MainHospital", lat: 27.7172, lng: 85.3240 },
//     { name: "Lalitpur", lat: 27.6681, lng: 85.3206 },
//     { name: "Bhaktapur", lat: 27.6711, lng: 85.4298 },
//     { name: "Dhulikhel", lat: 27.6258, lng: 85.5352 },
//     { name: "Banepa", lat: 27.6432, lng: 85.5210 },
//     { name: "Kavrepalanchok", lat: 27.5536, lng: 85.5306 },
//   ];
  const branches = [
    { name: "Kathmandu", lat: 27.7172, lng: 85.3240 },
    { name: "Lalitpur", lat: 27.6681, lng: 85.3206 },
    { name: "Bhaktapur", lat: 27.6711, lng: 85.4298 },
    { name: "Dhulikhel", lat: 27.6258, lng: 85.5352 },
    { name: "Banepa", lat: 27.6432, lng: 85.5210 },
    { name: "Kavrepalanchok", lat: 27.5536, lng: 85.5306 },
  ];
  
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
