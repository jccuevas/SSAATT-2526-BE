# SSAATT-2526-BE
Repositorio para guardar los ejemplos de desarrollo de un back-end sobre Node.js y Express, con MongoDB de las Fases 3 y 4 de las prácticas de la asignatura.

## Datos de la asignatura
- ASIGNATURA: Servicios y aplicaciones telemáticas.
- TITULACIÓN: Grado en Ingeniería de tecnologías de telecomunicación (14312020)
- TITULACIÓN: Doble Grado Ing. de tecnologías de la telecomunicación e Ing. telemática (15212007)
- TITULACIÓN: Grado en Ingeniería telemática (14512016)
- CENTRO: ESCUELA POLITÉCNICA SUPERIOR (LINARES) Universidad de Jaén 
- CURSO ACADÉMICO: 2025-2026

# Fase 3
En esta fase se deberán desarrollar los servicios del proyecto definido por cada equipo en el back-end empleando Node.js, Express, MongoDB, y opcionalmente Mongoose. Al menos, se deberán integrar los servicios de autenticación y registro de usuarios, cuyo código será aportado a modo de ejemplo, así como la funcionalidad CRUD completa para el servicio objeto del proyecto definido por el equipo para el Ejercicio 1.

Se proporcionan los endpoints de ejemplo siguientes:
- Autenticación:
  - POST /login
- Usuarios (CRUD):
  - POST /users - crear usuario
  - GET /users -  listar todos los usuarios
  - GET /users/:id - obtener los datos de un usuario
  - PUT /users/:id - actualizar usuario con :id
  - DELETE /users/:id - borrar usuario con :id

# Fase 4

En esta fase se deberá finalizar el prototipo de aplicación web desarrollando los servicios del proyecto, definidos por cada equipo, en el front-end empleando el API fetch. Así, la página web, conectándose a los endpoints desarrollados en la Fase 3, podrá completar la funcionalidad de autenticación, registro de nuevos usuarios, y la funcionalidad CRUD completa para el servicio objeto del proyecto definido por el equipo para el Ejercicio 1.

Recuerde que, en esta fase y, por tanto, en la aplicación en su conjunto, se pueden desarrollar más servicios de la aplicación detallada en el Ejercicio 1, pero el contenido mínimo es el indicado con anterioridad en dicho ejercicio y que ha sido validado por el equipo docente. La inclusión de funcionalidad adicional, que funcione correctamente y tenga sentido dentro de la aplicación global, será tenida en cuenta de manera positiva en la valoración final del apartado S4 – Prácticas.

Se aportan fichero index.html y script.js de ejemplo con llamadas fetch() a los enpoints definidos en la Fase 3.