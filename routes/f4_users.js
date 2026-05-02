/*
 * Fase 4 - Tarea 1.3 - Despliegue del endpoint de gestión de usuarios en un router Express
 * ASIGNATURA: Servicios y Aplicaciones Telemáticas
 * TITULACIÓN: Grado en Ingeniería de tecnologías de telecomunicación (14312020)
 * TITULACIÓN: Doble Grado Ing. de tecnologías de la telecomunicación e Ing. telemática (15212007)
 * TITULACIÓN: Grado en Ingeniería telemática (14512016)
 * CENTRO: ESCUELA POLITÉCNICA SUPERIOR (LINARES)
 * CURSO ACADÉMICO: 2025-2026
 * AUTOR: Juan Carlos Cuevas Martínez
 */

// Datos del servicio
const SERVICE_NAME = "users";
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

const express = require("express"); //Importación del paquete Express
const app = new express(); // Creación de la aplicación Express
const router = express.Router(); // Creación del router Express
const { MongoClient, ObjectId } = require("mongodb"); // Se importa MongoClient y ObjectId del paquete mongodb

// API del servicio /users

/**
 * Servicio POST /users
 * Inserta los datos de un usuario recibidos en la petición en formato JSON
 * en la base de datos, si su nombre de usuario no existe ya
 */

// Ejemplo de middleware de validación con función flecha en una sentencia
const validaUser = (req, res, next) => {
  if (req.body !== undefined) {
    next();
  } else {
    res.status(STATUS_BADFORMAT).end();
  }
};

