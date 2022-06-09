const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible:  { type: Booblean,  default: true }
});

ProductoSchema.methods.toJSON = function() {     // Se sobreescribe el método Json para que no se muestre el __v y password.
    const { __v, estado, ...data } = this.toObject();    // Se deja de mostrar en el Json los campos "__v" y "estado"
    return data;
}

module.exports = model('Producto', ProductoSchema);