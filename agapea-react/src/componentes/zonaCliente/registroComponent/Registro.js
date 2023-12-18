
import { useState } from 'react';

function Registro(){

    const [email, setEmail]=useState("ejemplo@ejemplo.es");
    const [repemail, setRepEmail]=useState("ejemplo@ejemplo.es");
    const [password, setPassword] = useState();    
    const [reppassword, setRepPassword] = useState();
    const [nombre, setNombre]=useState("mi nombre");
    const [apellidos, setApellidos]=useState("mis apellidos");
    const [login, setLogin]=useState("nombre de usuario o login");
    const [tlfno, setTlfno]=useState("mi telefono");


    function SubmitForm(ev){
        ev.preventDefault(); //<---- interrumpe el comportamiento q por defecto tiene el evento tratado con esta funcion handler; como el evento es de tipo SUBMIT se interrumpe el proceso
                             // de envio de datos, se vacie el formulario y se refresque el componente...

        console.log(ev);

        // antes de formar el objeto a mandar al servidor comprobamos reglas de validacion
        // required: todos menos el tlfno
        // email==repemail, y tener formato de email <=== expresion regular comprobar formato email tanto de email como repemail
        // password==reppassword y tener fortaleza <===== expresion regular comprobar formato password y reppassord: mayor de 6 caracteres, una MAYS, un digito y un caracter raro
        // nombre y apellidos una longitud mininma de 3 caracteres y maxima de 1000
        // login coincida con email si esta en blanco, sino esta relleno minimo 3 caracteres

        if (true) {
            const valoresRegistro={ email, password, nombre, apellidos, login, tlfno};
            console.log('valores a mandar al servidor...', valoresRegistro);
            //mandar por ajax ese objeto a servicio REST de nodejs
            
        } else {
            //mostrar mensajes de error...
            return;
        }
    }


    return (
        <div className="container">
        <div className="row">
            <div className="col">
                <h2><strong>Registrate en Agapea.com</strong></h2>
                <p>Tienes tres opciones para registrarte en agapea.com. Tienes tres opciones para registrarte en agapea.com. y disfrutar de nuestros servicios y ventajas. </p>
                <p>Puedes hacerlo a través de las redes sociales en 4 segundos. O registrarte con nosotros, no tardarás más de 40 segundos en hacerlo. Solo tendrás que rellenar el siguiente formulario con tus datos. </p>
            </div>
        </div>

        <div className="row">
            <div className="col">
                <p>Registro con <img src="/images/agapea-logo.svg" width="186px" height="85px" alt=""/></p>
            </div>
        </div>
        
        <hr />
        
        <div className="row">
            <div className="col">
                <form  className="row g-3" onSubmit={SubmitForm}>
                
                  <div className="col-md-6">
                    <label htmlFor="inputEmail4" className="form-label">Correo Electronico:</label>                
                    <input type="email" className="form-control" id="inputEmail4" placeholder={email} value={email} onChange={(ev)=>setEmail(ev.target.value)}></input>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputEmail5" className="form-label">Repetir Correo Electronico:</label>
                    <input type="email" className="form-control" id="inputEmail5" placeholder={repemail} value={repemail} onChange={(ev)=>setRepEmail(ev.target.value)}></input>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputPassword4" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="inputPassword4" placeholder="contraseña" value={password} onChange={(ev)=>setPassword(ev.target.value)}></input>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputPassword5" className="form-label">Repetir Contraseña</label>
                    <input type="password" className="form-control" id="inputPassword5" placeholder="repetir contraseña" value={reppassword} onChange={(ev)=>setRepPassword(ev.target.value)}></input>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputNombre" className="form-label">Nombre:</label>
                    <input type="text" className="form-control" id="inputNombre"  placeholder={nombre} value={nombre} onChange={(ev)=>setNombre(ev.target.value)}></input>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputApellidos" className="form-label">Apellidos:</label>
                    <input type="text" className="form-control" id="inputApellidos"  placeholder={apellidos} value={apellidos} onChange={(ev)=>setApellidos(ev.target.value)}></input>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputLogin" className="form-label">Usuario:</label>
                    <input type="text" className="form-control" id="inputLogin"  placeholder={login} value={login} onChange={(ev)=>setLogin(ev.target.value)}></input>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputTelefono" className="form-label">Telefono:</label>
                    <input type="text" className="form-control" id="inputTelefono"  placeholder={tlfno} value={tlfno} onChange={(ev)=>setTlfno(ev.target.value)}></input>
                  </div>

                  <p><small className="text-mutted">Agapea S.A se compromete a garantizar la seguridad de tus datos y a guardarlos en la más estricta confidencialidad.</small></p>
                  <hr></hr>

                  <div className="col-12">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="checkInfo"></input>
                      <label className="form-check-label" htmlFor="checkInfo">                    
                        Deseo recibir información sobre libros, novedades y eventos de Agapea.com o sus librerías.                
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="checkCondiciones" name="condUso" value="true" checked></input>
                      <label className="form-check-label" htmlFor="checkCondiciones">                    
                        Acepto las condiciones de uso y nuestra politica de cookies.               
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-lg">REGISTRAME</button>
                  </div>
                </form>
            </div>
        </div>
    </div>

    )

}

export default Registro;