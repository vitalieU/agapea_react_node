//#region ------- exportando funciones individualizadas ---------------

//modulo donde exporto funciones javascript para hacer pet.ajax al servicio RESTFULL montado sobre NODEJS relacionados con la TIENDA....
// export async function recuperarCategorias( { request, params}  ){
//     try {
//         var _idcategoria=params.idcategoria;
//         if( typeof(_idcategoria)==='undefined') _idcategoria='padres';
        
//         var _cats=await fetch(`http://localhost:3003/api/Tienda/RecuperarCategorias/${_idcategoria}`);
//         return await _cats.json();
        
//     } catch (error) {
//         return [];
//     }

// } //<----- como va a ser un loader invocado por REACT-ROUTER, la funcion recibe como parametros un objeto
//   // { request: .... , params: ....}

//   export async function recuperarLibros( { request, params } ){

//   }

//#endregion

//#region -------- exportando un unico objeto javascript con props q tienen esas funciones ---------
var tiendaRESTService={
    recuperarCategorias: async function( { request, params }){
                            try {
                                var _idcategoria=params.idcategoria;
                                if( typeof(_idcategoria)==='undefined') _idcategoria='padres';
                                
                                var _cats=await fetch(`http://localhost:3003/api/Tienda/RecuperarCategorias/${_idcategoria}`);
                                return await _cats.json();
                                
                            } catch (error) {
                                return [];
                            }

    },
    recuperarLibros:  async function( {request, params} ){
                try {
                    var _idcategoria=params.idcategoria;
                    if( typeof(_idcategoria)==='undefined') _idcategoria="2-10";

                    var _libros=await fetch(`http://localhost:3003/api/Tienda/RecuperarLibros/${_idcategoria}`);
                    return await _libros.json();

                } catch (error) {
                    return [];
                }

    },
    recuperarLibro: async function(isbn13){
        try {
            var _libro=await fetch(`http://localhost:3003/api/Tienda/RecuperarLibro/${isbn13}`);
            return await _libro.json();
            
        } catch (error) {
            return {};
        }
    },
    recuperarValoraciones: async function(isbn13){
        try {
            const  _valoraciones=await fetch(`http://localhost:3003/api/Tienda/RecuperarValoraciones/${isbn13}`);
            return await _valoraciones.json();
            
        } catch (error) {
            return [];
        }
    }
}
export default tiendaRESTService;
//#endregion ---------------------------------------------------------------------------------------

