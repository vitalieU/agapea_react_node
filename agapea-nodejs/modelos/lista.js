const mongoose = require('mongoose');

const ListaSchema = new mongoose.Schema({
    Nombre:{type:String, required:[true,'* Nombre obligatorio']},
    Descripcion:{type:String},
    Libros:[
        { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }
    ],
    EsPublica : {type:Boolean, default:false},
});

module.exports = mongoose.model('Lista', ListaSchema, 'lista');