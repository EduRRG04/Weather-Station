import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


const supabase = createClient(
  'https://thdkegixamtgzikjyvko.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZGtlZ2l4YW10Z3ppa2p5dmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4Njc2MTYsImV4cCI6MjAxMjQ0MzYxNn0.3W6SerX-LVYFwJ9rJeoWZPlmB-3Q7-9iOL244cNLINM'
);

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('measurements').select();
        if (error) {
          throw error;
        }

        setData(data);
      } catch (error) {
        console.error('Error al obtener datos de Supabase:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{display: 'flex'}}>
      <MapContainer style={{border:'10px',height:'500px', width:'100%'}} center={[19.207173, -103.807229]} zoom={16}>
      <TileLayer
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
         
          subdomains="abc" // Added the 'subdomains' prop
        />
        {data.map((row) => (
          <Marker
            key={row.id}
            position={[row.latitude, row.longitude]}
          >
            <Popup>
              <div>
                <p><strong>Estación:</strong> {row.station_id}</p>
                <p><strong>Temperatura:</strong> {row.temperature}°</p>
                <p><strong>Humedad:</strong> {row.humidity}%</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <table style={{ borderCollapse: 'collapse', flex: 1, marginLeft:'20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>FECHA Y HORA</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID ESTACION</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>LATITUD</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>LONGITUD</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>TEMPERATURA</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>HUMEDAD</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{row.id}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{row.created_at}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{row.station_id}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{row.latitude}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{row.longitude}</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{row.temperature}°C</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{row.humidity}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
