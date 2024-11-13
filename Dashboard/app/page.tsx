"use client"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { LeafIcon, TrendingUp } from "lucide-react"
import React from 'react';
import { Button } from '@/components/ui/button';

const HydroponicDashboard = () => {
  const [tdsData, setTdsData] = useState<number[]>([])
  const [bioExgData, setBioExgData] = useState<number[]>([]) // Changed from pH to Bio-ExG
  const [waterLevelData, setWaterLevelData] = useState<number[]>([])
  const [timeSeconds, setTimeSeconds] = useState<number[]>([])

  const [currentTds, setCurrentTds] = useState<number>(0)
  const [currentBioExg, setCurrentBioExg] = useState<number>(0) // Changed from pH to Bio-ExG
  const [currentWaterLevel, setCurrentWaterLevel] = useState<number>(0)
  const [currentPumpStatus, setCurrentPumpStatus] = useState<string>('OFF') // Pump status (ON/OFF)

  const [counter, setCounter] = useState(0)

  const handleDownload = () => {
    const reportUrl = 'https://raw.githubusercontent.com/msnabiel/Water-Quality-Monitor-Vegetable-Hydroponics/main/SensorReview.pdf';
    const link = document.createElement('a');
    link.href = reportUrl;
    link.download = 'SensorReview.pdf'; // Optional: specify download filename
    link.click();
  };

  // Simple Z-Score anomaly detection for TDS and Bio-ExG
  const calculateZScore = (value: number, mean: number, stdDev: number) => {
    return (value - mean) / stdDev;
  }

  const detectAnomalies = (data: number[], threshold: number = 3) => {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
    
    return data.map((value, index) => {
      const zScore = calculateZScore(value, mean, stdDev);
      return Math.abs(zScore) > threshold ? { index, value, zScore } : null;
    }).filter(item => item !== null);
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to WebSocket server UseEffect.");
    };
    ws.onmessage = (event) => {
      const rawData = event.data;
      console.log("Raw data:", rawData);
      const data = JSON.parse(rawData);
      console.log(data); // Check the data here

      // Update current readings
      setCurrentTds(data.tds);
      setCurrentBioExg(data.bioExg);  // Update Bio-ExG value
      setCurrentWaterLevel(data.waterLevel);
      setCurrentPumpStatus(data.pumpStatus); // Update pump status

      // Update chart data
      setTdsData((prev) => [...prev.slice(-9), data.tds]);
      setBioExgData((prev) => [...prev.slice(-9), data.bioExg]);  // Update Bio-ExG chart data
      setWaterLevelData((prev) => [...prev.slice(-9), data.waterLevel]);
      setTimeSeconds((prev) => [...prev.slice(-9), counter]);

      // Increment the counter for the time axis
      setCounter((prev) => prev + 1);
    };

    return () => {
      ws.close();
    };
  }, [counter]);

  // Prepare the data for the charts, map the time with TDS, BioExG, and Water Level
  const chartData = timeSeconds.map((time, index) => ({
    time,
    tds: tdsData[index],
    bioExg: bioExgData[index],
    waterLevel: waterLevelData[index],
  })).filter(Boolean)

  // Simple Linear Regression for forecasting TDS and Water Level
  const linearRegression = (data: number[]) => {
    const n = data.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = data;
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += (xValues[i] - xMean) ** 2;
    }
    
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;
    
    // Forecast the next value
    const forecast = slope * n + intercept;
    return forecast;
  }

  const forecastTds = linearRegression(tdsData);
  const forecastWaterLevel = linearRegression(waterLevelData);

  // Detect anomalies for TDS and BioExG
  const tdsAnomalies = detectAnomalies(tdsData);
  const bioExgAnomalies = detectAnomalies(bioExgData);

  return (
    <div className="bg-black text-white p-5 min-h-screen overflow-x-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Hydroponic Plant Monitoring Dashboard</CardTitle>
          <CardDescription className="text-center">Real-time monitoring of TDS, Bio-ExG values, and water levels for a hydroponic plant</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-left font-bold">Current Readings</h2>
          <div className="flex flex-wrap justify-between mt-4">
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">TDS (ppm):</span> {currentTds.toFixed(2)}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Bio-ExG Pill:</span> {currentBioExg.toFixed(2)} {/* Display Bio-ExG */}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Water Level (cm):</span> {currentWaterLevel.toFixed(2)}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Pump Status:</span> {currentPumpStatus} {/* Display pump status */}
            </div>
          </div>

          {/* Graphs Container */}
          <div className="flex flex-wrap justify-between mt-4">
            {/* Chart for TDS */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4">
              <h3 className="text-center font-bold">TDS Over Time</h3>
              <div className="overflow-hidden">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={chartData.map(({ time, tds }) => ({ time, tds })).filter(Boolean)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      label={{ value: 'Seconds', position: 'insideBottom', offset: -25, textAnchor: 'middle' }}
                    />
                    <YAxis
                      label={{ value: 'TDS (ppm)', angle: -90, position: 'insideLeft', offset: 0 }} // Set offset to 0 for consistency
                    />
                    <Area type="monotone" dataKey="tds" fill="blue" stroke="blue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart for BioExG */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4">
              <h3 className="text-center font-bold">Bio-ExG Over Time</h3>
              <div className="overflow-hidden">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={chartData.map(({ time, bioExg }) => ({ time, bioExg })).filter(Boolean)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      label={{ value: 'Seconds', position: 'insideBottom', offset: -25, textAnchor: 'middle' }}
                    />
                    <YAxis
                      label={{ value: 'Bio-ExG', angle: -90, position: 'insideLeft', offset: 0 }} // Set offset to 0 for consistency
                    />
                    <Area type="monotone" dataKey="bioExg" fill="purple" stroke="purple" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart for Water Level */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4">
              <h3 className="text-center font-bold">Water Level Over Time</h3>
              <div className="overflow-hidden">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={chartData.map(({ time, waterLevel }) => ({ time, waterLevel })).filter(Boolean)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      label={{ value: 'Seconds', position: 'insideBottom', offset: -25, textAnchor: 'middle' }}
                    />
                    <YAxis
                      label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft', offset: 0 }} // Set offset to 0 for consistency
                    />
                    <Area type="monotone" dataKey="waterLevel" fill="orange" stroke="orange" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Sensors Hydroponics Project <LeafIcon className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                November 2024
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* New Card for Z-Score and Linear Forecasting */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-center">Anomalies & Forecasting</CardTitle>
          <CardDescription className="text-center">Anomaly detection for TDS and Bio-ExG, and forecasts for TDS and Water Level</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-left font-bold">Anomaly Detection (Z-Score)</h3>
          <div className="flex flex-wrap justify-between mt-4">
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">TDS Anomalies:</span> {tdsAnomalies.length > 0 ? "Yes" : "No"}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Bio-ExG Anomalies:</span> {bioExgAnomalies.length > 0 ? "Yes" : "No"}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Forecasted TDS:</span> {forecastTds.toFixed(2)}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Forecasted Water Level:</span> {forecastWaterLevel.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col items-center justify-center gap-4 p-8">
            <p className="text-lg font-medium text-center">
                Get a detailed project report with all insights and analyses.
            </p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={handleDownload} className="text-black">
                    Download Project Report
                </Button>
                <a href="https://github.com/msnabiel/Water-Quality-Monitor-Vegetable-Hydroponics" target="_blank" rel="noopener noreferrer">
                    <Button>
                        <GitHubLogoIcon className="mr-2" /> View on GitHub
                    </Button>
                </a>
            </div>
        </div>
    </div>
  )
}

export default HydroponicDashboard;