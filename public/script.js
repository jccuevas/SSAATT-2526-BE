const SERVER_URL_LOCAL = "http://192.168.1.154:8081"; // Reemplazar por la IP local del servidor y el puerto que se haya definido para el servicio HTTP

// Definición de los endpoints de la API REST del servicio
const ENDPOINTS = {
  USERS: "/users",
  LOGIN: "/login"
};

// Mocks del API del cliente

/**
 * Función que envía una solicitud POST al endpoint de autenticación de usuarios del servicio HTTP para autenticar al usuario con las credenciales proporcionadas en el formulario de login.
 * Revisar el código de esta función para introducir las modificaciones necesarias para que funcionen los cambios
 * previstos para cuando se autentique un usuario correctamente
 * Endpoint: POST /login
 * @param {Event} event - Evento del formulario de login que se ha enviado
 **/
function doLogin(event) {
  event.preventDefault(); // Evita que se recargue la página al enviar el formulario
  const user = {
    user: "user",
    password: "1234"
  };

  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  };

  fetch(SERVER_URL_LOCAL + ENDPOINTS.LOGIN, init)
    .then((response) => {
      if (response.ok) {
        return response.json(); //Obtenemos el id del usuario autenticado que se ha enviado en la respuesta del endpoint de autenticación de usuarios del servicio HTTP
      } else {
        conole.log(
          "Error en la autenticación, código de estado: " + response.status
        );
        alert("Fallo en la autenticación");
        // Usar la función creada para mostar un mensaje de error en la interfaz de usuario
        return null;
      }
    })
    .then((userid) => {
      if (userid != null) {
        console.log("Usuario autenticado con id: " + JSON.stringify(userid));

        const loginResult = document.getElementById("loginResult");
        loginResult.textContent = `Usuario autenticado con id: ${JSON.stringify(userid)}`;

        //Hacer los cambios necesarios en la interfaz de usuario para mostrar que el usuario se ha autenticado correctamente
      } else {
        conole.log(
          "Error en la autenticación, código de estado: " + response.status
        );
        alert("Fallo en la autenticación");
        // Usar la función creada para mostar un mensaje de error en la interfaz de usuario
        return null;
      }
    })
    .catch((error) => {
      console.error("Error al enviar la solicitud:", error);
      return null;
    });
}

/**
 * Función que llama a la función con la petición. Esta es la función que se llamaría desde el formulario de creación de usuarios para enviar la solicitud al endpoint de gestión de usuarios del servicio HTTP para crear un nuevo usuario con los datos proporcionados en el formulario.
 * Revisar el código de esta función para introducir las modificaciones necesarias para que funcionen los cambios previstos para cuando se cree un usuario correctamente
 * Endpoint: POST /users
 * @param {Event} event
 */
async function doCreateUser(event) {
  event.preventDefault();
  const user = {
    user: "user",
    email: "user3@usuarios.net",
    password: "1234",
    name: "Usuario",
    surname: "Usuer"
  };
  const userId = await createUser(user);
  if (userId) {
    console.log("Usuario creado con id: " + JSON.stringify(userId));
    // Hacer los cambios necesarios en la interfaz de usuario para mostrar que el usuario se ha creado correctamente, por ejemplo mostrando el id del usuario creado
    const createUserResult = document.getElementById("createUserResult");
    createUserResult.textContent = `Usuario creado con id: ${JSON.stringify(userId)}`;
  } else {
    console.log("Error al crear el usuario");
    alert("Fallo al crear el usuario");
    // Usar la función creada para mostar un mensaje de error en la interfaz de usuario
  }
}

/**
 * En esta función se emplea await para enviar la solicitud, lo que hace que el código sea más sencillo de leer y escribir, evitando el uso de callbacks o promesas con then() y catch() para manejar la respuesta de la solicitud.
 * @param {Object} user
 * @returns Objeto con el id del usario creado o null en otro caso
 */
async function createUser(user) {
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  };

  const response = await fetch(SERVER_URL_LOCAL + ENDPOINTS.USERS, init);
  if (response.ok) {
    return await response.json(); //Obtenemos el id del usuario creado que se ha enviado en la respuesta del endpoint de gestión de usuarios del servicio HTTP
  } else {
    return null;
  }
}
