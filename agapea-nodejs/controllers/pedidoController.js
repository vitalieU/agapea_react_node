const stripeservice=require('../servicios/stripeservice');
const jsonwebtoken=require('jsonwebtoken');
const mongoose=require('mongoose');

const Cliente=require('../modelos/cliente');
const Categoria=require('../modelos/categoria');
const Direccion=require('../modelos/direccion');
const Pedido=require('../modelos/pedido');
const Libro=require('../modelos/libro');
const PagosPayPal=require('../modelos/pagospaypal');

const paypalservice = require('../servicios/paypalservice');

function _generarJWT( { nombre,apellidos, email, idcliente }, expires='1h' ){
    return  jsonwebtoken.sign(
        { nombre, apellidos, email, idcliente }, //<--- payload jwt
        process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
        { expiresIn: expires, issuer: 'http://localhost:3003' } //opciones o lista de cliams predefinidos
    );
}

async function _devolverDatosCliente(idcliente){
    try {
        return await Cliente.findById(idcliente)
                            .populate(
                                [
                                    [
                                        { path: 'pedidos', model: 'Pedido', populate: [ { path: 'elementosPedido.libroElemento', model: 'Libro'} ] },
                                        { path: 'direcciones', model: 'Direccion' }
                                    ]                                    
                                ]
                            );
    } catch (error) {
        console.log('error al recuperar datos cliente...', error);
        return null;
    }
}


