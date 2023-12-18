var mongoose=require('mongoose');

var esquemaLibro=new mongoose.Schema(
    {   
        Titulo: { type: String, required: true },
        Editorial:{},
        Autores:{ type: String, required: true },
        Edicion:{ type: String, required: true },
        NumeroPaginas:{ type: Number, required: true },
        Precio:{ type: Number, required: true },
        ISBN10:{ type: String, required: true },
        ISBN13:{ type: String, required: true },
        Dimensiones:{ type: String, required: true },
        Resumen:{ type: String, required: true },
        Idioma:{ type: String, required: true },
        ImagenLibroBASE64:{ type: String, required: true },
        IdCategoria:{ type: String, required: true }
    } 
);

module.exports=mongoose.model('Libro', esquemaLibro,'libros');
