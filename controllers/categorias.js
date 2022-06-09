const { response }  = require("express");
const { Categoria } = require('../models')

const obtenerCategorias = async( req ,  res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // Se optimiza el código para que se ejecuten de manera simultanea ambas promesas. Se mandan en un arreglo las 2 promesas en orden y luego se desestructura el arreglo. 
    const [ total, categorias ] = await Promise.all([ 
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({ total, 
               categorias 
            });    
  
}

const obtenerCategoria = async( req ,  res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre')

    res.json({
        categoria
    })
}

const crearCategoria = async( req ,  res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const catagoriaDB = await Categoria.findOne({ nombre })
    if ( catagoriaDB ) {
        return res.status(400).json({
            msg: `La categoría ${ catagoriaDB.nombre } ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    await categoria.save();

    res.status(201).json(categoria);
    
}

const actualizarCategorias = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });  // Para que retorne la información nueva

    res.json({
        categoria
    })

}

const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true} )
     
    res.json({
        categoriaBorrada
    })

}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategorias,
    borrarCategoria
}