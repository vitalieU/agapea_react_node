//modulo de node para definir endpoints zona Tienda con sus respectivas funciones middleware para su procesamiento
//se meten en objeto router y se exporta este objeto router:
const express=require('express');
const router=express.Router(); //<----- objeto router a exportar...

const tiendaController=require('../controllers/tiendaController');
router.get('/RecuperarCategorias/:idcategoria', tiendaController.recuperaCategorias );
router.get('/RecuperarLibros/:idcategoria', tiendaController.recuperaLibros );
router.get('/RecuperarLibro/:isbn13', tiendaController.recuperaUnLibro );
router.get('/RecuperarValoraciones/:isbn13', tiendaController.recuperarValoraciones );

module.exports=router;