
const express = require('express')
const cors    = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares 
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y Parseo del Body
        this.app.use(express.json());

        // Directorio Público - Se usa para que sea posible acceder a los archivos de esta carpeta a través de HTTP. Tenga en cuenta que la app.use()función ejecuta el middleware en orden. El express.static()middleware devuelve un HTTP 404 si no puede encontrar un archivo, lo que significa que normalmente debe llamar app.use(express.static()) después del resto de su aplicación. De lo contrario, terminará con un error HTTP 404:
        this.app.use( express.static('public') );
    }

    routes() {
       this.app.use(this.authPath, require('../routes/auth'));
       this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }

}

module.exports = Server;