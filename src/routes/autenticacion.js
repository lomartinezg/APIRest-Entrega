const express = require('express');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const UserDelivery = require('../models/delivery');
const util = require('../utils/mail')

const app = express();

// ==========================
// Autenticación de Delivery
// ==========================
app.post('/autenticacion', async(req, res) => {

    let body = req.body;

    await UserDelivery.findOne({ email: body.email }, (err, userDeliveryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDeliveryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.clave, userDeliveryDB.clave)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        res.json({
            ok: true,
            estado: userDeliveryDB.estado,
            deliberyId: userDeliveryDB._id,
            nombre: userDeliveryDB.nombre,
            email: userDeliveryDB.email
        });

    });

});

// ===================================
// Generar clave aleatoria a Delivery
// ===================================
app.post('/autenticacion/recuperarclave', async(req, res) => {

    let body = req.body;

    let recuperar = generator.generate({
        length: 5,
        numbers: true
    });

    console.log('Randon----->' + recuperar);

    let clave = bcrypt.hashSync(recuperar, 10);

    await UserDelivery.findOneAndUpdate({ email: body.email }, { 'clave': clave }, (err, userDeliveryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDeliveryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Email no esta registrado!!!'
                }
            });
        }

        // console.log('Randon----->' + recuperar);

        util.enviarMail({
            "mensaje": "Se genero una nueva contraseña para el usuario " + body.email + ", su contraseña nueva es:  <b>" + recuperar,
            "titulo": "Cambio de contraseña",
            "mail": body.email,
            "from": "info@elmenudelivery.com",
            "titulofrom": "Menu delivery"
        }).then(function(response) {
            console.log(JSON.stringify(response.data));
        }).catch(function(error) {
            console.log(error);
        })

        res.json({
            ok: true,
            message: 'Clave enviada a su buzon de correo!'
        });

    });
});

module.exports = app;
