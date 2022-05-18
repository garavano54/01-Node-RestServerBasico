const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // ** Ambas se pueden hacer de manera simultanea. Por eso se optimiza. **
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    // Se optimiza el código para que se ejecuten de manera simultanea ambas promesas. Se mandan en un arreglo las 2 promesas en orden y luego se desestructura el arreglo. 
    const [ usuarios, total ] = await Promise.all([ 
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({ total, 
               usuarios 
            });    
}

const usuariosPost = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;                     // const body = req.body;  (Manda todo junto. Pero el front podría mandar el campo google por ejemplo que no queremos)
    const usuario = new Usuario( { nombre, correo, password, rol } );       // const usuario = new Usuario( body );                        
   
    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();                    // Genera el número de Salto. Le da la complejidad al Hash. Por defecto es 10. Más alto más complejo.
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB

    await usuario.save();

    res.json({
        msg: 'post API - Controlador',
        usuario
    });    
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const {_id, password, google, correo, ...resto } = req.body;

    if ( password ) {                                           // Si viene una clave en el req. EJ: 13456
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();                    // Genera el número de Salto. Le da la complejidad al Hash. Por defecto es 10. Más alto más complejo.
        resto.password = bcryptjs.hashSync(password, salt);     // Encripta esa clave (123456) y la agrega como propiedad en resto
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);    
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - Controlador'
    });    
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Físicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false} )

    res.json(usuario);    
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}