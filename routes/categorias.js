const { Router } = require('express');
const { check }  = require('express-validator');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategorias, 
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// {{url}}/api/categorias

router.get('/', obtenerCategorias);     // Sin controlador --> router.get('/', (res, req) => { console.log('Todo Ok'); } );  

router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria);   

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria); 

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategorias ); 

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria ); 

module.exports = router;