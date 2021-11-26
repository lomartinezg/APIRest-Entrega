const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// ====================
//  Consultar usuarios
// ====================
app.get('/users', async(req, res) => {

    try {
        await Usuario.find({ role: { $in: ['admin', 'consulta'] }, estado: true }, '_id email role estado')
            .exec((err, usuarios) => {

                Usuario.count({ role: { $in: ['admin', 'consulta'] }, estado: true }, (err, conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    });

                });
            });
    } catch (e) {
        res.status(404).json({ message: ' No se encontraron datos!!!' });
    }
});


// ===========================
//  Consultar usuarios por Id
// ===========================
app.get('/users/:id', async(req, res) => {
    // Categoria.findById(....);


    let id = req.params.id;

    await Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado!'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});


// ===============
//  Crear usuario
// ===============
app.post('/users', async(req, res) => {
    // app.post('/users', [verificaToken, verificaAdmin_Role], async(req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        // nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    await usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// =================
//  Editar usuario
// =================
app.put('/users/:id', async(req, res) => {

    let id = req.params.id;
    let body = req.body;

    let datos = {
        password: bcrypt.hashSync(body.password, 10)
    };

    await Usuario.findByIdAndUpdate(id, datos, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

// =================
//  Eliminar usuario
// =================
app.delete('/users/:id', async(req, res) => {

    let id = req.params.id;

    // ===============
    //  Borrado fisico
    // ===============

    await Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        // ===============
        //  Borrado logico
        // ===============
        // let cambiaEstado = {
        //     estado: false
        // };

        // Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado!'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Usuario eliminado!!!',
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;
