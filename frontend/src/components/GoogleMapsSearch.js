// src/components/GoogleMapsSearch.js
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '1200px',
  height: '700px'
};

const center = {
  lat: 37.67229496806523,
  lng: 137.88838989062504
};

const GoogleMapsSearch = () => {
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const [infoWindowData, setInfoWindowData] = useState(null);
  const markerRef = useRef(null);

  const handleLoad = (map) => {
    setMap(map);
  };

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: keyword }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        setMarkerPosition(location);
        setInfoWindowData({
          place: keyword,
          latlng: location,
          address: results[0].formatted_address
        });
        map.panTo(location);
        map.setZoom(10);
      } else if (status === 'ZERO_RESULTS') {
        alert('見つかりません');
      } else {
        alert('エラー発生');
      }
    });
  };

  const handleClear = () => {
    setMarkerPosition(null);
    setInfoWindowData(null);
  };

  return (
    <div>
      <div id="header"><b>Google Maps - 場所検索</b></div>
      <div>施設名称検索 （例：マチュピチュ、万里の長城）</div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>検索実行</button>
      <button onClick={handleClear}>結果クリア</button>
      <LoadScript googleMapsApiKey="AIzaSyDBUglP5RMqMC7MnVhelTB8Lu3C32uHhTY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={2}
          onLoad={handleLoad}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              ref={markerRef}
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              onClick={() => {
                if (markerRef.current) {
                  markerRef.current.infoWindow.open(map, markerRef.current);
                }
              }}
            >
              {infoWindowData && (
                <InfoWindow
                  position={markerPosition}
                  options={{ content: `<a href='http://www.google.com/search?q=${infoWindowData.place}' target='_blank'>${infoWindowData.place}</a><br><br>${infoWindowData.latlng}<br><br>${infoWindowData.address}<br><br><a href='http://www.google.com/search?q=${infoWindowData.place}&tbm=isch' target='_blank'>画像検索 by google</a>` }}
                />
              )}
            </Marker>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapsSearch;
