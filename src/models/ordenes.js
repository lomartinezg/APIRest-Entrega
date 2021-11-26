var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrdenSchema = new Schema({
    orden: { type: Object, required: true }
});

module.exports = mongoose.model('Ordenes', OrdenSchema);