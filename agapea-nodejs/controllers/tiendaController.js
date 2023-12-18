//modulo de nodejs donde exporto objeto javascript puro q tiene como propiedades las funciones middleware
//q necesita el objeto router express de zona Tienda....
var Cliente=require('../modelos/cliente');
var Categoria=require('../modelos/categoria');
var Direccion=require('../modelos/direccion');
var Pedido=require('../modelos/pedido');
var Libro=require('../modelos/libro');
let Valoracion=require('../modelos/valoracion');

module.exports={
    recuperaCategorias:async (req,res,next)=>{
        try {
                //si en parametro idcategoria va 'padres' tengo q recuperar categorias raices...
                //si va otro valor, p.e: 2-10 tendria q recuperar subcategorias hijas....
                var _idcategoria=req.params.idcategoria;
                //console.log('categoria mandada desde react...', _idcategoria);
    
                var _patron=_idcategoria==='padres' ?  new RegExp("^\\d{1,}$") : new RegExp("^" + _idcategoria + "-\\d{1,}$");
                var _cats=await Categoria.find( { IdCategoria: { $regex: _patron }  } );
    
               //console.log('categorias recuperadas...', _cats);
    
                res.status(200).send(_cats);
    
                
        } catch (error) {
            console.log('error al recuperar categorias...',error);
            res.status(200).send( [] );
        }    
    
    },
    recuperaLibros: async (req,res,next)=>{
        try {
            //si en parametro idcategoria va 'padres' tengo q recuperar categorias raices...
            //si va otro valor, p.e: 2-10 tendria q recuperar subcategorias hijas....
            var _idcategoria=req.params.idcategoria;
            //console.log('categoria mandada desde react...', _idcategoria);
    
            var _patron=_idcategoria==='padres' ?  new RegExp("^\\d{1,}$") : new RegExp("^" + _idcategoria + "-\\d{1,}$");
            var _libros=await Libro.find( { IdCategoria: { $regex: _patron }  } );
    
            //console.log('libros recuperadas...', _libros);
    
            res.status(200).send(_libros);
    
            
    } catch (error) {
        console.log('error al recuperar categorias...',error);
        res.status(200).send( [] );
    }    
    
    },
    recuperaUnLibro: async (req,res,next) => {
        try {
            var _isbn13=req.params.isbn13;
            var _libro=await Libro.findOne({ ISBN13: _isbn13 });
            console.log('libro recuperado...', _libro);
    
            res.status(200).send(_libro);
    
        } catch (error) {
            console.log('error al recuperar libro...', error);
            res.status(200).send({});
        }
    },
    recuperarValoraciones: async (req,res,next) => {
        try {

            const isbn13=req.params.isbn13;
            const libro = await Libro.findOne({ISBN13:isbn13});
            const valoraciones = await Valoracion.find({IdLibro:libro._id});
            res.status(200).send({codigo:0,mensaje:'valoraciones recuperadas correctamente',valoraciones});
        } catch (error) {
            res.status(400).send({codigo:1,mensaje:'error al recuperar valoraciones',error: error.message});
        }
    },
}