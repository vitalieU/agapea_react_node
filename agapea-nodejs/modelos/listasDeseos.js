const mongoose = require('mongoose');

const ListaSchema = new mongoose.Schema({
    IdLista:{type:String},
    listas:[
        {type:mongoose.Schema.Types.ObjectId, ref:'listaDeseo'}
    ]
});

mongoose.module.exports=mongoose.model('ListaDeseos', ListaSchema, 'listasDeseos')