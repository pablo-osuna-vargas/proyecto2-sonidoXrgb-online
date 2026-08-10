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

  // Listar puertos disponibles
  serial.list();

  // Abrir el puerto correcto (ajustá el COM según tu Arduino)
  serial.openPort("COM3", { baudrate: 9600 });

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
  let sensor1 = parsInt(sensores[0], 10);
  let sensor2 = parsInt(sensores[1], 10);
  let sensor3 = parsInt(sensores[2]), 10;

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