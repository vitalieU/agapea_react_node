import {useState, useEffect} from 'react';
import { useItemsCarroContext, useClienteLoggedContext } from '../../../App';
import ElementoPedido from './ElementoPedido';
import { Link } from 'react-router-dom';

function Pedido(){
    //#region --------state manejado por el componente ------------------
    //-------recuperacion del global-state items del pedido------
    let { itemsCarro }=useItemsCarroContext();
    let { clienteLogged}=useClienteLoggedContext();

    //------ state-local del componente pedido: variables Subtotal, Gastos de Envio y Total
    // este state-local debe recalcularse cada vez q cambia: itemsPedido <--- necesito efecto
    let [subTotalPedido,setSubTotalPedido]=useState(0);
    let [gastosEnvio,setGastosEnvio]=useState(2); //<----- deberia establecer los gastos de envio en funcion PROV. direccion principal cliente logueado

    //#endregion


    
    //#region --------------- efectos del componente q afectan a su state ------------
    useEffect(
        ()=>{
            let _subtotal=itemsCarro.reduce( (acum, el)=> acum + (el.libroElemento.Precio * el.cantidadElemento), 0 );
            setSubTotalPedido(_subtotal);
        },
        [itemsCarro]
    );

    useEffect(
        () => {
            const _dirppal=clienteLogged.direcciones.filter( dir=>dir.esPrincipal===true)[0];

            switch (_dirppal.provincia.CPRO) {
                case '07'://Baleares
                    setGastosEnvio(2.5);
                    break;

                case "38":
                case "35"://Canarias
                    setGastosEnvio(3);
                    break;

                case "51":
                case "52"://Ceuta y Melilla
                    setGastosEnvio(3.5);
                    break;

                default: //peninsula
                    setGastosEnvio(2);
                    break;
            }
      }, 
      [clienteLogged.direcciones]);    
    //#endregion

    

    //#region ------------ funciones manejadoras de eventos -----------------------------
    function HandlerSubmitCompra(ev){
        //....envio de datos del pedido a nodejs ......

    }
    //#endregion ------------------------------------------------------------------------


    
    //-----------------------------------------------------------------------------------------------------
    //----------------------vista del componente ----------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------
    return(
        <div className='container'>
            <div className='row'>
                {/* ------ columna para direccion envio, facturacion y metodo de pago ----*/}
                <div className='col-8'>

                </div>
                
                
                {/* ------ columna para elementos del pedido, subtotal, gastos envio y total ----*/}
                <div className='col-4'>
                    <div className='container'>
                        <div className='row'><h6><strong>Resumen de la Cesta</strong></h6></div>
                        <hr></hr>
                        {
                            itemsCarro.length === 0 ? 
                            (
                               <p>...no hay ningun libro añadido al carro de momento, sigue comprando....</p>     
                            )
                            :
                            (
                                <>
                                    {
                                        itemsCarro.map(
                                            elemento => <ElementoPedido item={elemento} key={elemento.libroElemento.ISBN13}></ElementoPedido> 
                                        )
                                    }
                                    <div className='row'>
                                        <div className='col-10'><p><strong>SubTotal: </strong></p></div>
                                        <div className='col-2'><span style={{color:'red'}}>{subTotalPedido}€</span></div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-10'><p><strong>Gastos de envio y gestion: </strong></p></div>
                                        <div className='col-2'><span style={{color:'red'}}>{gastosEnvio}€</span></div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-10'><p><strong>Gastos Total a pagar: </strong></p></div>
                                        <div className='col-2'><span style={{color:'red'}}>{subTotalPedido + gastosEnvio}€</span></div>
                                    </div>
                                    <div className='row'><small>El periodo de entrega es de <span style={{color:'green'}}>1 a 7 días laborables</span></small></div>
                                </>
                            )
                        }

                        <div className='row'>
                            <div className='col-6'>
                                <Link to="/Tienda/Libros/2-10" className='btn btn-outline-primary'>
                                    <i className='fa-solid fa-book'></i>Seguir Comprando
                                </Link>
                            </div>
                            <div className='col-6'>
                                <button onClick={HandlerSubmitCompra} className='btn btn-primary'>
                                    <i className='fa-solid fa-truck-fast'> </i> Finalizar Pedidio
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pedido;