//modulo donde exporto funciones javascript para hacer pet.ajax al servicio RESTFULL montado sobre NODEJS....
// export async function RegistrarCliente( { nombre,apellidos,email,password,login,telefono} ){
//     if (login==='') login=email;
const GEO_API_KEY='b77a859e38571c7e1d719ae53c216b41cfd171afd1832c52490f3cfaf13f1be9';


// //#region -----------------  pet.Ajax con XMLHTTPREQUEST ----------------

//     //envolvemos pet.ajax en un objeto PROMISE....
//     //en el prototipo, el argumento pasado es una funcion con dos parametros:
//     // - resolve:  una funcion q va a devolver los datos de la promesia si se ejecuta de forma correcta
//     //              es lo q se recoje en el .then()
//     // - reject:  una funcion q va a devolver los datos cuando quieres q la promesa se ejecute de forma
//     //          incorrecta, estos datos los recogeria el catch()

//     // var _promiseResult=new Promise(
//     //     (resolve,reject)=>{
//     //         var petAjax=new XMLHttpRequest();
//     //         petAjax.open('POST','http://localhost:3003/api/Cliente/Registro');
//     //         petAjax.setRequestHeader('Content-Type','application/json');
        
//     //         petAjax.addEventListener('readystatechange',()=>{
//     //             if( petAjax.readyState === 4){
//     //                 console.log(petAjax);
        
//     //                 switch (petAjax.status) {
//     //                     case 200:
//     //                         //la respuesta del server esta en petAjax.responseText
//     //                         var respuesta=JSON.parse(petAjax.responseText);
//     //                         resolve(respuesta);                                                        
//     //                         break;

//     //                     default:
//     //                         reject( { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' });
//     //                         break;
//     //                 }
//     //             }
//     //         });
        
//     //         petAjax.send(JSON.stringify( { nombre,apellidos,login,telefono,email,password} ));  
//     //     }
//     // );

//     // return _promiseResult;


// //#endregion

// //#region -----------------  pet.Ajax con FETCH-API -----------------------
// try {
//         var _petAjax=await fetch('http://localhost:3003/api/Cliente/Registro',
//                                  {
//                                     method: 'POST',
//                                     body: JSON.stringify({ nombre,apellidos,email,password,login,telefono}),
//                                     headers: { 'Content-Type': 'application/json '}
//                                  }
//                                 );
//         return await _petAjax.json();

//     } catch (error) {
//         return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
//     }
// //#endregion
   
// }


// export async function LoginCliente( datoslogin ){
//     try {
//         var _petAjax=await fetch('http://localhost:3003/api/Cliente/Login',
//                                 {
//                                 method: 'POST',
//                                 body: JSON.stringify(datoslogin) ,
//                                 headers: { 'Content-Type': 'application/json '}
//                                 }
//                            );
//         return await _petAjax.json();  
          
//     } catch (error) {
//         return JSON.parse(error);
//     }

// }


