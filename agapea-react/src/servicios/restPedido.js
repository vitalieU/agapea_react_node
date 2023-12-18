var pedidoRESTService={
    finalizarPedido: async function( datosEntrega, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged ){
        try {
            //peticion fetch al servicio de node, devuelve objeto Response Fetch Api
            let _respServer=await fetch(
                'http://localhost:3003/api/Pedido/FinalizaPedido',
                {
                    method: 'POST',
                    body: JSON.stringify( { datosEntrega, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged} ),
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${clienteLogged.jwt}`
                    }
                }
            );
            if (! _respServer.ok) throw new Error('....error al intentar finalizar pedido....');
            return _respServer.json();

        } catch (error) {
            console.log('error al intentar finalizar pedido...', error);
            return {};
        }
    }

}


export default pedidoRESTService;