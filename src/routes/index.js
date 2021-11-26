const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./autenticacion'));
app.use(require('./restaurante'));
app.use(require('./backoffice'));
app.use(require('./delivery'));
app.use(require('./ordenes'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;
