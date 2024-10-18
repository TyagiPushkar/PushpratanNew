import React from 'react';
import { GoogleMap, Marker, DirectionsRenderer, LoadScript } from '@react-google-maps/api';

function VisitMap({ markers, mapCenter, directions }) {
    const mapContainerStyle = {
        height: '400px',
        width: '100%',
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyBtEmyBwz_YotZK8Iabl_nQQldaAtN0jhM">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={10}
            >
                {/* Render markers */}
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        label={marker.label}
                    />
                ))}
                
                {/* Render directions */}
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default VisitMap;
