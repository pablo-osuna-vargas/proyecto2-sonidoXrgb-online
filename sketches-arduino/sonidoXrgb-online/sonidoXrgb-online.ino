int ledPin = 9; // pin PWM

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  analogWrite(ledPin, 200); // duty cycle 50% → ~2.5 V promedio
}
