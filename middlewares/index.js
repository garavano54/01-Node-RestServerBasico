
const validarCampos = require('../middlewares/validar-campos');
const validarJWT    = require('../middlewares/validar-jwt');
const validarRoles  = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,   // Todo lo que tenga lo exporto.
    ...validarJWT,
    ...validarRoles
}