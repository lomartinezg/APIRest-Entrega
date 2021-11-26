// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Puertos
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '1h'; //caducidad del token

// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || '@_5eed-d3v-puk1pvki *';

// ============================
//  Base de datos
// ============================
let urlDB;

urlDB = 'mongodb://bot_menudelivery:XXXXXXXXXXXXXX';

process.env.URLDB = urlDB;