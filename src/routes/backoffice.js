const express = require('express');
let app = express();
let Restaurante = require('../models/restaurante');

// ========================================
// Consulta FrontEnd todas los restaurantes
// ========================================
app.get('/backoffice', async(req, res) => {

    try {
        await Restaurante.find({})
            .exec((err, restaurantes) => {
                Restaurante.count((err, conteo) => {
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

module.exports = app;
