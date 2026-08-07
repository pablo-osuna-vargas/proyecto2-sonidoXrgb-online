let started = false;

let r = 0;
let g = 0;
let b = 0;

// Variables globales para los osciladores
let oscR, oscG, oscB;

// 1. DECLARAR EL SOCKET AFUERA (Global)
let socket;

// COPIA AQUÍ LA URL COMPLETA QUE TE ENTREGUE NGROK (debe empezar con https://)
const URL_NGROK = 'https://stream-delusion-shaky.ngrok-free.dev';

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Inicializar los 3 osciladores de forma segura dentro de setup
  oscR = new p5.Oscillator('sine');
  oscG = new p5.Oscillator('sine');
  oscB = new p5.Oscillator('sine');

  oscR.start(); oscR.amp(0); oscR.freq(400);
  oscG.start(); oscG.amp(0); oscG.freq(496);
  oscB.start(); oscB.amp(0); oscB.freq(592);

  // 2. LLAMAR A LA CONEXIÓN (La función ahora vive afuera)
  conectarBridge();
}

// 3. LA FUNCIÓN DE CONEXIÓN VIVE AFUERA DE SETUP
function conectarBridge() {
  // Usamos 'io' (de socket.io) que es la librería que instalamos en el server.js
  socket = io(URL_NGROK);

  // Escuchamos el evento directo 'lectura-sensores' que configuramos en Node
  socket.on('lectura-sensores', (data) => {
    // 'data' es el string con espacios que viene del Arduino, ej: "255 120 80"
    recibirDatosArduino(data);
  });

  socket.on('disconnect', () => {
    console.log("Desconectado del puente. Buscando reconexión...");
  });
}

// acá empieza sketch p5 //
function draw() {
  background(r, g, b); 
}

function recibirDatosArduino(datosSerial) {
  let sensores = datosSerial.split(' ');
  // Convertimos las lecturas de texto a números
  // Asegúrate de que tu Arduino mapee o entregue valores entre 0 y 255 para los colores
  let sensor1 = Number(sensores[0]); // Primer número (Rojo)
  let sensor2 = Number(sensores[1]); // Segundo número (Verde)
  let sensor3 = Number(sensores[2]); // Tercer número (Azul)

  // Imprime en la consola del explorador (F12) solo para verificar que estén entrando
  console.log("Lecturas del Arduino:", sensor1, sensor2, sensor3);

  // --- MODULACIÓN VISUAL (Variables del background) ---
  r = sensor1;
  g = sensor2;
  b = sensor3;
/*
  // --- MODULACIÓN DE AUDIO NATIVA ---
  // Mapeamos el valor (0-255) a volumen (0 a 0.3) para evitar saturar el navegador.
  // El parámetro 0.05 suaviza las transiciones de audio evitando clicks digitales.
  oscR.amp(map(sensor1, 0, 255, 0, 0.3), 0.05);
  oscG.amp(map(sensor2, 0, 255, 0, 0.3), 0.05);
  oscB.amp(map(sensor3, 0, 255, 0, 0.3), 0.05);
*/

  oscR.amp(sensor1, 0, 255, 0, 0.3);
  oscG.amp(sensor2, 0, 255, 0, 0.3);
  oscB.amp(sensor3, 0, 255, 0, 0.3);

// 4. DESBLOQUEO DE AUDIO (Obligatorio para que suene al hacer click)
function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("Audio activado en el navegador");
  }
}