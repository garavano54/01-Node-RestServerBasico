const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next ) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();     // Si no sucede ningún error se pasa al siguiente middleware
}

module.exports = { 
    validarCampos 
}