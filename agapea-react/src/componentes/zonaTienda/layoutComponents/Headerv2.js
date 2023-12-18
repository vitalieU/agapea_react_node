import { Link } from 'react-router-dom';
import { useClienteLoggedContext } from '../../../context-providers/clienteLoggedContext';

function Headerv2(){
    let { clienteLogged } = useClienteLoggedContext();

    console.log('valor del state global clienteLogged...', clienteLogged);

    return (
        <header>
            <div className="container-lg m-0 p-0">
                <div className="col-12 vw-100">
                    <div className="row m-0 p-0" style={{backgroundColor:"#2c2c2c"}}>
                        <div className="col-9"></div>
                        <div className="col-3">
                            <div className="btn-group btn-sm">
                                <button className="btn btn-dark btn-sm"><img src="/images/botonMINIcontacto.png" alt="..."/></button>
                                { /* boton del login, siempre y cuando  no exista estado de sesion...
                                    si existe de sesion entonces boton con el email para acceder al panel del cliente
                                    */
                                    ! clienteLogged ? 
                                    (
                                        <Link to="/Cliente/Login"  className="btn btn-dark btn-sm"><img src="/images/botonMINIlogin.png" alt="..." /></Link>
                                    ) : (
                                        <Link to="/Cliente/Panel/InicioPanel"  className="btn btn-dark btn-sm">{clienteLogged.datoscliente.cuenta.email}</Link>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                    <nav className="row bg-light vw-100 m-0 border border-bottom-2">
                        <div className="row p-3 container me-0 ms-5">
                            { /*<!-- Mi cuenta --> */}
                            <div className="col-4 d-flex align-content-center justify-content-center ps-5">
                                <Link to="/" className="p-2" >
                                    <img src="/images/agapea-logo.png" alt="" width="auto" height="40" />
                                </Link>
                            </div>
                            <div className="col-4">
                                <form >
                                    <div className="bg-gray border border-5 border w-75 h-100 d-flex flex-row">
                                        <div className="p-1 flex-fill">
                                            <input className="border-0 w-100 h-100" type="text" name="cajatext" placeholder="Buscar por libro, autor, ISBN..."/>
                                        </div>
                                        <div className="bg-primary p-2 border border-5 border-end-0 border-top-0 border-bottom-0">
                                            <input type="image" id="botonBuscar" onClick={()=> document.forms[0].submit() }  src="/images/lupa.png" width="auto" height="20" alt="..." />
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div className="col-4 p-0">
                                <div className="w-50 h-100">
                                    {/* <!-- mini carrito --> */}
                                    <Link to="/Pedido/MostrarPedido"  className="h-100 bg-white border border-dark border-1 btn btn-light">
                                        <img src="/images/boton_mini_carrito.png" alt="" />
                                        <span className="text-dark badge badge-danger  ps-1 pe-1"> <small>Total:</small> <span className="text-end" id="precioCarrito" style={{width: "110px", fontSize: "1.2em"}}>0.00 €</span></span>

                                        <img className="align-content-lg-center" src="/images/boton_flecha_minicarrito.png" alt="" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
    </header>        
    );

}

export default Headerv2;