const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto,
        obtenerProducto, 
        obtenerProductos, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/producto');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// {{url}}/api/productos

router.get('/', obtenerProductos);     // Sin controlador --> router.get('/', (res, req) => { console.log('Todo Ok'); } );  

router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto);   

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto ); 

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto ); 


module.exports = router;