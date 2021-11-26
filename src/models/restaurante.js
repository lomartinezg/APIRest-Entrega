const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let estadoValido = {
    values: ['Activo', 'Inactivo'],
    message: '{VALUE} no es un estado válido'
};

const Schema = mongoose.Schema;

let restauranteSchema = new Schema({
    restaurant: { type: String, unique: true, required: [true, 'El restaurante es necesario'] },
    uri: { type: String, unique: true, required: [true, 'La URL es obligatoria'] },
    state: { type: String, default: 'Activo', enum: estadoValido },
    app_evr: { type: String, required: [true, 'El campo es requerido'] },
    db_host: { type: String, required: [true, 'El campo es requerido'] },
    db_user: { type: String, required: [true, 'El campo es requerido'] },
    db_pass: { type: String, required: [true, 'El campo es requerido'] },
    db_name: { type: String, unique: true, required: [true, 'El campo es requerido'] },
    db_secret: { type: String, required: [true, 'El campo es requerido'] },
    cuit: { type: String, required: false },
    pto_vta: { type: String, required: false },
    init_afip: { type: String, required: false },
    socket_port: { type: Number, required: [true, 'El nombre es necesario'] },
    socket_host: { type: String, required: [true, 'El campo es requerido'] },
    socket_room: { type: String, unique: true, required: [true, 'El campo es requerido'] },
    email: { type: String, required: [true, 'El campo es requerido'] },
    api_port: { type: Number, unique: true, required: [true, 'El nombre es necesario'] },
    api_url: { type: String, required: [true, 'El campo es requerido'] },
    bot_path: { type: String, unique: true, required: [true, 'El campo es requerido'] },
    producto: { type: String, required: [true, 'El campo es requerido'] },
    direccion: { type: String, required: [true, 'El campo es requerido'] },
    img: { type: String, required: false },
});

restauranteSchema.plugin(uniqueValidator, { message: 'El {PATH} ya esta registrado, debe de ser único!!!' });

module.exports = mongoose.model('Restaurante', restauranteSchema);