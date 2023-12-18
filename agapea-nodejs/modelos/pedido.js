var mongoose=require('mongoose');

var pedidoSchema=new mongoose.Schema(
       {
          fechaPedido:{ type: Date, default: new Date() },
          estadoPedido: { type: String, default: 'en preparacion' },
          elementosPedido: [ 
                {
                    libroElemento: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
                    cantidadElemento: { type: Number, required: true, default: 1} 
                }
          ],
          subTotalPedido: { type: Number, default: 0 },
          gastosEnvio: { type: Number, default: 0 },
          totalPedido: { type: Number, default: 0 },
          direccionEnvio: { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion' },
          direccionFacturacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion' }
        }
    );

//---------- crear metodo para calcular total del pedido en el esquema ----------------
pedidoSchema.methods.CalcularTotalPedido=function(){
    //tendria q recorrer el array elementosPedido, e ir acumulando (precio libro * cantidad) <--- subtotal
    //despues sumar gastos de envio en funcion de la direccion de envio, y oleeee

}

module.exports=mongoose.model('Pedido',pedidoSchema,'pedidos');