const SERVER_URL_LOCAL = "http://192.168.1.154:8081"; // Reemplazar por la IP local del servidor y el puerto que se haya definido para el servicio HTTP

// Definición de los endpoints de la API REST del servicio
const ENDPOINTS = {
  USERS: "/users",
  LOGIN: "/login"
};

// Mocks del API del cliente

/**
 * Tarea 2. Front-end – Uso de fetch() para la autenticación
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
 * Tarea 3. Uso de fetch() para el registro de nuevos usuarios
 * Función que llama a la función con la petición. Esta es la función que se llamaría desde el formulario de creación de usuarios para enviar la solicitud al endpoint de gestión de usuarios del servicio HTTP para crear un nuevo usuario con los datos proporcionados en el formulario.
 * Revisar el código de esta función para introducir las modificaciones necesarias para que funcionen los cambios previstos para cuando se cree un usuario correctamente
 * Endpoint: POST /users
 * @param {Event} event
 */
async function doCreateUser(event) {
  event.preventDefault();
  const user = {
    user: "user",
    email: "user@usuarios.net",
    password: "1234",
    name: "Usuario de prueba",
    surname: "Apellido de prueba"
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
 * Tarea 3. Uso de fetch() para el registro de nuevos usuarios
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

/**
 * Tarea 4. Uso de fetch() para obtener una lista de registros
 * Función que envía una solicitud GET al endpoint de gestión de usuarios del servicio HTTP para obtener la lista de usuarios registrados en el sistema,
 * y muestra la lista de usuarios obtenida en la interfaz de usuario
 */
async function doGetUsers() {
  const response = await fetch(SERVER_URL_LOCAL + ENDPOINTS.USERS);
  if (response.ok) {
    const users = await response.json();
    if (users.length > 0) {
      console.log("Usuarios obtenidos: " + JSON.stringify(users));
      drawUserList(users); // Función para mostrar los usuarios obtenidos en la interfaz de usuario, por ejemplo en una tabla
    } else {
      console.log("No se encontraron usuarios");
      alert("No se encontraron usuarios");
    }
  } else {
    console.error(
      "Error al obtener los usuarios, código de estado: " + response.status
    );
  }
}

/**
 * Tarea 4. Uso de fetch() para obtener una lista de registros
 * Función que muestra una lista de usuarios obtenidos en la interfaz de usuario
 * @param {Array} users - Array de objetos con los datos de los usuarios a mostrar en la interfaz de usuario
 */
function drawUserList(users) {
  const listUsers = document.getElementById("listUsersResult");
  listUsers.innerHTML = ""; // Limpiamos el contenido anterior de la tabla de usuarios
  users.forEach((user) => {
    const newUser = drawUser(user); // Función para mostrar un usuario obtenido en la interfaz de usuario, por ejemplo añadiendo una fila a una tabla por cada usuario
    if (newUser) {
      listUsers.appendChild(newUser);
    }
  });
}

/**
 * Tarea 4. Uso de fetch() para obtener una lista de registros
 * Esta función crea un elemento HTML para mostrar un usuario obtenido en la interfaz de usuario
 * @param {Object} user - Objeto con los datos del usuario a mostrar en la interfaz de usuario
 * @returns Elemento HTML con los datos del usuario a mostrar en la interfaz de usuario
 */
function drawUser(user) {
  if (user == null) {
    return null;
  }

  const userElement = document.createElement("li");
  // Tarea 6. Uso de fetch() para eliminar un registro
  userElement.id = user._id; // Guardamos el _id del usuario en el elemento HTML para poder eliminarlo posteriormente
  userElement.classList.add("userListItem");
  const span = document.createElement("span");
  span.textContent = ` ${user.name} ${user.surname}`;
  const detailsButton = document.createElement("button");
  detailsButton.textContent = "Detalles";
  // Tarea 5. Uso de fecth() para obtener los detalles de un usuario.
  // Como se puede ver, se ha añadido un evento que llama a una función
  // Los datos que se pasan, al ser una función flecha se guardan en su contexto
  // y no hace falta guardarlos de forma permanente.
  detailsButton.addEventListener("click", () => showUserDetails(user)); // Función para mostrar los detalles del usuario en la interfaz de usuario, por ejemplo en un cuadro de diálogo modal o en una sección de la página dedicada a mostrar los detalles del usuario
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  // T6 - Uso de fetch() para eliminar un registro
  deleteButton.addEventListener("click", () => {
    // Función para eliminar el usuario de la lista:
    // 1. Enviar petición DELETE /usere/:id
    // 2. Comprobar si el código de estado es 200 (éxito)
    //   2.1 Borrar también el elemento HTML correspondiente: hemos debido poner el _id a cada elemento de lista creado.
    if (confirm("¿Está seguro de que desea eliminar el usuario?")) {
      if (deleteUser(user._id)) {
        const userElement = document.getElementById(user._id);
        if (userElement) {
          userElement.remove();
          alert("Usuario eliminado correctamente");
        }
      } else {
        console.error("Error al eliminar el usuario con id: " + user._id);
        alert("Fallo al eliminar el usuario");
      }
    }
  });
  userElement.appendChild(span);
  userElement.appendChild(detailsButton);
  userElement.appendChild(deleteButton);
  return userElement;
}

/**
 * Tarea 5. Uso de fecth() para obtener los detalles de un usuario.
 * Función para mostrar los detalles del usuario en la interfaz de usuario en un cuadro de diálogo modal
 * @param {Object} user - Objeto con los datos del usuario cuyos detalles se van a mostrar en la interfaz de usuario
 */
function showUserDetails(user) {
  const dialog = document.getElementById("userDetailsDialog");
  document.getElementById("userDetails").innerHTML =
    `${user.name} ${user.surname} <br>Email:${user.email} <br>Id:${user._id}`;

  dialog.showModal();
}

/**
 * Tarea 5. Uso de fecth() para obtener los detalles de un usuario.
 * Función para cerrar el cuadro de diálogo modal
 */
function closeUserDetails() {
  const dialog = document.getElementById("userDetailsDialog");
  dialog.close();
}

/**
 * Tarea 6. Uso de fetch() para eliminar un registro
 * @param {String} userId - Id del usuario a eliminar
 * @returns true si se ha eliminado correctamente, false en otro caso
 */
async function deleteUser(userId) {
  const init = {
    method: "DELETE"
  };
  const response = await fetch(
    SERVER_URL_LOCAL + ENDPOINTS.USERS + "/" + userId,
    init
  );
  if (response.ok) {
    console.log("Usuario eliminado con id: " + userId);
    return true;
  } else {
    console.error(
      "Error al eliminar el usuario, código de estado: " + response.status
    );
    return false;
  }
}
