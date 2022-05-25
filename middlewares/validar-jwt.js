const { response, request } = require("express");
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next) => {

    const token = req.header('x-token');
    
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        // Buscar en la Base de datos con el uid del payload del token. Busca el usuario logueado que se genera el token.
        usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD'
            });
        }

        // Verificar si el uid tiene estado = true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado false'
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }


}

module.exports = {
    validarJWT
}