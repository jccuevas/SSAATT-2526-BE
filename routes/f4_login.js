/*
 * Fase 4 - Tarea 1.2 - Endpoint /login - autenticación de usuarios
 * ASIGNATURA: Servicios y Aplicaciones Telemáticas
 * TITULACIÓN: Grado en Ingeniería de tecnologías de telecomunicación (14312020)
 * TITULACIÓN: Doble Grado Ing. de tecnologías de la telecomunicación e Ing. telemática (15212007)
 * TITULACIÓN: Grado en Ingeniería telemática (14512016)
 * CENTRO: ESCUELA POLITÉCNICA SUPERIOR (LINARES)
 * CURSO ACADÉMICO: 2025-2026
 * AUTOR: Juan Carlos Cuevas Martínez
 */

// Datos del servicio
const SERVICE_NAME = "login";
const SERVICE_ROOT = "/"; // Ruta raíz del servicio, que se emplea para montar el router Express del endpoint de gestión de usuarios en el servidor HTTP. Reemplazar por la ruta del endpoint de cada equipo, por ejemplo "/users" o "/api/users", etc.
// Definición de códigos de estado que emplea la aplicación
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const STATUS_BADFORMAT = 400;
const STATUS_NOTFOUND = 404;
const STATUS_UNAUTHORIZED = 401;
const STATUS_FORBIDDEN = 403;
const STATUS_SERVER_ERROR = 500;

// Definición de las constantes de la base de datos
const DB_URL = "mongodb://localhost:27017/"; //URL de la base de datos local MongoDB
const DB_NAME = "ssaatt"; // Puede cambiar el nombre al que desee y que mejor defina yo proyecto
const DB_USERS_COLLECTION = "users"; // Ponga el nombre de las colecciones MongoDB en plural.

const { MongoClient } = require("mongodb"); // Se importa MongoClient del paquete mongodb

// Creación del router Express
var express = require("express");
var router = express.Router();

// Endpoint de autenticación de usuarios POST /login
router.post(SERVICE_ROOT, (req, res) => {
  if (req.body != undefined) {
    console.dir(req.body);
    //Antes de acceder a cada propiedad se debería comprobar su existencia como con express-validator
    //Además de sanear la entrada y comprobar longitudes máximas para evitar ataques de inyección y otros posibles ataques, pero esto se ha omitido para simplificar el ejemplo
    if (req.body.user === undefined || req.body.password === undefined) {
      //No se cumple el formato esperado
      console.log(
        `${SERVICE_NAME} - Formato de datos incorrecto en la petición de autenticación: `
      );
      res.status(STATUS_BADFORMAT).end();
    } else {
      // Solo en el caso de tener los datos necesarios para la autenticación se ejecuta la función asíncrona que accede a la base de datos,
      // para evitar ejecutar código innecesario en el caso de que el formato de los datos no sea correcto
      run().catch((error) => {
        console.error(
          `${SERVICE_NAME} - Error en la autenticación de usuarios:`,
          error
        );
        res.status(STATUS_SERVER_ERROR).end();
      });
    }
  } else {
    //No se cumple el formato esperado
    res.status(STATUS_BADFORMAT).end();
  }

  async function run() {
    const cliente = new MongoClient(DB_URL);
    const db = cliente.db(DB_NAME);
    const usersCollection = db.collection(DB_USERS_COLLECTION);
    const user = await usersCollection.findOne({ user: req.body.user });
    if (user != null) {
      // Se ha encontrado un usuario con el nombre de usuario proporcionado en la base de datos
      if (user.password === req.body.password) {
        // La clave proporcionada coincide con la clave almacenada en la base de datos para ese usuario
        // Recuerde: las comprobaciones de autenticación no se hacen nunca con la clave en claro
        // ya que esta debería estar almacenada de forma segura en la base de datos, como por ejemplo con un hash de la clave y una sal,
        // este es solo un ejemplo para comprobar el funcionamiento del endpoint
        console.log(
          `${SERVICE_NAME} - Autenticación correcta para el usuario ${req.body.user}`
        );
        res.json({ id: user._id });
      } else {
        // La clave proporcionada no coincide con la clave almacenada en la base de datos para ese usuario
        // Nunca se informa al cliente de si el error se debe a que el usuario no existe o a que la clave es incorrecta, para evitar dar pistas a posibles atacantes
        console.log(
          `${SERVICE_NAME} - Autenticación fallida para el usuario ${req.body.user}`
        );
        res.status(STATUS_UNAUTHORIZED).end();
      }
    } else {
      // No se ha encontrado ningún usuario con el nombre de usuario proporcionado en la base de datos
      // Nunca se informa al cliente de si el error se debe a que el usuario no existe o a que la clave es incorrecta, para evitar dar pistas a posibles atacantes
      console.log(`${SERVICE_NAME} - Usuario no encontrado: ${req.body.user}`);
      res.status(STATUS_UNAUTHORIZED).end();
    }
  }
});

// Exportación del router para que pueda ser empleado en el servidor HTTP
module.exports = router;