router.post(SERVICE_ROOT, validaUser, function (req, res) {
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
        console.log(
          `[SERVIDOR] Documento insertado con _id: ${result.insertedId}`
        );
        res.status(STATUS_CREATED).json({ _id: result.insertedId }); // Permite responder automáticamente con estado 200 y datos en JSON.
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

/**
 * GET /users
 * Recupera los datos de todos los usuarios almacenados en la base de datos
 */

router.get(SERVICE_ROOT, function (req, res) {
  const client = new MongoClient(DB_URL); // Conexión con la base de datos MongoDB
  // El objeto client es el que se emplea para interactuar
  // con la base de datos.
  // No olvide cerrar la conexión al finalizar este endpoint
  // Para trabajar con la base de datos MongoDB es habitual definir una función asíncrona y lanzarla
  async function run() {
    try {
      const db = client.db(DB_NAME);
      const users = db.collection(DB_USERS_COLLECTION);

      const cursor = await users.find(); // La función find busca todos los documentos de la colección que coincidan con el filtro.
      // En este caso el filtro está vacío y por lo tanto extrae todos los documentos.
      // find() devuelve un cursor que permite manejar el resultado de muchas formas.
      const result = await cursor.toArray(); // Extraemos todos los documentos como un array JSON.
      res.json(result); // Permite responder automáticamente con estado 200 y datos en JSON.
    } finally {
      await client.close(); // Siempre debemos cerrar la conexión con la base de datos.
    }
  }

  //Se lanza la función asíncrona run() y se capturan los errores (excepciones) con el método catch.
  run().catch((ex) => {
    console.error("[SERVIDOR] GET /users: " + ex.toString());
    res.status(STATUS_SERVER_ERROR).end();
  });
});

/**
 * Servicio GET /users/:id
 * Recupera los datos de un usuario específico almacenado en la base de datos
 * El id del usuario a recuperar se especifica en la ruta del endpoint Express con "dos puntos", en este caso :id,
 * y se recibe como un parámetro de la ruta (req.params.id) y se emplea para buscar el documento con ese id en la base de datos.
 */
router.get(`${SERVICE_ROOT}:id`, function (req, res) {
  const client = new MongoClient(DB_URL); // Conexión con la base de datos MongoDB
  // El objeto client es el que se emplea para interactuar
  // con la base de datos.
  // No olvide cerrar la conexión al finalizar este endpoint
  // Para trabajar con la base de datos MongoDB es habitual definir una función asíncrona y lanzarla
  async function run() {
    try {
      const db = client.db(DB_NAME);
      const users = db.collection(DB_USERS_COLLECTION);

      const id = new ObjectId(req.params.id); // Se extrae el id del usuario a buscar de los parámetros de la ruta
      console.log(
        `[${SERVICE_NAME}] Intentando recuperar el usuario con id: ${id.toString()}`
      );
      const result = await users.findOne({ _id: id }); // La función find busca el documento con el id especificado
      // En este caso el filtro tiene un valor y por lo tanto extrae solo el documento que coincide.
      if (result) {
        res.json(result); // Permite responder automáticamente con estado 200 y datos en JSON.
      } else {
        res.status(STATUS_NOTFOUND).end(); // Si no se encuentra el usuario se responde con un error 404 not found
      }
    } catch (error) {
      console.log(
        `[${SERVICE_NAME}] Error al recuperar el usuario con id: ${id.toString()}`
      );
      if (error instanceof Error && error.name === "BSONError") {
        console.error("[SERVIDOR] Error en el formato del id: " + error);
        res.status(STATUS_BADFORMAT).json({
          message: "Formato de id inválido",
          error: error.message
        });
      } else {
        // Nota sobre seguridad: En un entorno de producción no se deberían mostrar los mensajes de error internos del servidor a los clientes,
        // ya que pueden contener información sensible.
        // En este caso se muestra el mensaje de error para facilitar la depuración durante el desarrollo,
        // pero en un entorno de producción se debería responder con un mensaje genérico sin detalles del error interno.
        console.error("[SERVIDOR] GET /users/:id: " + error);
        res
          .status(STATUS_SERVER_ERROR)
          .json({ message: "Error del servidor", error: error.message });
      }
    } finally {
      await client.close(); // Siempre debemos cerrar la conexión con la base de datos.
    }
  }

  //Se lanza la función asíncrona run() y se capturan los errores (excepciones) con el método catch.
  run().catch((error) => {
    console.error("[SERVIDOR] GET /users: " + error.toString());
    res
      .status(STATUS_SERVER_ERROR)
      .json({ message: "Error del servidor", error: error.message });
  });
});

/**
 * Servicio DELETE /users/:id
 * Elimina un usuario específico almacenado en la base de datos
 * El id del usuario a eliminar se especifica en la ruta del endpoint Express con "dos puntos", en este caso :id,
 * y se recibe como un parámetro de la ruta (req.params.id) y se emplea para buscar el documento con ese id en la base de datos.
 */
router.delete(`${SERVICE_ROOT}:id`, function (req, res) {
  const client = new MongoClient(DB_URL); // Conexión con la base de datos MongoDB
  // El objeto client es el que se emplea para interactuar
  // con la base de datos.
  // No olvide cerrar la conexión al finalizar este endpoint
  // Para trabajar con la base de datos MongoDB es habitual definir una función asíncrona y lanzarla
  async function run() {
    try {
      const db = client.db(DB_NAME);
      const users = db.collection(DB_USERS_COLLECTION);

      const id = new ObjectId(req.params.id); // Se extrae el id del usuario a borrar de los parámetros de la ruta

      console.log(
        `[${SERVICE_NAME}] Intentando eliminar el usuario con id: ${id.toString()}`
      );
      const result = await users.deleteOne({ _id: id }); // La función deleteOne elimina el documento con el id especificado
      if (result.acknowledged && result.deletedCount === 1) {
        console.log("[SERVIDOR] Usuario eliminado correctamente.");
        res.status(STATUS_OK).end(); // El documento se ha eliminado correctamente
      } else {
        res.status(STATUS_NOTFOUND).end(); // Si no se encuentra el usuario se responde con un error 404 not found
      }
    } catch (error) {
      console.log(
        `[${SERVICE_NAME}] Error al eliminar el usuario con id: ${id.toString()}`
      );
      if (error instanceof Error && error.name === "BSONError") {
        console.error("[SERVIDOR] Error en el formato del id: " + error);
        res.status(STATUS_BADFORMAT).json({
          message: "Formato de id inválido",
          error: error.message
        });
      } else {
        // Nota sobre seguridad: En un entorno de producción no se deberían mostrar los mensajes de error internos del servidor a los clientes,
        // ya que pueden contener información sensible.
        // En este caso se muestra el mensaje de error para facilitar la depuración durante el desarrollo,
        // pero en un entorno de producción se debería responder con un mensaje genérico sin detalles del error interno.
        console.error("[SERVIDOR] GET /users/:id: " + error);
        res
          .status(STATUS_SERVER_ERROR)
          .json({ message: "Error del servidor", error: error.message });
      }
    } finally {
      await client.close(); // Siempre debemos cerrar la conexión con la base de datos.
    }
  }

  //Se lanza la función asíncrona run() y se capturan los errores (excepciones) con el método catch.
  run().catch((ex) => {
    console.error("[SERVIDOR] GET /users: " + ex.toString());
    res
      .status(STATUS_SERVER_ERROR)
      .json({ message: "Error del servidor", error: error.message });
  });
});

/**
 * Servicio PUT /users/:id
 * Actualiza un usuario específico almacenado en la base de datos
 * El id del usuario a actualizar se especifica en la ruta del endpoint Express con "dos puntos", en este caso :id,
 * y se recibe como un parámetro de la ruta (req.params.id) y se emplea para buscar el documento con ese id en la base de datos.
 */
router.put(`${SERVICE_ROOT}:id`, validaUser, function (req, res) {
  const client = new MongoClient(DB_URL); // Conexión con la base de datos MongoDB
  // El objeto client es el que se emplea para interactuar
  // con la base de datos.
  // No olvide cerrar la conexión al finalizar este endpoint
  // Para trabajar con la base de datos MongoDB es habitual definir una función asíncrona y lanzarla
  async function run() {
    try {
      const db = client.db(DB_NAME);
      const users = db.collection(DB_USERS_COLLECTION);

      const id = new ObjectId(req.params.id); // Se extrae el id del usuario a modificar de los parámetros de la rut

      if (req.body.user !== undefined || req.body._id !== undefined) {
        console.log("[SERVIDOR] El campo user o _id no se puede modificar.");
        res
          .status(STATUS_BADFORMAT)
          .json({ message: "El campo user o _id no se pueden modificar." }); // Si el body de la petición contiene el campo user o el campo _id, se responde con un error 400 bad format, ya que estos campos no se pueden modificar.
      } else {
        const result = await users.updateOne({ _id: id }, { $set: req.body }); // La función updateOne actualiza el documento con el id especificado
        // pero body no debería contener ni el campo _id, ni el campo user, ya que este campo no se puede modificar. Si se incluye el campo _id en el body, se producirá un error de formato.

        if (result.matchedCount === 1 && result.modifiedCount === 1) {
          console.log("[SERVIDOR] Usuario actualizado correctamente.");
          res.status(STATUS_OK).end(); // El documento se ha actualizado correctamente
        } else {
          res.status(STATUS_NOTFOUND).end(); // Si no se encuentra el usuario se responde con un error 404 not found
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "BSONError") {
        console.error("[SERVIDOR] Error en el formato del id: " + error);
        res.status(STATUS_BADFORMAT).json({
          message: "Formato de id inválido",
          error: error.message
        });
      } else {
        // Nota sobre seguridad: En un entorno de producción no se deberían mostrar los mensajes de error internos del servidor a los clientes,
        // ya que pueden contener información sensible.
        // En este caso se muestra el mensaje de error para facilitar la depuración durante el desarrollo,
        // pero en un entorno de producción se debería responder con un mensaje genérico sin detalles del error interno.
        console.error("[SERVIDOR] GET /users/:id: " + error);
        res
          .status(STATUS_SERVER_ERROR)
          .json({ message: "Error del servidor", error: error.message });
      }
    } finally {
      await client.close(); // Siempre debemos cerrar la conexión con la base de datos.
    }
  }

  //Se lanza la función asíncrona run() y se capturan los errores (excepciones) con el método catch.
  run().catch((ex) => {
    console.error("[SERVIDOR] GET /users: " + ex.toString());
    res
      .status(STATUS_SERVER_ERROR)
      .json({ message: "Error del servidor", error: error.message });
  });
});

module.exports = router; // Se exporta el router para incluirlo en el servidor HTTP con el método use() de Express, indicando la ruta del endpoint correspondiente.
