#include <NewPing.h>

#define TDS_SENSOR_PIN A0       // Pin for TDS sensor (analog)
#define TRIGGER_PIN 12          // Trigger pin for ultrasonic sensor
#define ECHO_PIN 11             // Echo pin for ultrasonic sensor
#define PUMP_RELAY_PIN 8        // Relay pin for water pump
#define BIO_EXG_SENSOR_PIN A1   // Pin for Bio-ExG sensor (analog)

// Constants for ultrasonic sensor
#define MAX_DISTANCE 200        // Maximum distance in cm

// Setup for ultrasonic sensor
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

void setup() {
  Serial.begin(9600);                // Start serial communication for debugging
  pinMode(PUMP_RELAY_PIN, OUTPUT);   // Set relay pin as output
  digitalWrite(PUMP_RELAY_PIN, LOW); // Initially turn off the pump
}

void loop() {
  // Read the TDS sensor value (total dissolved solids)
  int tdsValue = analogRead(TDS_SENSOR_PIN);
  float voltage = tdsValue * (5.0 / 1023.0);  // Convert the analog value to voltage

  // Read the water level using the ultrasonic sensor
  long duration = sonar.ping();           // Get ping duration
  long distance = duration / 2 / 29.1;    // Calculate distance in cm

  // Read the Bio-ExG sensor value
  int bioExgValue = analogRead(BIO_EXG_SENSOR_PIN);
  float bioExgVoltage = bioExgValue * (5.0 / 1023.0);  // Convert to voltage (optional, or you could scale it as needed)

  // Determine pump status
  String pumpStatus;
  if (distance < 10) {                    // Adjust threshold based on setup
    digitalWrite(PUMP_RELAY_PIN, HIGH);   // Turn on the pump
    pumpStatus = "ON";
  } else {
    digitalWrite(PUMP_RELAY_PIN, LOW);    // Turn off the pump
    pumpStatus = "OFF";
  }

  // Print data in comma-separated format without warning
  Serial.print(voltage, 2);               // TDS voltage with 2 decimal places
  Serial.print(",");
  Serial.print(distance);                 // Water level in cm
  Serial.print(",");
  Serial.print(pumpStatus);               // Pump status (ON/OFF)
  Serial.print(",");
  Serial.println(bioExgVoltage, 2);       // Bio-exg value (optional: can be converted to desired unit)

  delay(1000);  // Delay for 1 second before the next loop
}
