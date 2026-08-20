let started = false;
let serial;

let r = 0;
let g = 0;
let b = 0;

let oscR, oscG, oscB;

function setup() {
  createCanvas(windowWidth, windowHeight);

  oscR = new p5.Oscillator('sine');
  oscG = new p5.Oscillator('sine');
  oscB = new p5.Oscillator('sine');

  oscR.amp(0); oscR.freq(400);
  oscG.amp(0); oscG.freq(496);
  oscB.amp(0); oscB.freq(592);

  // Conexión al servidor de p5.serialcontrol
  serial = new p5.SerialPort();
  console.log(serial);

  // Listar puertos disponibles
  serial.list();

  // Abrir desde URL proporcionada por ngrok
  serial.openSocket("wss://stream-delusion-shaky.ngrok-free.dev");

  // Callback cuando llegan datos
  serial.on('data', gotData);
}

function gotData() {
  let datosSerial = serial.readLine(); // lee una línea completa
  if (!datosSerial) return;
  recibirDatosArduino(datosSerial);
}

function draw() {
  background(r, g, b); 
}

function recibirDatosArduino(datosSerial) {
  let sensores = datosSerial.split(',');
  // Convertimos lecturas a números
  let sensor1 = Number(sensores[0]);
  let sensor2 = Number(sensores[1]);
  let sensor3 = Number(sensores[2]);

  console.log("datos Arduino:", sensor1, sensor2, sensor3);

  r = sensor1;
  g = sensor2;
  b = sensor3;

  oscR.amp(map(sensor1, 0, 255, 0, 0.3));
  oscG.amp(map(sensor2, 0, 255, 0, 0.3));
  oscB.amp(map(sensor3, 0, 255, 0, 0.3));
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    oscR.start();
    oscG.start();
    oscB.start();
    console.log("Audio activado en navegador");
  }
}