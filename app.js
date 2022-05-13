// npm i express dotenv  (Para el servidor y las variables de entorno)
// npm i cors            (Para los middlewares) - https://www.npmjs.com/package/cors

require('dotenv').config();
const Server = require('./models/server');


const server = new Server();
server.listen();









// Los middleware son funciones de javascript, la diferencia es que estas funciones tienen acceso al objeto de solicitud (req), al objeto de respuesta (res) y a la función next() que ejecuta el siguiente middleware en el ciclo.
// Generalmente, los middleware se utilizan para:
// * Ejecutar cualquier código.
// * Realizar cambios en la solicitud y los objetos de respuesta.
// * Finalizar el ciclo de solicitud/respuestas.
// * Invocar la siguiente función de middleware en la pila.