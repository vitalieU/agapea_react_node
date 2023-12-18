import { useState } from 'react';
//import { useClienteLoggedContext } from '../../../App'; //<----- importo hook personalizado para recup.valor del global-state
import { useClienteLoggedContext } from '../../../context-providers/clienteLoggedContext'

import { Link,useNavigate } from 'react-router-dom';

import clienteRESTService from '../../../servicios/restCliente'

function Login(){

    let [datosLogin, setDatosLogin]=useState( { email:'', password:'' } );
//  let { clienteLogged, setClienteLogged }=useClienteLoggedContext();
    let {  dispatch }=useClienteLoggedContext();

    let navigate=useNavigate(); //<---hook de react-router-dom q devuelve funcion navigate('path_salto') q actua como un componente <Navigate...>

    function HandlerChangeInputs(ev){
        //en ev.target tengo el input q ha disparado el evento de cambio...en ev.target.name, su atributo "name" y en ev.target.value su valor
        let { name, value }=ev.target;

        setDatosLogin(
            {
                ...datosLogin,
                [name]: value      
            }
        );
    }


    async function HandlerSubmitForm(ev){
        try {
            ev.preventDefault();
            let _respLogin=await clienteRESTService.LoginCliente(datosLogin);
            console.log('login ok...respuesta del server:', _respLogin);

            //almacenar datos del cliente y jwt en estado global de la aplicacion o en storage del navegador...
            
            //-------------------- codigo anterior cuando en el global-state pasaba funcion setter del state------
            //setClienteLogged( { datoscliente: _respLogin.datoscliente, jwt: _respLogin.tokensesion } );
            dispatch( 
                        { 
                            type:'CLIENTE_LOGGED',
                            payload: { datoscliente: _respLogin.datoscliente, jwt: _respLogin.tokensesion } 
                        } 
                    );
            navigate("/");
                
        } catch (error) {
            console.log('error en login...', error);            
        }
    }


    return (
        <div className="container pt-5">
            <div className="row">
                <div className="col-7 pt-3">
                    <h2>Registrate en <strong>agapea.com</strong></h2>
                    <p>Regístrate en agapea.com y disfruta de todos sus beneficios y comodidades.</p>

                    <div className="m-4">
                        <Link to="/Cliente/Registro" className="btn btn-primary btn-lg">Registrate</Link>
                    </div>

                    <p className="mt-4"><b>Crea tus propias listas de libros</b> (<a href="">Consultar información</a>)</p>

                    <div className="d-flex justify-content-center mt-5">
                        <img src="/images/imagen-login.png" alt=""/>
                    </div>
                </div>
                <div className="col-5 bg-light p-4 border">

                    <form onSubmit={ HandlerSubmitForm }>
                        <h4>Identifícate con:</h4>

                        <p>Usuario de <img src="/images/agapea-logo.svg" alt="" width="123" height="60"/></p>

                        <div className="form-floating m-1">
                            <input type="email" className="form-control" name="email" id="Email" placeholder="Mi usuario" onChange={HandlerChangeInputs}  />
                            <label htmlFor="floatingInput">Email</label>
                        </div>

                        <div className="form-floating m-1">
                            <input type="password" className="form-control" id="Contraseña" name="password" placeholder="Contraseña" onChange={HandlerChangeInputs} />
                            <label htmlFor="floatingPassword"><small>Contraseña</small></label>
                        </div>


                        <div className="mt-2 ml-1">
                            <a href=""><small className="text-mutted">¿Has olvidado tu contraseña?</small></a>
                        </div>

                        <button className="m-4 btn btn-lg btn-primary" type="submit">Identifícate</button>

                        <div className="ml-1">
                            <p className="text-muted">Al identificarte, aceptas nuestras <a className="text-muted" href="">Condiciones de uso, y nuestras condiciones de cookies</a></p>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}
export default Login;