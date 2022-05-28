const { response } = require("express");
const bcryptjs     = require('bcryptjs');

const Usuario          = require('../models/usuario');
const { generarJWT }   = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

// IMPORTANTE: Poner en header: Content-Type - application/json
const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el mail existe
        const usuarioDB = await Usuario.findOne({ correo });
        if ( !usuarioDB ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Correo'
            });
        }

        // Si el usuario está activo
        if ( !usuarioDB.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // verificar la contraseña. La que se recibe del body contra la de la base de datos.
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            usuarioDB,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, correo, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {   // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };
            
            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario está en BD pero está bloqueado
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no válido'
        })
    }


} 

module.exports = {
    login,
    googleSignin
}

