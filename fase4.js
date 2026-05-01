/*
 * Fase 4 - Aplicación REST con Node.js y MongoDB para la Fase 4 del proyecto de Servicios y Aplicaciones Telemáticas
 * ASIGNATURA: Servicios y Aplicaciones Telemáticas
 * TITULACIÓN: Grado en Ingeniería de tecnologías de telecomunicación (14312020)
 * TITULACIÓN: Doble Grado Ing. de tecnologías de la telecomunicación e Ing. telemática (15212007)
 * TITULACIÓN: Grado en Ingeniería telemática (14512016)
 * CENTRO: ESCUELA POLITÉCNICA SUPERIOR (LINARES)
 * CURSO ACADÉMICO: 2025-2026
 * AUTOR: Juan Carlos Cuevas Martínez
 */

// Datos del servicio
const APPLICATION_VERSION = "1.0"; // Variable para indicar la versión de la aplicación
const APPLICATION_NAME = "Nombre de la aplicación"; // Reemplazar por el nombre de la aplicación de cada equipo
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
const os = require("node:os"); // Módulo de información relativa al sistema operativo y el host
const dns = require("node:dns"); // Módulo para emplear el servicio DNS
//Tarea 1.1
const path = require("node:path"); // Módulo para trabajar con rutas de archivos y directorios

const express = require("express"); //Importación del paquete Express

const app = new express(); // Creación de la aplicación Express

//Tarea 1.1 - Se añade el middleware para servir los archivos estáticos de la carpeta "public" del proyecto
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.json()); // Para procesar tipos de datos application/json.
// Esto permite que en el objeto Request (req) se pueda emplear la propiedad req.body para
// acceder a cada propiedad del cuerpo de la petición por su nombre.

// Se eliminan las constantes de la base de datos que se han movido al endpoint correspondiente, ya que no se emplean en el resto del código del servidor HTTP, sino que solo se emplean en el endpoint de autenticación de usuarios. De esta forma, se mejora la modularidad del código y se evita la inclusión de código innecesario en el resto del servidor HTTP, lo que puede mejorar la eficiencia y la claridad del código.
//const { MongoClient, ObjectId } = require("mongodb"); // Se importa MongoClient del paquete mongodb

// Definición de las constantes de la base de datos
//const DB_URL = "mongodb://localhost:27017/"; //URL de la base de datos local MongoDB
//const DB_NAME = "ssaatt"; // Puede cambiar el nombre al que desee y que mejor defina yo proyecto
//const DB_USERS_COLLECTION = "users"; // Ponga el nombre de las colecciones MongoDB en plural.

//Primer endpoint - Punto de entrada genérico al servidor para guardar registro de las peticiones entrantes
app.use((req, res, next) => {
  console.log(
    `[${APPLICATION_NAME}] [${new Date().toISOString()}] Petición entrante: ${req.ip} ${req.method} ${req.path}`,
  );
  next(); //Hace que se pase el proceso al siguiente endpoint que coincida
});

// API del servicio
// Pendiente de definir los endpoints de la API REST del servicio. Se pueden definir tantos endpoints como se necesiten para el servicio, empleando los métodos HTTP adecuados (GET, POST, PUT, DELETE, etc.) y el formato de las rutas que se considere más adecuado para cada caso.
// Se debe emplear Router, no se deben incluir los endpoints directamente en el objeto app, sino que se deben definir en un objeto Router y luego incluirlo en el objeto app con el método use().

//Tarea 1.2 - Se incluye el endpoint de autenticación de usuarios en el servidor HTTP, empleando Router para modularizar el código del endpoint y mejorar la organización del código del servidor HTTP. Se debe crear un archivo para cada endpoint en la carpeta "routes" del proyecto, y luego incluirlo en el servidor HTTP con el método use() de Express, indicando la ruta del endpoint correspondiente.
// Este objeto permite tener un código más organizado y modular donde encontrar todos los endpoints del API REST del servicio
const API = {
  LOGIN: "/login", // Servicio de autenticación de usuarios
  USERS: "/users", // Servicio de gestión de usuarios
};

// Router para el endpoint de autenticación de usuarios
const loginRouter = require("./routes/f4_login"); // Se elige el archivo del endpoint de autenticación de usuarios, que se ha creado en la carpeta "routes" del proyecto, y se importa como un módulo para incluirlo en el servidor HTTP con el método use() de Express.
app.use(API.LOGIN, loginRouter); // Reemplazar por la ruta del endpoint de cada equipo

//Router para la gestión de usuarios
const usersRouter = require("./routes/f4_users"); // Se elige el archivo del endpoint de gestión de usuarios, que se ha creado en la carpeta "routes" del proyecto, y se importa como un módulo para incluirlo en el servidor HTTP con el método use() de Express.
app.use(API.USERS, usersRouter); // Reemplazar por la ruta del endpoint de cada equipo

// Último endpoint por defecto por si la petición no está en el API REST - Error 404
app.use((req, res) => {
  res.status(404).end();
});

console.log(`[${APPLICATION_NAME}] Iniciando servidor HTTP sobre Node.js 
           Versión ${APPLICATION_VERSION}           
-------------------------------------------------`);

// Este código emplea el módulo dns y el os para buscar la IP del host
dns.lookup(os.hostname(), 4, function (err, address, family) {
  // 4 para IPv4
  if (err) {
    console.error(`[${APPLICATION_NAME}] Error al obtener la IP del servidor.`);
  } else {
    console.log(`[${APPLICATION_NAME}] IP del servidor: ${address.toString()}`);
    // Se inicia el servidor HTTP una vez se ha buscado la IP en el puerto prefijado
    app.listen(SERVICE_PORT, address.toString(), (error) => {
      if (error) {
        console.error(`[${APPLICATION_NAME}] Error al inicializar: ${error}`);
      } else {
        console.log(
          `[${APPLICATION_NAME}] Servidor ejecutándose en http://${address}:${SERVICE_PORT}`,
        );
      }
    });
  }
});
