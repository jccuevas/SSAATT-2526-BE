/*
 * Fase 3 - Tarea 2 - Aplicación básica con servicio login
 * Variación: emplea express-validator para validar el formato de los datos de entrada
 * ASIGNATURA: Servicios y Aplicaciones Telemáticas
 * TITULACIÓN: Grado en Ingeniería de tecnologías de telecomunicación (14312020)
 * TITULACIÓN: Doble Grado Ing. de tecnologías de la telecomunicación e Ing. telemática (15212007)
 * TITULACIÓN: Grado en Ingeniería telemática (14512016)
 * CENTRO: ESCUELA POLITÉCNICA SUPERIOR (LINARES)
 * CURSO ACADÉMICO: 2025-2026
 * AUTOR: Juan Carlos Cuevas Martínez
 */

// Datos del servicio
const VERSION = "1.0"; // Variable para indicar la versión del servicio
const SERVICE_NAME = "Nombre del servicio"; // Reemplazar por el nombre del servicio de cada equipo
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

const express = require("express"); //Importación del paquete Express
const app = new express(); // Creación de la aplicación Express
app.use(express.json()); // Para procesar tipos de datos application/json.
// Esto permite que en el objeto Request (req) se pueda emplear la propiedad req.body para
// acceder a cada propiedad del cuerpo de la petición por su nombre.

//Importación de express-validator para validar el formato de los datos de entrada
const { body, validationResult } = require("express-validator");

//Primer endpoint - Punto de entrada genérico al servidor para guardar registro de las peticiones entrantes
//Además se controlan los errores de JSON inválido en el cuerpo de la petición con un middleware específico para capturar estos errores y devolver un error 400 con un mensaje que incluye el error de JSON inválido
app.use((err, req, res, next) => {
  console.log("[SERVIDOR] Petición entrante:" + req.method + " " + req.path);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.dir(err);
    console.error("[SERVIDOR] Error en la petición:" + err.message);
    return res.status(400).json({
      message: "JSON inválido en la petición",
      error: err.message,
    });
  }
  next();
});

// Middelware de validación genérica del API del servicio con express-validator. Se emplea en cada endpoint para capturar los errores de validación y devolver un error 400 con un mensaje que incluye estos errores
const generalStatus400Validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Si hay errores, significa que no se cumple el formato esperado y se captura la petición.
    // Se devuelve un error 400 con un mensaje que incluye los errores de validación
    // El mensaje de error es opcional, pero es recomendable incluirlo para facilitar la depuración y el uso de la API por parte de los clientes
    return res.status(400).json({
      message: "Datos inválidos",
      errors: errors.array().map((err) => err.msg),
    });
  }
  // Si no hay errores, se llama a next() para pasar al siguiente middleware o endpoint que coincida
  next();
};

const validateLogin = [
  body("user")
    .exists()
    .withMessage("No hay user")
    .isString()
    .withMessage("El campo user debe ser una cadena de texto")
    .trim()
    .isLength({ min: 4, max: 32 })
    .withMessage("El campo user debe tener entre 4 y 32 caracteres"),
  body("password")
    .exists()
    .withMessage("No hay password")
    .isString()
    .withMessage("El campo password debe ser una cadena de texto")
    .trim()
    .isLength({ min: 4, max: 32 })
    .withMessage("El campo password debe tener entre 4 y 32 caracteres"),
];

/*Servicio de autenticación POST /login
datos:
{
    "user": nombre de usuario,
    "password": clave del usuario
}
*/
app.post(
  "/login",
  validateLogin,
  (req, res, next) => generalStatus400Validator(req, res, next),
  (req, res) => {
    // Se simula la autenticación con un usuario y contraseña prefijados
    try {
      if (req.body.user === "user" && req.body.password === "1234") {
        // Autenticación correcta
        res.status(STATUS_OK).end();
      } else {
        // Error en la autenticación
        res.status(STATUS_UNAUTHORIZED).end();
      }
    } catch (error) {
      console.error("[SERVIDOR] Error al procesar la petición: " + error);
      res.status(STATUS_SERVER_ERROR).end();
    }
  },
);

// Último endpoint por defecto por si la petición no está en el API REST - Error 404
app.use((req, res) => {
  res.status(STATUS_NOTFOUND).end();
});

console.log(`[SERVIDOR] Iniciando servidor HTTP sobre Node.js 
           Servicio ${SERVICE_NAME}
           Versión ${VERSION}           
-------------------------------------------------`);

// Este código emplea el módulo dns y el os para buscar la IP del host
dns.lookup(os.hostname(), 4, function (err, address, family) {
  // 4 para IPv4
  if (err) {
    console.error("[SERVIDOR] Error al obtener la IP del servidor.");
  } else {
    console.log("[SERVIDOR] IP del servidor: " + address.toString());
    // Se inicia el servidor HTTP una vez se ha buscado la IP en el puerto prefijado
    app.listen(SERVICE_PORT, address.toString(), () => {
      console.log(
        `[SERVIDOR] Servidor ejecutándose en http://${address}:${SERVICE_PORT}`,
      );
    });
  }
});
