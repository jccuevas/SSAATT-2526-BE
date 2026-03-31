/*
 * Fase 3 - Tarea 4 - Inserción del servicio de registro de usuarios
 * ASIGNATURA: Servicios y Aplicaciones Telemáticas
 * TITULACIÓN: Grado en Ingeniería de tecnologías de telecomunicación (14312020)
 * TITULACIÓN: Doble Grado Ing. de tecnologías de la telecomunicación e Ing. telemática (15212007)
 * TITULACIÓN: Grado en Ingeniería telemática (14512016)
 * CENTRO: ESCUELA POLITÉCNICA SUPERIOR (LINARES)
 * CURSO ACADÉMICO: 2025-2026
 * AUTOR: Juan Carlos Cuevas Martínez
 */

// Datos del servicio 
const VERSION = '1.0'; // Variable para indicar la versión del servicio
const SERVICE_NAME = 'Nombre del servicio'; // Reemplazar por el nombre del servicio de cada equipo
const SERVICE_PORT = 8081; // Puerto para el servicio HTTP

// Definición de códigos de estado que emplea la aplicación
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const STATUS_BADFORMAT = 400;
const STATUS_NOTFOUND = 404;
const STATUS_UNAUTHORIZED = 401;
const STATUS_FORBIDDEN = 403;
const STATUS_SERVER_ERROR = 500;

/* Módulos de Nonde.js para desplegar el servidor */
const os = require('node:os'); // Módulo de información relativa al sistema operativo y el host
const dns = require('node:dns'); // Módulo para emplear el servicio DNS

const express = require('express'); //Importación del paquete Express

const app = new express(); // Creación de la aplicación Express

app.use(express.json()) // Para procesar tipos de datos application/json. 
// Esto permite que en el objeto Request (req) se pueda emplear la propiedad req.body para 
// acceder a cada propiedad del cuerpo de la petición por su nombre.

const { MongoClient } = require("mongodb"); // Se importa MongoClient del paquete mongodb

// Definición de las constantes de la base de datos
const DB_URL = "mongodb://localhost:27017/"; //URL de la base de datos local MongoDB
const DB_NAME = "ssaatt"; // Puede cambiar el nombre al que desee y que mejor defina yo proyecto
const DB_USERS_COLLECTION = "users"; // Ponga el nombre de las colecciones MongoDB en plural.



//Primer endpoint - Punto de entrada genérico al servidor para guardar registro de las peticiones entrantes
app.use((req, res, next) => {
  console.log('[SERVIDOR] Petición entrante:' + req.method + ' ' + req.path);
  next();//Hace que se pase el proceso al siguiente endpoint que coincida
});

// API del servicio


/**
 * Tarea 4.2 Servicio POST /users
 * Inserta los datos de un usuario recibidos en la petición en formato JSON
 * en la base de datos, si su nombre de usuario no existe ya
 */
app.post("/users", function (req, res) {
  // Antes de proceder se debería validar que se han recibido los datos apropiados.
  console.dir(req.body);

  const client = new MongoClient(DB_URL); // Conexión con la base de datos MongoDB
  // El objeto client es el que se emplea para interactuar
  // con la base de datos.
  // No olvide cerrar la conexión al finalizar este endpoint
  // Para trabajar con la base de datos MongoDB es habitual definir una función asíncrona y lanzarla
  async function run() {
    try {
      const db = client.db(DB_NAME);
      const users = db.collection(DB_USERS_COLLECTION);

      // Esta condición se añade por si queremos evitar duplicidades de nombre de usuario
      const buscado = await users.countDocuments({ user: req.body.user }); //Se buscan las apariciones del usuario en la colección
      if (buscado !== 0) {
        //Usuario que ya existe
        console.log(
          `[SERVIDOR] El usuario ${req.body.user} ya existe en la base de datos`
        );
        res.status(STATUS_FORBIDDEN).end(); //Se responde con el código 403 forbidden
      } else {
        //El usuario a introducir no existe, por lo tanto se insertará
        const result = await users.insertOne(req.body); //Se insertan los datos del nuevo usuario en la colección
        console.log(`[SERVIDOR] Documento insertado con _id: ${result.insertedId}`);
        res.json({ _id: result.insertedId }); // Permite responder automáticamente con estado 200 y datos en JSON.
      }
    } finally {
      await client.close(); // Siempre debemos cerrar la conexión con la base de datos.
    }
  }

  //Se lanza la función asíncrona run() y se capturan los errores (excepciones) con el método catch.
  run().catch((ex) => {
    console.error("[SERVIDOR] POST /users: " + ex.toString());
    res.status(STATUS_SERVER_ERROR).end();
  });
});

// Último endpoint por defecto por si la petición no está en el API REST - Error 404
app.use((req, res) => {
  res.status(404).end();
})

console.log(`[SERVIDOR] Iniciando servidor HTTP sobre Node.js 
           Servicio ${SERVICE_NAME}
           Versión ${VERSION}           
-------------------------------------------------`)


// Este código emplea el módulo dns y el os para buscar la IP del host
dns.lookup(os.hostname(), 4, function (err, address, family) { // 4 para IPv4
  if (err) {
    console.error('[SERVIDOR] Error al obtener la IP del servidor.');
  } else {
    console.log('[SERVIDOR] IP del servidor: ' + address.toString());
    // Se inicia el servidor HTTP una vez se ha buscado la IP en el puerto prefijado
    app.listen(SERVICE_PORT, address.toString(), () => {
      console.log(`[SERVIDOR] Servidor ejecutándose en http://${address}:${SERVICE_PORT}`)
    })
  }
})