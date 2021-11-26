const express = require('express');
let app = express();
let Restaurante = require('../models/restaurante');
const { exec } = require('child_process');
// const script = require('../utils/script.sh');

// =============================================
// Mostrar todas los restaurantes campos filrado
// =============================================
app.get('/customer', async(req, res) => {

    try {
        await Restaurante.find({ state: 'Activo' }, ['restaurant', 'uri', 'api_url', 'api_port', 'email', 'state', 'producto', 'direccion'])
            .exec((err, restaurantes) => {
                Restaurante.count({ state: 'Activo' }, (err, conteo) => {
                    res.json({
                        ok: true,
                        restaurantes,
                        cuantos: conteo
                    });
                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});

// ==============================
// Buscar una restaurante por ID
// ==============================
app.get('/customer/:id', async(req, res) => {
    // Restaurante.findById(....);
    let id = req.params.id;

    await Restaurante.findById(id, ['restaurant', 'uri', 'api_url', 'api_port', 'email', 'state', 'producto', 'direccion'], (err, restauranteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!restauranteDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            restaurante: restauranteDB
        });
    });
});

// =======================================
// Buscar una restaurante por socket_room
// =======================================
app.post('/customer/socketroom', async(req, res) => {
    // Delivery.findById(....);
    console.log(req.body);

    await Restaurante.find({ 'socket_room': req.body.socket_room, state: 'Activo' }, ['restaurant', 'socket_room', 'uri', 'email', 'state', 'producto', 'direccion'])
        .exec((err, resp) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (resp == '') {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El socketroom del restaurante no es correcto!'
                    }
                });
            }
            Restaurante.count({ 'socket_room': req.body.socket_room, state: 'Activo' }, (err, conteo) => {
                res.json({
                    ok: true,
                    restaurante: resp,
                    cuantos: conteo
                });
            });
        });
});

// ==============================================
// Buscar una restaurante por nombre o producto
// ==============================================
app.post('/customer/datos', async(req, res) => {
    // Restaurante.findDatos(....)
    //console.log(res.body);
    try {
        await Restaurante.find({
                $or: [{ 'restaurant': { $regex: '.*' + req.body.restaurant + '.*', $options: 'i' } },
                    { 'producto': { $regex: '.*' + req.body.producto + '.*', $options: 'i' } }
                ],
                state: 'Activo'
            }, ['restaurant', 'uri', 'api_url', 'api_port', 'state', 'producto', 'direccion'])
            .sort('normalized')
            .exec((err, restaurantesDB) => {

                if (restaurantesDB == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Restaurante no encontrado!!!'
                        }
                    });
                }
                res.json({
                    ok: true,
                    restaurantes: restaurantesDB
                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No existen datos con los terminos informados!!!' });
    }
});

// ==============================
// Crear nuevo restaurante
// ==============================
app.post('/customer', async(req, res) => {
    // regresa la nueva restaurante
    let body = req.body;

    let restaurante = new Restaurante({
        restaurant: body.restaurant,
        uri: body.uri,
        app_evr: body.app_evr,
        db_host: body.db_host,
        db_user: body.db_user,
        db_pass: body.db_pass,
        db_name: body.db_name,
        db_secret: body.db_secret,
        cuit: body.cuit,
        pto_vta: body.pto_vta,
        init_afip: body.init_afip,
        socket_port: body.socket_port,
        socket_host: body.socket_host,
        socket_room: body.socket_room,
        email: body.email,
        api_port: body.api_port,
        api_url: body.api_url,
        bot_path: body.bot_path,
        producto: body.producto,
        direccion: body.direccion
    });

    await restaurante.save((err, restauranteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!restauranteDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            restaurante: restauranteDB
        });

        exec('sh new.sh ' + restaurante.restaurant +
            ' ' + restaurante.bot_path +
            ' ' + restaurante.socket_room +
            ' ' + restaurante.app_evr +
            ' ' + restaurante.db_host +
            ' ' + restaurante.db_user +
            ' ' + restaurante.db_pass +
            ' ' + restaurante.db_name +
            ' ' + restaurante.api_port +
            ' ' + restaurante.cuit +
            ' ' + restaurante.pto_vta +
            ' ' + restaurante.init_afip +
            ' ' + restaurante.socket_port +
            ' ' + restaurante.socket_host +
            ' ' + restaurante.uri +
            ' ' + restaurante.uri +
            ' ' + restaurante.api_url, (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.err(`stderr: ${stderr}`);
                    return;
                }
                console.log(`Comando ejecutado:\n${stdout}`);

                // res.status(200).json({ status: 'ok' });

            });
    });
});

