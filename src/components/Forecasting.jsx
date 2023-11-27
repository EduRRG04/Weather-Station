import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/supabaseClient';
import * as tf from '@tensorflow/tfjs';
import Plot from 'react-plotly.js';

export default function Forecasting() {
  const [data, setData] = useState([]);
  const [model, setModel] = useState(null);
  const [minMaxValues, setMinMaxValues] = useState(null);
  const [predictedTemperature, setPredictedTemperature] = useState(null);
  const [predictedHumidity, setPredictedHumidity] = useState(null);
  const [temperatureScatterData, setTemperatureScatterData] = useState(null);
  const [humidityScatterData, setHumidityScatterData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('measurements').select();

        if (error) {
          throw error;
        }

        setData(data);

        // Llamar a la función para crear y entrenar el modelo después de obtener los datos
        createAndTrainModel(data);
      } catch (error) {
        console.error('Error al obtener datos de Supabase:', error.message);
      }
    };

    fetchData();
  }, []); // Solo ejecutar una vez al montar el componente

  const createAndTrainModel = async (data) => {
    const temperatures = data.map((row) => row.temperature);
    const humidity = data.map((row) => row.humidity);
    const sampleNumbers = data.map((row, index) => index + 1); // Números de muestreo

    const { min: minHumidity, max: maxHumidity } = normalize(humidity);
    const { min: minTemperatures, max: maxTemperatures } = normalize(temperatures);

    setMinMaxValues({
      minHumidity,
      maxHumidity,
      minTemperatures,
      maxTemperatures,
    });

    // Realizar regresión lineal simple
    const slope = calculateSlope(humidity, temperatures);
    const intercept = calculateIntercept(humidity, temperatures);

    // También calcular pendiente e intersección para la humedad
    const slopeHumidity = calculateSlope(temperatures, humidity);
    const interceptHumidity = calculateIntercept(temperatures, humidity);

    setModel({ slope, intercept, slopeHumidity, interceptHumidity });

    // Crear datos para la gráfica de dispersión de temperatura
    const temperatureScatterData = {
      x: sampleNumbers,
      y: temperatures,
      mode: 'markers',
      type: 'scatter',
      name: 'Temperatura',
    };

    setTemperatureScatterData([temperatureScatterData]);

    // Crear datos para la gráfica de dispersión de humedad
    const humidityScatterData = {
      x: sampleNumbers,
      y: humidity,
      mode: 'markers',
      type: 'scatter',
      name: 'Humedad',
    };

    setHumidityScatterData([humidityScatterData]);
  };

  const calculateSlope = (x, y) => {
    const n = x.length;
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX = x.reduce((acc, xi) => acc + xi, 0);
    const sumY = y.reduce((acc, yi) => acc + yi, 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi ** 2, 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  };

  const calculateIntercept = (x, y) => {
    const n = x.length;
    const slope = calculateSlope(x, y);
    const sumX = x.reduce((acc, xi) => acc + xi, 0);
    const sumY = y.reduce((acc, yi) => acc + yi, 0);

    return (sumY - slope * sumX) / n;
  };

  const normalize = (array) => {
    const min = Math.min(...array);
    const max = Math.max(...array);

    const normalizedArray = array.map((value) => (value - min) / (max - min));

    return { min, max, normalizedArray };
  };

  const predictTemperatureAndHumidity = (inputHumidity) => {
    if (!model || !minMaxValues) return null;

    const { minHumidity, maxHumidity, minTemperatures, maxTemperatures } = minMaxValues;

    // Realizar la predicción de temperatura
    const predictionTemperature =
      model.slope * ((inputHumidity - minHumidity) / (maxHumidity - minHumidity)) +
      model.intercept;

    // Redondear la predicción de temperatura
    const roundedTemperature = Math.round(predictionTemperature);

    setPredictedTemperature(roundedTemperature);

    // Realizar la predicción de humedad
    const predictionHumidity =
      model.slopeHumidity * ((predictionTemperature - minTemperatures) / (maxTemperatures - minTemperatures)) +
      model.interceptHumidity;

    // Redondear la predicción de humedad
    const roundedHumidity = Math.round(predictionHumidity);

    setPredictedHumidity(roundedHumidity);
  };

  const handlePrediction = () => {
    const inputHumidity = 0.8; // Ingresa el valor de humedad que deseas predecir
    predictTemperatureAndHumidity(inputHumidity);
  };

  return (
    <div>
      <div>
        <h2>Pronóstico de Temperatura y Humedad</h2>
        <button onClick={handlePrediction}>Realizar Predicción</button>
        {predictedTemperature !== null && predictedHumidity !== null && (
          <div>
            <p>Predicción de Temperatura: {predictedTemperature} °C</p>
            <p>Predicción de Humedad: {predictedHumidity} %</p>
          </div>
        )}
        {temperatureScatterData && (
          <Plot
            data={temperatureScatterData}
            layout={{
              title: 'Gráfica de Temperatura',
              xaxis: { title: 'Número de Muestreo' },
              yaxis: { title: 'Temperatura' },
            }}
          />
        )}
        {humidityScatterData && (
          <Plot
            data={humidityScatterData}
            layout={{
              title: 'Gráfica de Humedad',
              xaxis: { title: 'Número de Muestreo' },
              yaxis: { title: 'Humedad' },
            }}
          />
        )}
      </div>
    </div>
  );
}
