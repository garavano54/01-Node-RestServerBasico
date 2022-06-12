const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");

const { ObjectId } = require('mongoose').Types

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async( termino = '', res = response)  => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.json( {
            result: ( usuario ) ? [ usuario ] : []     // Si existe usuario lo retorno. Si no retorno un arreglo vacío.
        })
    }

    const regex = new RegExp( termino, 'i');                             // $or es de Mongoose y regex de JS. 
                                                                         
    const usuario = await Usuario.find({                                 // Se puede: const usuario = await Usuario.count({    Para contar los registros     
        $or:  [ { nombre: regex }, { correo: regex } ],                  // Se puede: $or: [ { nombre: regex, estado : false }, { correo: regex, estado : false }  ]                
        $and: [ { estado: true } ]
     });

    res.json({
        result: usuario 
    })
}


const buscarCategorias = async( termino = '', res = response)  => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const categoria = await Categoria.findById( termino );
        return res.json( {
            result: ( categoria ) ? [ categoria ] : [] 
        })
    }

    const regex = new RegExp( termino, 'i');
                                                                         
    const categoria = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        result: categoria  
    })
}


const buscarProductos = async( termino = '', res = response)  => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
        return res.json( {
            result: ( producto ) ? [ producto ] : []     // Si existe usuario lo retorno. Si no retorno un arreglo vacío.
        })
    }

    const regex = new RegExp( termino, 'i');
                                                                         
    const producto = await Producto.find({ nombre: regex, estado: true })
                                   .populate('categoria', 'nombre');

    res.json({
        result: producto
    })
}



const buscar = async(req, res = response) => {
    
    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas} `
        })          
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res);
            break;

        case 'categorias':
            buscarCategorias( termino, res);
        break;

        case 'productos':
            buscarProductos( termino, res);
        break;
    
        default:
            return res.status(400).json({
                msg: `La busqueda está por desarrollarse`
            })  

    }

}

module.exports = { 
    buscar
}