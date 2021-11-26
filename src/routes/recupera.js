const express = require('express');
const generator = require('generate-password');
const UserDelivery = require('../models/delivery');

const app = express();

// ===========================
//  Recuperacion de contaseña
// ===========================
app.get('/recupera/clave', async(req, res) => {

    consola.log(req.body);

    try {
        await UserDelivery.find({ 'email': req.body.email })
            .exec((err, deliverys) => {
                if (deliverys == '') {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'Email de Delivery no encontrado!!!'
                        }
                    });
                }

                if (body.email == userDeliveryDB.email) {
                    let contraseñas = generador.generateMultiple(3, {
                        longitud: 10,
                        mayúsculas: falso
                    });
                    // ['hnwulsekqn', 'qlioullgew', 'kosxwabgjv']
                    consola.log(contraseñas);
                }

                res.json({
                    ok: true,
                    clave: 'Generada!'
                });

            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }

});


module.exports = app;