// ===================================
// Actualizar datos de un restaurante
// ===================================
app.put('/customer/:id', async(req, res) => {

    let id = req.params.id;
    let body = req.body;

    let datosEditados = {
        // uri: body.uri,
        // restaurant: body.restaurant,
        // email: body.email,
        state: body.state,
        app_evr: body.app_evr,
        db_host: body.db_host,
        db_user: body.db_user,
        db_pass: body.db_pass,
        db_name: body.db_name,
        db_secret: body.db_secret,
        cuit: body.cuit,
        pto_vta: body.pto_vta,
        init_afip: body.init_afip,
        socket_port: body.socket_port,
        socket_host: body.socket_host,
        socket_room: body.socket_room,
        api_port: body.api_port,
        api_url: body.api_url,
        bot_path: body.bot_path,
        producto: body.producto,
        direccion: body.direccion
    };

    await Restaurante.findByIdAndUpdate(id, datosEditados, { new: true, runValidators: true }, (err, restauranteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!restauranteDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            restaurante: restauranteDB
        });
    });
});

// ===================================
// Actualizar restaurante proceso .SH
// ===================================
app.get('/update/sh/:id', async function(req, res) {

    let id = req.params.id;

    await Restaurante.findById(id, ['restaurant', 'bot_path', 'socket_room', 'app_evr', 'db_host',
        'db_user', 'db_pass', 'db_name', 'api_port', 'cuit', 'pto_vta', 'init_afip', 'socket_port',
        'socket_host', 'uri', 'uri', 'api_url'
    ], (err, restauranteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!restauranteDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Comando ejecutado'
                // restaurant: restauranteDB.restaurant,
                // socket_room: restauranteDB.socket_room
        });

        exec('sh update.sh ' + restauranteDB.restaurant +
            ' ' + restauranteDB.bot_path +
            ' ' + restauranteDB.socket_room +
            ' ' + restauranteDB.app_evr +
            ' ' + restauranteDB.db_host +
            ' ' + restauranteDB.db_user +
            ' ' + restauranteDB.db_pass +
            ' ' + restauranteDB.db_name +
            ' ' + restauranteDB.api_port +
            ' ' + restauranteDB.cuit +
            ' ' + restauranteDB.pto_vta +
            ' ' + restauranteDB.init_afip +
            ' ' + restauranteDB.socket_port +
            ' ' + restauranteDB.socket_host +
            ' ' + restauranteDB.uri +
            ' ' + restauranteDB.uri +
            ' ' + restauranteDB.api_url, (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.err(`stderr: ${stderr}`);
                    return;
                }
                console.log(`Comando ejecutado:\n${stdout}`);

                // res.status(200).json({ status: 'ok' });

            });
    });
})

// ===================================
// Borrar restaurante proceso .SH
// ===================================
app.delete('/delete/sh/:id', async function(req, res) {

    let id = req.params.id;

    await Restaurante.findById(id, ['restaurant', 'bot_path', 'socket_room', 'app_evr', 'db_host',
        'db_user', 'db_pass', 'db_name', 'api_port', 'cuit', 'pto_vta', 'init_afip', 'socket_port',
        'socket_host', 'uri', 'uri', 'api_url'
    ], (err, restauranteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!restauranteDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            mensaje: 'Comando ejecutado'
                // restaurant: restauranteDB.restaurant,
                // socket_room: restauranteDB.socket_room
        });

        exec('sh delete.sh ' + restauranteDB.restaurant +
            ' ' + restauranteDB.bot_path +
            ' ' + restauranteDB.socket_room +
            ' ' + restauranteDB.app_evr +
            ' ' + restauranteDB.db_host +
            ' ' + restauranteDB.db_user +
            ' ' + restauranteDB.db_pass +
            ' ' + restauranteDB.db_name +
            ' ' + restauranteDB.api_port +
            ' ' + restauranteDB.cuit +
            ' ' + restauranteDB.pto_vta +
            ' ' + restauranteDB.init_afip +
            ' ' + restauranteDB.socket_port +
            ' ' + restauranteDB.socket_host +
            ' ' + restauranteDB.uri +
            ' ' + restauranteDB.uri +
            ' ' + restauranteDB.api_url, (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.err(`stderr: ${stderr}`);
                    return;
                }
                console.log(`Comando ejecutado:\n${stdout}`);

                // res.status(200).json({ status: 'ok' });

                Restaurante.findByIdAndRemove(id);

            });
    });
})

module.exports = app;