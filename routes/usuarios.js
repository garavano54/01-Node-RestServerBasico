
const { Router } = require('express');
const { check }  = require('express-validator');
const Role = require('../models/role');

const { usuariosGet, 
        usuariosPost,
        usuariosPut,
        usuariosPatch,
        usuariosDelete } = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId }  = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGet );

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser de más de 6 letras').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),     // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('correo').custom( emailExiste ),
        check('rol').custom( esRoleValido ),                     // check('rol').custom( (rol) => esRoleValido(rol) ),   [Se resume cuando tiene el mismo argumento]
        validarCampos
], usuariosPost);

router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ), 
        validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
], usuariosDelete);

// Queda mejor como está arriba separandolo en el controlador
// router.delete('/', (req, res) => {
//     res.status(403).json({
//         msg: 'delete API'
//     });    // res.send('Hello World');
// });

module.exports = router;