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
 **/
function doLogin() {
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
