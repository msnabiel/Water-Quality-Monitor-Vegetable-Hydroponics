# Monitoring Water Quality in Vegetable Hydroponics using Arduino Microcontroller


#### Table of Contents
- [Introduction](#introduction)
- [Components Required](#components-required)
- [System Overview](#system-overview)
- [Sensors and Hardware Setup](#sensors-and-hardware-setup)
- [Software Requirements](#software-requirements)
- [Installation and Setup](#installation-and-setup)
- [Code Explanation](#code-explanation)
- [Circuit Layout](#Basic-Circuit-Layout)
- [How to Use](#how-to-use)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [References](#references)

---

### Introduction

This project monitors the water quality in a vegetable hydroponics system using an Arduino microcontroller. It measures key water parameters such as pH level, temperature, and electrical conductivity (EC), helping you maintain an optimal environment for plant growth. The real-time data is displayed on an LCD screen, and optional features include data logging and alerts.

---

### Components Required

- **Arduino UNO** (or any other compatible board)
- **pH sensor** (Analog)
- **Temperature sensor** (DS18B20 or DHT11)
- **EC sensor** (Electrical Conductivity)
- **LCD Display** (16x2 or 20x4 with I2C module)
- **Breadboard & Jumper Wires**
- **Resistors and Capacitors** (optional for signal stability)
- **Power Supply** (5V or USB)
- **Optional**: SD card module for data logging, buzzer/LED for alerts

---

### System Overview

The Arduino will collect water quality data from the sensors and display the readings on an LCD screen. The system can monitor the following parameters:
- **pH**: Measures the acidity or alkalinity of the water.
- **Temperature**: Ensures optimal temperature conditions for plant growth.
- **EC (Electrical Conductivity)**: Measures the nutrient concentration in the water.

This system can help you automate the monitoring process, ensuring that the water conditions are always ideal for your hydroponic setup.

---

### Sensors and Hardware Setup

1. **pH Sensor:**
   - Connect the pH sensor's analog output to one of the Arduino's analog pins (e.g., A0).
   - Calibrate the sensor using pH buffer solutions before deployment.
   
2. **Temperature Sensor (DS18B20):**
   - Use a digital pin (e.g., D2) to connect the temperature sensor.
   - Ensure the sensor is waterproof if placed in the water.

3. **EC Sensor:**
   - Connect the EC sensor to another analog pin (e.g., A1).
   - Calibrate using a solution with known conductivity for accuracy.

4. **LCD Display:**
   - Connect the I2C module to the Arduino (SDA to A4, SCL to A5).
   - Alternatively, use parallel connections if not using an I2C module.

---

### Software Requirements

- **Arduino IDE** (version 1.8 or higher)
- **pH Sensor library** (if required)
- **OneWire and DallasTemperature libraries** (for DS18B20)
- **LiquidCrystal_I2C library** (for LCD display)
- **EC sensor calibration code** (optional, based on your sensor)

---

### Installation and Setup

1. **Install Arduino IDE:**
   Download and install the Arduino IDE from [here](https://www.arduino.cc/en/software).

2. **Install Necessary Libraries:**
   - Open Arduino IDE.
   - Go to **Sketch > Include Library > Manage Libraries**.
   - Install the following libraries:
     - `OneWire`
     - `DallasTemperature`
     - `LiquidCrystal_I2C`

3. **Connect the Hardware:**
   - Follow the hardware setup mentioned above to connect the sensors and display.

4. **Upload the Code:**
   - Connect your Arduino to your PC via USB.
   - Open the `.ino` code file in Arduino IDE.
   - Select the correct board (Arduino UNO) and port under **Tools > Board** and **Tools > Port**.
   - Upload the code by clicking on the upload button.

---

### Circuit Layout

1. **pH Sensor**:
   - **VCC** → Arduino **5V**
   - **GND** → Arduino **GND**
   - **Signal (Analog Out)** → Arduino **A0**

2. **EC Sensor**:
   - **VCC** → Arduino **5V**
   - **GND** → Arduino **GND**
   - **Signal (Analog Out)** → Arduino **A1**

3. **DS18B20 Temperature Sensor**:
   - **VCC** → Arduino **5V**
   - **GND** → Arduino **GND**
   - **Data** → Arduino **Pin 2**
   - **10kΩ resistor** between **Data** and **VCC**

4. **16x2 LCD with I2C Module**:
   - **VCC** → Arduino **5V**
   - **GND** → Arduino **GND**
   - **SDA** → Arduino **A4**
   - **SCL** → Arduino **A5**

---

### Basic Circuit Layout

```
Arduino UNO:

+-------------------+                     +-----------+
|                   |                     |           |
|  A0 (pH Sensor)    |<------------------> |  pH Sensor|
|  A1 (EC Sensor)    |<------------------> |  EC Sensor|
|                   |                     |           |
|  Pin 2 (Temp)      |<------------------> |  DS18B20  |
|                   |                     | (Temp Sensor)
|                   |                     +-----------+
|  A4 (SDA)          |<------------------> |  LCD I2C  |
|  A5 (SCL)          |<------------------> |  Display  |
|                   |                     +------------+
|  5V                |<------------------> Power (All Sensors)
|  GND               |<------------------> Ground (All Sensors)
+-------------------+
```



### Code Explanation

```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Pin configurations
#define PH_PIN A0
#define EC_PIN A1
#define TEMPERATURE_PIN 2

LiquidCrystal_I2C lcd(0x27, 16, 2);
OneWire oneWire(TEMPERATURE_PIN);
DallasTemperature sensors(&oneWire);

void setup() {
  lcd.begin(16, 2);
  lcd.backlight();
  
  sensors.begin();  // Start temperature sensor
  lcd.print("Initializing...");
  delay(2000);
}

void loop() {
  float phValue = readPH();
  float ecValue = readEC();
  float tempValue = readTemperature();
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("pH: ");
  lcd.print(phValue);
  
  lcd.setCursor(0, 1);
  lcd.print("EC: ");
  lcd.print(ecValue);
  
  delay(5000);
}

float readPH() {
  // Add code to read and return the pH value
  return analogRead(PH_PIN) * (5.0 / 1023.0);  // Placeholder
}

float readEC() {
  // Add code to read and return the EC value
  return analogRead(EC_PIN) * (5.0 / 1023.0);  // Placeholder
}

float readTemperature() {
  sensors.requestTemperatures(); 
  return sensors.getTempCByIndex(0);
}
```

### How to Use

1. **Power the System:**
   Plug in the Arduino to a power source (USB or external).

2. **Display Monitoring:**
   View real-time water quality readings on the LCD screen.

3. **Calibration:**
   Calibrate the sensors as per the manufacturer's instructions for accurate readings.

4. **Data Logging (Optional):**
   Add an SD card module and modify the code to log data to an SD card for historical analysis.

---

### Troubleshooting

- **Incorrect Sensor Readings:**
  - Double-check wiring connections and sensor calibration.
  - Ensure the sensors are compatible with Arduino analog and digital inputs.
  
- **LCD Display Issues:**
  - Verify that the correct I2C address is used for the LCD.
  - Ensure the I2C connections (SDA and SCL) are properly made.

- **No Temperature Reading:**
  - Check the connection of the temperature sensor and ensure that the OneWire and DallasTemperature libraries are correctly installed.

---

### Future Improvements

- Add Wi-Fi connectivity using an ESP8266 module for remote monitoring.
- Implement alerts using a buzzer or LEDs for abnormal water conditions.
- Incorporate a mobile app for live data viewing and notifications.

---

### References

1. **Arduino Official Website**: [https://www.arduino.cc](https://www.arduino.cc)
2. **pH Sensor Documentation**:
   - If you are using a standard analog pH sensor, like the **Gravity Analog pH Sensor**, the documentation can be found here:
     - [Gravity pH Sensor Documentation](https://wiki.dfrobot.com/Gravity__Analog_pH_Sensor_Meter_Kit_V2_SKU__SEN0161_V2)
   
3. **EC (Electrical Conductivity) Sensor Documentation**:
   - For the **Gravity Analog Electrical Conductivity Meter**, you can refer to the following:
     - [Gravity EC Sensor Documentation](https://wiki.dfrobot.com/Analog_EC_Meter_SKU__SEN0169)
   
4. **DS18B20 Temperature Sensor Documentation**:
   - The **DS18B20 Waterproof Digital Temperature Sensor** has detailed documentation here:
     - [DS18B20 Sensor Documentation](https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf)
   
5. **LCD Display with I2C Module Documentation**:
   - For connecting and using the I2C 16x2 LCD with Arduino, refer to:
     - [I2C LCD Documentation](https://lastminuteengineers.com/i2c-lcd-arduino-tutorial/)
   
---

This project will help ensure that your vegetable hydroponics system remains healthy and productive with minimal manual effort.
