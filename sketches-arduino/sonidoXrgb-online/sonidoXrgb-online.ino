void setup() {
  Serial.begin(9600);
}

void loop() {

  int pinPot0 = 0;
  int pinPot1 = 1;
  int pinPot2 = 2;

  for(int i = 0; i < 3; i++) {

    int lectura1 = map(analogRead(pinPot0), 0, 1023, 0, 255);
    int lectura2 = map(analogRead(pinPot1), 0, 1023, 0, 255);
    int lectura3 = map(analogRead(pinPot2), 0, 1023, 0, 255);

    Serial.print(lectura1);
    Serial.print(",");
    Serial.print(lectura2);
    Serial.print(",");
    Serial.println(lectura3);

  }
  delay(10);
}