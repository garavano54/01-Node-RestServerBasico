
const { Router } = require('express');
const { usuariosGet, 
        usuariosPost,
        usuariosPut,
        usuariosPatch,
        usuariosDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.post('/', usuariosPost);

router.put('/:id', usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/', usuariosDelete);

// Queda mejor como está arriba separandolo en el controlador
// router.delete('/', (req, res) => {
//     res.status(403).json({
//         msg: 'delete API'
//     });    // res.send('Hello World');
// });

module.exports = router;