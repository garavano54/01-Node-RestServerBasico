const { Usuario, Categoria, Role, Producto } = require('../models');
const { isValidObjectId }                    = require("mongoose");

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

 const emailExiste = async(correo = '') => {
    // Verificar si el correo existe. 
   const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
 } 

 const existeUsuarioPorId = async( id ) => {
    // Verificar si el id existe. 
   const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${id}`);
    }
 } 

 // ************ Categorías ************ // 
 const existeCategoriaPorId = async( id ) => {

    const esMongoID = isValidObjectId(id);     // Comentarios: Daba un error si no validaba acá también.

    if (esMongoID) {
        // Verificar si el id existe. 
        const existeCategoria = await Categoria.findById( id );
        if ( !existeCategoria ) {
            throw new Error(`El id no existe ${id}`);
        }
    } 
 } 

  // ************ Productos ************ // 
  const existeProductoPorId = async( id ) => {

    const esMongoID = isValidObjectId(id);     // Comentarios: Daba un error si no validaba acá también.

    if (esMongoID) {
        // Verificar si el id existe. 
        const existeProducto = await Producto.findById( id );
        if ( !existeProducto ) {
            throw new Error(`El id no existe ${id}`);
        }
    } 
 } 

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}