const express = require('express');
let app = express();
let Ordenes = require('../models/ordenes');

// ==========================
// Mostrar todas las ordenes
// ==========================
app.get('/orden', async(req, res) => {

    try {
        await Ordenes.find({})
            .sort({ 'orden.fechaEntrega': -1, "orden.idOrderH": -1 })
            .exec((err, ordenes) => {

                Ordenes.count((err, conteo) => {

                    res.json({
                        ok: true,
                        ordenes,
                        cuantos: conteo
                    });

                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});

// =======================================
// Mostrar detalle una orden por idOrderH
// =======================================
app.post('/orden/idOrderH', async(req, res) => {
    // Ordenes.findByidOrderH(....);
    try {
        await Ordenes.findOne({ 'orden.idOrderH': req.body.idOrderH })
            .exec((err, ordenes) => {
                if (ordenes == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Orden no encontrada!!!'
                        }
                    });
                }
                res.json({
                    ok: true,
                    orden: ordenes
                });

            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});


// ==========================================================
// Mostrar ordenes asignadas a un delivery por idDeliveryExt
// ==========================================================
app.post('/orden/idDeliveryExt', async(req, res) => {
    // Ordenes.findByidDeliveryExt(....);
    const date = new Date().toISOString();
    let fecha = date.substr(0, 10);

    try {
        await Ordenes.find({
                'orden.idDeliveryExt': req.body.idDeliveryExt,
                $and: [{ 'orden.fechaEntrega': { $regex: fecha + '.*' } }]
            })
            .sort({ 'orden.fechaEntrega': -1, "orden.idOrderH": -1 })
            .exec((err, ordenes) => {
                if (ordenes == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Delivery no encontrado!!!'
                        }
                    });
                }
                Ordenes.count({ 'orden.idDeliveryExt': req.body.idDeliveryExt, $and: [{ 'orden.fechaEntrega': { $regex: fecha + '.*' } }] }, (err, conteo) => {
                    res.json({
                        ok: true,
                        orden: ordenes,
                        cuantos: conteo
                    });
                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});

// ============================================================================
// Mostrar ordenes asignadas a un delivery por idDeliveryExt y rango de fechas
// ============================================================================
app.post('/orden/idDeliveryExt/rangofechas', async(req, res) => {
    // Ordenes.findByidDeliveryExt(....);
    console.log(req.body);
    try {
        await Ordenes.find({
                'orden.idDeliveryExt': req.body.idDeliveryExt,
                // $and: [{ 'orden.fechaEntrega': { $gte: new Date(req.body.fechaInicial), $lt: new Date(req.body.fechaFinal) } }]
                $and: [{ 'orden.fechaEntrega': { $gte: req.body.fechaInicial + ' 00:00:00', $lt: req.body.fechaFinal + ' 23:59:59' } }]
            })
            .sort({ 'orden.fechaEntrega': -1, "orden.idOrderH": -1 })
            .exec((err, ordenes) => {

                console.log(ordenes);

                if (ordenes == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Delivery no encontrado!!!'
                        }
                    });
                }
                Ordenes.count({ 'orden.idDeliveryExt': req.body.idDeliveryExt, $and: [{ 'orden.fechaEntrega': { $gte: req.body.fechaInicial + ' 00:00:00', $lt: req.body.fechaFinal + ' 23:59:59' } }] }, (err, conteo) => {
                    res.json({
                        ok: true,
                        orden: ordenes,
                        cuantos: conteo
                    });
                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});

// ==========================================================
// Mostrar ordenes activa de un cliente por su nro. de Cel
// ==========================================================
app.post('/orden/activa/phoneClient', async(req, res) => {
    // Ordenes.findByphoneClient(....);
    try {
        await Ordenes.find({ 'orden.phoneClient': req.body.phoneClient, 'orden.idStatusOrder': { $in: [1, 3, 5, 6] } })
            .sort({ 'orden.fechaEntrega': -1, "orden.idOrderH": -1 })
            .exec((err, ordenes) => {
                if (ordenes == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Celular no encontrado!!!'
                        }
                    });
                }
                Ordenes.count({ 'orden.phoneClient': req.body.phoneClient, 'orden.idStatusOrder': { $in: [1, 3, 5, 6] } }, (err, conteo) => {
                    res.json({
                        ok: true,
                        orden: ordenes,
                        cuantos: conteo
                    });
                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});

// ==========================================================
// Mostrar ordenes inactiva de un cliente por su nro. de Cel
// ==========================================================
app.post('/orden/inactiva/phoneClient', async(req, res) => {
    // Ordenes.findByphoneClient(....);
    try {
        await Ordenes.find({ 'orden.phoneClient': req.body.phoneClient, 'orden.idStatusOrder': { $in: [2, 4] } })
            .sort({ 'orden.fechaEntrega': -1, "orden.idOrderH": -1 })
            .exec((err, ordenes) => {
                if (ordenes == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Celular no encontrado!!!'
                        }
                    });
                }
                Ordenes.count({ 'orden.phoneClient': req.body.phoneClient, 'orden.idStatusOrder': { $in: [2, 4] } }, (err, conteo) => {
                    res.json({
                        ok: true,
                        orden: ordenes,
                        cuantos: conteo
                    });
                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});

// ====================
// Crear ordenes nueva
// ====================
app.post('/orden', async(req, res) => {
    // regresa la nueva orden
    console.log(req.body);
    await Ordenes.findOne({ 'orden.idOrderH': req.body.idOrderH, 'orden.nameRestaurant': req.body.nameRestaurant }, (err, ordenDB) => {
        if (ordenDB == null) {
            console.log('Se creo una Orden Ok!');
            Ordenes.create({ orden: req.body });
            res.json({
                ok: true,
                mensaje: 'Se creo una Orden Ok!'
            });
        } else {
            Ordenes.findOneAndDelete({ 'orden.idOrderH': req.body.idOrderH, 'orden.nameRestaurant': req.body.nameRestaurant }, function(err) {
                if (err) console.log(err);
                console.log("Creación de Orden Ok!");
                Ordenes.create({ orden: req.body });
                res.json({
                    ok: true,
                    mensaje: 'Creación de Orden Ok!'
                });
            });
        }
    });
});

module.exports = app;