const mongoose=require('mongoose');

const valoracionSchema=new mongoose.Schema({
    
    fecha: { type: Date, required: false, default: Date.now },
    valoracion: { type: Number, required: true, max:5 },
    comentario: { type: String, required: false },
    username: { type: String, required: true },
    IdLibro: { type: String}
});

module.exports=mongoose.model('Valoracion',valoracionSchema,'valoraciones');
