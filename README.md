# Hydroponic Plant Monitoring System

This project is designed to monitor and optimize the growing conditions of a hydroponic system, focusing on critical factors like water quality, pH levels, and environmental data. The system integrates various sensors (TDS, ultrasonic level, and Bio-ExG) with real-time data collection, anomaly detection, forecasting, and a user-friendly dashboard.

## Features

- **Real-Time Monitoring**: Continuously tracks the water quality, TDS values, water level, and Bio-ExG sensor data.
- **Anomaly Detection**: Identifies abnormal values such as sudden changes in TDS or water level and alerts the user.
- **Forecasting**: Predicts the plant's growth environment using historical data trends.
- **User-Friendly Dashboard**: Provides an easy-to-navigate web interface for monitoring sensor data and system status in real-time.
- **Water Quality & Level Management**: Ensures optimal water quality and levels for maximum plant growth.

## Components

- **Arduino Uno**: Central microcontroller for sensor integration and data collection.
- **TDS Sensor**: Measures the total dissolved solids in the water to assess water quality.
- **Ultrasonic Level Sensor**: Monitors the water level in the hydroponic tank.
- **Bio-ExG Sensor**: Measures the bioelectrical signals of the plants.
- **Relay Module**: Controls the water pump for irrigation based on water level readings.

## Installation

### Hardware Setup

1. **Arduino Uno Setup**:
   - Connect the TDS sensor to pin `A0`.
   - Connect the ultrasonic sensor's Trigger and Echo pins to pins `12` and `11`, respectively.
   - Connect the Bio-ExG sensor to pin `A1`.
   - Connect the relay module for the pump to pin `8`.

2. **Relay and Pump Setup**:
   - Use a 12V or 5V pump and relay module to manage the water pump.
   - Ensure that the pump and relay are connected according to the specifications of your components.

### Software Setup

1. **Arduino Code**: 
   - Upload the provided Arduino sketch to the Arduino Uno using the Arduino IDE.
   
2. **Frontend and Backend Setup**:
   
   #### Clone the repository:
```
git clone https://github.com/msnabiel/Water-Quality-Monitor-Vegetable-Hydroponics.git
cd Water-Quality-Monitor-Vegetable-Hydroponics
```

#### Backend (Node.js Setup):

- Navigate to the `dashboard` folder:

  ```
  cd dashboard
  ```

- Install dependencies:

  ```
  npm install
  ```

- Start the backend server:

  ```
  node server.js
  ```

#### Frontend (React Setup):

- Navigate to the `dashboard` folder:

  ```
  cd dashboard
  ```

- Install dependencies:

  ```
  npm install
  ```

- Start the React development server:

  ```
  npm run dev
  ```

The frontend dashboard will be accessible at [http://localhost:3000](http://localhost:3000), and the backend WebSocket server will be running on [http://localhost:8080](http://localhost:8080).

## Usage

- **Real-Time Data**: The dashboard will display real-time sensor data such as TDS value, water level, and pump status.
- **Pump Control**: The pump is controlled based on the water level detected by the ultrasonic sensor. The relay will automatically turn the pump on or off as needed.

## Technologies Used

- **Arduino IDE**: For programming the Arduino.
- **Node.js**: Backend for communication between Arduino and frontend.
- **WebSocket**: Real-time data transmission.
- **React.js**: Frontend for the user dashboard.
- **Chart.js**: For visualizing sensor data on the dashboard.

## Future Enhancements

- **pH Monitoring**: Add a pH sensor to track the acidity of the water.
- **More Sensors**: Integrate environmental sensors like temperature, humidity, and light.
- **Mobile App**: Develop a mobile version of the dashboard for remote monitoring.

## License

This project is licensed under the MIT License.

