const express = require('express');
let app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
let Delivery = require('../models/delivery');

// ==============================
// Mostrar todas los deliverys
// ==============================
app.get('/delivery', async(req, res) => {

    // let desde = req.query.desde || 0;
    // desde = Number(desde);

    // let limite = req.query.limite || 5;
    // limite = Number(limite);

    try {
        await Delivery.find({ estado: 'Activo' }, ['nombre', 'dni', 'email', 'estado', 'ultimaUbicacionLat', 'ultimaUbicacionLong', 'ubicacionActulaLat', 'ubicacionActulaLong', 'listRestaurante', 'celular'])
            // await Delivery.find({ estado: 'Activo' }, 'nombre dni email clave estado ultimaUbicacionLat ultimaUbicacionLong ubicacionActulaLat ubicacionActulaLong')
            // .skip(desde)
            // .limit(limite)
            .exec((err, deliverys) => {

                Delivery.count({ estado: 'Activo' }, (err, conteo) => {

                    // Delivery.count({ estado: 'Activo' }, (err, conteo) => {

                    res.json({
                        ok: true,
                        deliverys,
                        cuantos: conteo
                    });

                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});

// ==============================
// Mostrar una deliverys por ID
// ==============================
app.get('/delivery/:id', async(req, res) => {
    // Delivery.findById(....);

    let id = req.params.id;

    await Delivery.findById(id, ['nombre', 'dni', 'email', 'estado', 'ultimaUbicacionLat', 'ultimaUbicacionLong', 'ubicacionActulaLat', 'ubicacionActulaLong', 'listRestaurante', 'celular'], (err, deliveryeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!deliveryeDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            delivery: deliveryeDB
        });
    });
});

// =================================
// Mostrar una deliverys por datos
// =================================
app.post('/delivery/terminos', async(req, res) => {
    // Delivery.findDatos(....);
    try {
        await Delivery.find({
                $or: [{ 'nombre': req.body.nombre },
                    { 'email': req.body.email }
                ],
                estado: 'Activo'
            }, ['nombre', 'dni', 'email', 'estado', 'ultimaUbicacionLat', 'ultimaUbicacionLong', 'ubicacionActulaLat', 'ubicacionActulaLong', 'listRestaurante', 'celular'])
            .exec((err, deliveryeDB) => {

                if (deliveryeDB == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Delivery no encontrado!!!'
                        }
                    });
                }
                res.json({
                    ok: true,
                    deliverys: deliveryeDB
                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No existen datos con los terminos informados!!!' });
    }
});

// =============================================
// Obtener restaurantes con deliverys asignados
// =============================================
app.post('/delivery/restaurantId', async(req, res) => {
    // Delivery.findById(....);

    await Delivery.find({ 'listRestaurante._id': req.body.restaurantId })
        .exec((err, deliveryeDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (deliveryeDB == '') {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El ID de restaurante no es correcto!'
                    }
                });
            }
            Delivery.count({ 'listRestaurante._id': req.body.restaurantId }, (err, conteo) => {
                res.json({
                    ok: true,
                    restaurante: deliveryeDB,
                    cuantos: conteo
                });
            });
        });
});

// =============================================
// Obtener restaurantes con deliverys asignados
// =============================================
app.post('/delivery/socketroom', async(req, res) => {
    // Delivery.findById(....);

    await Delivery.find({ 'listRestaurante.socket_room': req.body.socket_room, estado: 'Activo' }, ['nombre', 'email', 'estado', 'ubicacionActulaLat', 'ubicacionActulaLong', 'listRestaurante', 'celular'])
        .exec((err, deliveryeDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (deliveryeDB == '') {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El socketroom del restaurante no es correcto!'
                    }
                });
            }
            Delivery.count({ 'listRestaurante.socket_room': req.body.socket_room, estado: 'Activo' }, (err, conteo) => {
                res.json({
                    ok: true,
                    restaurante: deliveryeDB,
                    cuantos: conteo
                });
            });
        });
});

// ==============================
// Crear nuevo deliverys
// ==============================
app.post('/delivery/new', async(req, res) => {
    // regresa la nueva entega

    let body = req.body;

    let delivery = new Delivery({
        nombre: body.nombre,
        dni: body.dni,
        email: body.email,
        celular: body.celular,
        clave: bcrypt.hashSync(body.clave, 10),
        estado: body.estado,
        ultimaUbicacionLat: body.ultimaUbicacionLat,
        ultimaUbicacionLong: body.ultimaUbicacionLong,
        ubicacionActulaLat: body.ubicacionActulaLat,
        ubicacionActulaLong: body.ubicacionActulaLong
    });

    await delivery.save((err, deliveryeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!deliveryeDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            delivery: deliveryeDB
        });
    });
});

// ==================================
// Actualizar coordenada de deliverys
// ==================================
app.put('/delivery/:id', async(req, res) => {

    let id = req.params.id;
    let body = req.body;

    let estatusEstado = {
        ubicacionActulaLat: body.ubicacionActulaLat,
        ubicacionActulaLong: body.ubicacionActulaLong
    };

    await Delivery.findByIdAndUpdate(id, estatusEstado, { new: true, runValidators: true }, (err, deliveryeDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!deliveryeDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            delivery: deliveryeDB
        });
    });
});

// ==================================
//  Asigna un restaurante a Delivery
// ==================================
app.post('/delivery/update/listrestaurant', async(req, res) => {
    // grabar el delivery
    // grabar un restaurante del listado
    try {
        await Delivery.findOneAndUpdate({ _id: req.body.DeliveryId }, {
            $push: {
                listRestaurante: {
                    restaurant: req.body.restaurant,
                    socket_room: req.body.socket_room,
                    _id: req.body.restaurantId
                }
            }
        });
        console.log('Restaurante grabado al listado!');
        return res.status(201).json({
            ok: true,
            message: ' Restaurante grabado al listado!'
        });
    } catch (e) {
        res.status(404).json({ message: ' No se pudo agregar el restaurante al listdo!' });
    }
});


// ===================================
//  Elimina un restaurante a Delivery
// ===================================
app.post('/delivery/delete/listrestaurant', async(req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    try {
        await Delivery.findOneAndUpdate({ _id: req.body.DeliveryId }, {
            $pull: {
                listRestaurante: {
                    restaurant: req.body.restaurant,
                    socket_room: req.body.socket_room,
                    _id: req.body.restaurantId
                }
            }
        });
        console.log('Restaurante eliminado del listado!');
        return res.status(201).json({
            ok: true,
            message: ' Restaurante eliminado del listado!'
        });
    } catch (e) {
        res.status(404).json({ message: ' No se pudo eliminar el restaurante al listdo!' });
    }
});


module.exports = app;
