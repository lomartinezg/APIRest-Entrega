const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let estadoValido = {
    values: ['Activo', 'Inactivo'],
    message: '{VALUE} no es un estado válido'
};

let Schema = mongoose.Schema;

let deliverySchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    dni: {
        type: String,
        unique: true,
        required: [true, 'El DNI es requerido!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El Email es requerido!']
    },
    clave: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    estado: {
        type: String,
        default: 'Activo',
        enum: estadoValido
    },
    ultimaUbicacionLat: {
        type: String,
        required: [true, 'La ultima ubicación Lat es requerida']
    },
    ultimaUbicacionLong: {
        type: String,
        required: [true, 'La ultima ubicación Long es requerida']
    },
    ubicacionActulaLat: {
        type: String,
        required: [true, 'La actual ubicación Lat es requerida']
    },
    ubicacionActulaLong: {
        type: String,
        required: [true, 'La actual ubicación Long es requerida']
    },
    listRestaurante: { //Aqui se guarda el listado de estaurantes
        type: [
            Object
        ]
    },
    celular: {
        type: String,
        required: [true, 'El celular es requerido!']
    },

});

deliverySchema.plugin(uniqueValidator, { message: 'El {PATH} ya esta regstrado!!!' });

module.exports = mongoose.model('Delivery', deliverySchema);