module.exports={
    finalizarPedido: async (req,res,next)=>{
        try {
            //en req.payload esta metido el payload del JWT mandadao en la cabecera del request: { nombre,apellidos, email, idcliente}
            console.log('payload del jwt...', req.payload);

            //en req.body van los datos de la pet.ajax del request: { datosEntrega, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged}
            console.log('body de la peticion...', req.body);
            let { datosEntrega, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged }=req.body;

            //#region 1º paso) ----nos creamos nuevas direcciones de envio/facturacion si mandan datos en datosEnvio y datosFacutaracion ---
            //#endregion

            //#region 2º paso) ----nos creamos objeto Pedido a partir de elementosPedido, gastosEnvio y metemos en mongo y actualizamos cliente ---
            let _idnuevoPedido=new mongoose.Types.ObjectId();
            let _subtotalPedido=Math.round(elementosPedido.reduce((acum,elem)=> acum + (elem.libroElemento.Precio * elem.cantidadElemento), 0)*100)/100;
            let _totalPedido=Math.round((_subtotalPedido + gastosEnvio)*100)/100;

            let _newPedido={
                _id: _idnuevoPedido,
                fechaPedido: new Date(Date.now()),
                elementosPedido, //<---- aqui van los elementos expandidos: en libroElemento solo debe ir el _id
                subTotalPedido: _subtotalPedido,
                gastosEnvio,
                totalPedido: _totalPedido,
                direccionEnvio: clienteLogged.datoscliente.direcciones.filter(dir=>dir.esPrincipal===true)[0]._id,
                direccionFacturacion: clienteLogged.datoscliente.direcciones.filter(dir=>dir.esFacturacion===true)[0]._id
            };

            let _resultadoINSERT=await new Pedido(_newPedido).save()
            console.log('resultado insert nuevo pedido...', _resultadoINSERT);

            //update cliente....
            let _resultadoUPDATECli=await Cliente.updateOne({_id: clienteLogged.datoscliente._id}, {$push: { 'pedidos': _idnuevoPedido}} );
            console.log('resultado update Cliente con nuevo pedido...', _resultadoUPDATECli);


            //#endregion

            //#region 3º paso) ----pago con stripe o con paypal ---
            if (datosPago.pagoradios==='pagotarjeta') {
                //#region /////////// pago con STRIPE ////////////////
                let _customerStripeId=await stripeservice.createCustomer(clienteLogged.datoscliente);
                if (! _customerStripeId) throw new Error('error pago STRIPE al intentar crear objeto CUSTOMER');

                let _cardId=await stripeservice.createCardFromCustomer(_customerStripeId);
                if(! _cardId) throw new Error('error pago STRIPE al intentar crear objeto CARD asociado al Customer');

                if (await stripeservice.createCharge(_customerStripeId, _cardId, _totalPedido, _idnuevoPedido)) {
                    let _jwt=_generarJWT( {
                                        nombre: clienteLogged.datoscliente.nombre,
                                        apellidos: clienteLogged.datoscliente.apellidos,
                                        email: clienteLogged.datoscliente.cuenta.email,
                                        idcliente: clienteLogged.datoscliente._id
                                    } );
    
                    let _cliente=await _devolverDatosCliente(clienteLogged.datoscliente._id);

                    res.status(200)
                        .send(
                              {
                                codigo: 0,
                                mensaje:'pedido finalizado y pagado con STRIPE de forma correcta',
                                error: null,
                                datoscliente: _cliente,//meter el cliente con su prop.pedidos actualizada con el nuevo pedido
                                tokensesion: _jwt,
                                otrosdatos:null
                              }  
                    );
                } else {
                    
                }
                //#endregion
            } else {
                //#region /////////// pago con PAYPAL ////////////////
                let _resp=await paypalservice.crearPagoPayPal( clienteLogged.datoscliente._id, _newPedido );
                console.log('...respuesta de nuestro servicio de llamada a paypal...', _resp);

                if(! _resp) throw new Error('error al generar el pago por PAYPAL');
                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'pago creado en paypal, redirecccionando al cliente a la pasarela de pago...',
                        error: null,
                        datoscliente: null,
                        tokensesion: null,
                        otrosdatos: JSON.stringify( { urlPayPal: _resp })

                    }
                )

                //#endregion
                
            }
            //#endregion            
        } catch (error) {
            console.log('error al finalizar pedido...', error);
            res.status(403).send(
                {
                    codigo: 1,
                    mensaje: 'error al finalizar pedido en servicio de nodejs contra mongodb',
                    error: error.message,
                    datoscliente: null,
                    tokensesion:null,
                    otrosdatos:null
                }
            )
        }


    },
    paypalCallBack: async (req,res,next)=>{ //OJO!!!!! ESTE METODO ES INVOCADO POR EL SERVER DE PAYPAL, NO EL CLIENTE DE REACT!!!!
            //en la url vienen parametros en querystring:  idcli <---- idcliente q ha hecho el apgo, pedid <---- idpedido
            console.log('parametros recibidos en la url por parte de paypal cuando cliente acepta el pago del pedido...', req.query);
            
            let { idcli, pedid, Cancel }=req.query;
            //necesito obtener el id-pago generado por paypal, esta almacenado en mongo...
            let _pagoPayPal=await PagosPayPal.findOne( { idcliente: idcli, idpedido: pedid } );
            console.log('valor del coleccion pagospaypal para recuperar idpago...', _pagoPayPal);
            
            let _finPagoOK=await paypalservice.finalizarPagoPayPal(_pagoPayPal.idpago);
            if (! _finPagoOK ) throw new Error('...error al finalizar el pago por parte del cliente en paypal, cabronnnnn pagaaaaaa ....');

            // ------ no puedo devolver esto: pq no lo va a recibir el cliente de react, lo recibiria el servidor paypal....
            // res.status(200).send(
            //     {
            //         codigo:0 //...
            //     }
            // )

            //me genero un JWT de un solo uso (tiempo de expiracion muy corto, unos minutos) para garantizar q es el cliente de react q usa el comp.
            //FinalizarPedidoOK quien esta realmente pidiendo los datos del cliente asociados al id q hay en la url y NO ES UN ATACANTE q intenta
            //obtener datos por inyeccion al endpoint
            let _jwtSoloUnUso=jsonwebtoken.sign( 
                    { idcliente: idcli, idpedido: pedid, idpago: _pagoPayPal.idpago },
                    process.env.JWT_SECRETKEY,
                    { expiresIn: '5m', issuer: 'http://localhost:3003' }
             );

             //-------- generar factura en pdf y mandar por email --------------
             
             //-------- redireccionar al cliente de react a finalizar pedido ok ------------
            res.status(200).redirect(`http://localhost:3000/Pedido/FinalizarPedidoOK?idpedido=${pedid}&idcliente=${idcli}&token=${_jwtSoloUnUso}`);
    }
}