var clienteRESTService={
    LoginCliente: async function(datoslogin){
        try {
            var _petAjax=await fetch('http://localhost:3003/api/Cliente/Login',
                                    {
                                    method: 'POST',
                                    body: JSON.stringify(datoslogin) ,
                                    headers: { 'Content-Type': 'application/json '}
                                    }
                               );
            return await _petAjax.json();  
              
        } catch (error) {
            return JSON.parse(error);
        }
    
    },
    RegistrarCliente: async function( { nombre,apellidos,email,password,login,telefono} ){
        try {
            if (login==='') login=email;
            var _petAjax=await fetch('http://localhost:3003/api/Cliente/Registro',
                                     {
                                        method: 'POST',
                                        body: JSON.stringify({ nombre,apellidos,email,password,login,telefono}),
                                        headers: { 'Content-Type': 'application/json '}
                                     }
                                    );
            return await _petAjax.json();
    
        } catch (error) {
            return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
        }        
    },
    ObtenerDatosCliente: async function(idcliente,jwtUnUso){
        try {
            let _respServer=await fetch(
                'http://localhost:3003/api/Cliente/ObtenerDatosCliente',
                {
                    method: 'POST',
                    body: JSON.stringify( { idcliente } ),
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtUnUso}` 

                    }
                }
            );

            if (! _respServer.ok) throw new Error('error al intentar obtener datos del cliente tras finalizar pago por paypal...');
            return _respServer.json();

        } catch (error) {
            console.log('error al intentar obtener datos del cliente tras finalizar pago por paypal...', error);
            return null;
        }
    },
    ActualizarAvatarCliente: async function({jwt, avatar}){
        console.log('jwt en actualizar avatar cliente...', jwt);
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/Avatar',
                                    {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { avatar } )
                                    });
             return await _pet.json();                       
        } catch (error) {
            return{
                error
            }
        }
    },   
    BorrarDireccion : async function({idDireccion,jwt} ){ 
        try {
            let _pet = await fetch(`http://localhost:3003/api/Cliente/BorrarDireccion/${idDireccion}`,
                                    {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`  }
                                    });
            return await _pet.json();                        
        } catch (error) {
            return{
                error
            }
        }
    },
    ActualizarDireccion: async function({jwt,direccion}){
        console.log('jwt en actualizar direccion...', jwt,direccion)
        try {
            let _pet = await fetch(`http://localhost:3003/api/Cliente/ActualizarDireccion`,
                                    {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization':  `Bearer ${jwt}`  },
                                        body: JSON.stringify( { direccion } )
                                    });
            console.log('respuesta de actualizar direccion: ', _pet);                   
            return await _pet.json();                        
        } catch (error) {
            return {
                error
            }
        }
    },
    ActualizarDatosCliente: async function(jwt, datoscliente){
        console.log('jwt en actualizar datos cliente...',datoscliente, jwt);
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/ActualizarDatos',
                                    {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { datoscliente } )
                                    });
             return await _pet.json();                       
        } catch (error) {
            return{
                error
            }
        }
    },
    GetProvincias: async function(){
        try {
            var _petAjax=await fetch(`https://apiv1.geoapi.es/provincias?type=JSON&key=${GEO_API_KEY}`,
                                    {
                                    method: 'get',
                                    
                                    }
                               );
            console.log('responsoe de getprovincias: ',_petAjax);                   
            return await _petAjax.json();  
            
        } catch (error) {
            return {
                error
            };
            
        } 
    },
    GetMunicipios: async function(cpro){
        try {
            var _petAjax=await fetch(`https://apiv1.geoapi.es/municipios?CPRO=${cpro}&type=JSON&key=${GEO_API_KEY}`,
                                    {
                                    method: 'get',
                                    }
                               );
            return await _petAjax.json();  
            
        } catch (error) {
            return{
                error
            }
        }
    },
    GetOpiniones: async function(jwt){
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/RecuperarValoraciones',
                                    {
                                        method: 'GET',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    },
    UpdateValoracion: async function(jwt, id,valoracion,comentario){
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/ModificarValoracion',
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { id,valoracion,comentario } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    },
    AddValoracion: async function(jwt, isbn13,valoracion){
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/AniadirValoracion',
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { isbn13,valoracion } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    },
    AddComentario: async function(jwt, idValoracion,comentario){
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/ActualizarValoracion',
                                    {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { idValoracion,comentario } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    },
    CrearLista: async function(jwt, nombre,descripcion){ 
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/CrearLista',
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { nombre,descripcion } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return{
                error
            }
        }
    },
    AddLibroLista: async function(jwt, idLista,idLibro){
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/AniadirLibroLista',
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { idLista,idLibro } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    },
    AddLibroNewLista: async function(jwt,nombreLista,descripcion,idLibro){

        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/AniadirLibroNewLista',
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { nombreLista,descripcion,idLibro } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    },
    BorrarLibroLista: async function(jwt,idLista,idLibro){
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/BorrarLibroLista',
                                    {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { idLista,idLibro } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    },
    BorrarLista: async function(jwt,idLista){
        try {
            let _pet = await fetch('http://localhost:3003/api/Cliente/BorrarLista',
                                    {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${jwt}`   },
                                        body: JSON.stringify( { idLista } )
                                    });
            return await _pet.json();                        
        } catch (error) {
            return {
                errorMensage: error.errorMensage,
            }
        }
    }

}

export default clienteRESTService;