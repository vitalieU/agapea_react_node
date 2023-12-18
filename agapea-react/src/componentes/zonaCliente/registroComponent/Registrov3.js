import { useState } from "react";
import FormField from "../../../view_componentes/FormField";
import clienteRESTService from '../../../servicios/restCliente';


function Registrov3(){

    //--------- en vez de poner las validaciones y demas en el state del formdata, es mas propio de la logica interna del componente y la vista, no de los datos a mandar al server...
    //para eso nos creamos un componente FormField al q pasamos todos los datos q necesita para hacer validacion de forma interna...
    //y dejamos el formData del state con lo q nos interesa realmente,q es el value de cada campo:

    const [formData, setFormData]=useState( { email:'', repemail:'', password:'', reppassword:'',nombre:'', apellidos:'', login:'', telefono:''});
    

    //funcion para hacer SUBIR-UP-STATE en componentes hijos (modificar el state formData)
    //desde compònentes FormField
    // tiene q pasar como argumentos el name del input y el value del mismo

    //1º paso: definir funcion q modifica el state en comp.padre
    //2º paso: pasar esta funcion como propiedad a los comp.hijos, en este caso comp. FormField
    //3º paso: en comp.hijos, ante un evento q se produzca en los mismos invocar esta funcion
    function HandlerChangeEvents(name,value){ //<--- funcion que se invoca desde componentes hijos FormField cuando se produce su evento onChange...se la pasamos coo prop.
        setFormData( 
                {
                     ...formData,
                    [name]: value
                } 
            ); 
      }

    async function SubmitForm(ev){
        
       try {
            ev.preventDefault();

            if (formData['login'].value==='') { formData['login'].value= formData['email'].value ; } //<--- si el login esta vacio, lo ponemos como el email...
            
            console.log('valor del objeto del state formData....', formData);
            
            let {repemail,reppassword, ...datoscliente}=formData;

            let _respuestaServer=await clienteRESTService.RegistrarCliente(datoscliente);
            console.log('respuesta del server ante el registro de datos...', _respuestaServer);
        
       } catch (error) {
          console.log('error en registro...', error);
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
                <p>Registro con <img src="/images/agapea-logo.svg" width="186px" height="85px" alt=''/></p>
            </div>
        </div>
        
        <hr />
        
        <div className="row">
            <div className="col">
                <form  className="row g-3" onSubmit={SubmitForm}>
                 {
                    [
                        { 
                            id:'email',
                            value: formData.email,
                            type:'email',
                            name:'email',
                            label:'Correo Electronico',
                            placeholder:'mio@mio.es',
                            validators:{
                                    required:[true,'* Email es obligatorio'] ,
                                    pattern:[ '^.*@.*\\.[a-z]{2,3}$', '* Formato de Email invalido']
                                  }                                                            
                        },
                        { 
                            id:'repemail',
                            value: formData.repemail,
                            type:'email',
                            name:'repemail',
                            label:'Repetir Correo Electronico',
                            placeholder:'mio@mio.es',
                            validators:{
                                required:[true,'* Repetir tu email es obligatorio'] ,
                                pattern:[ '^.*@.*\\.[a-z]{2,3}$', '* Formato de Email invalido'],
                                compareto:['email', '* los emails deben coincidir']
                                  }                                                            
                        },
                        { 
                            id:'password',
                            value: formData.password,
                            type:'password',
                            name:'password',
                            label:'Contraseña',
                            placeholder:'Tu contraseña',
                            validators:{
                                required:[ true,'* Contraseña es obligatoria'] ,
                                pattern:[ '^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$', '* la contraseña debe contener MAYS,MINS, digito y otro caracter'],
                                minlength:[ 8, '* la contraseña debe tener al menos 8 caracteres']
                                  }                                                            
                        },
                        { 
                            id:'reppassword',
                            value: formData.reppassword,
                            type:'password',
                            name:'reppassword',
                            label:'Repetir Contraseña',
                            placeholder:'Repite Tu contraseña',
                            validators:{
                                required: [true,'* Repetir Contraseña es obligatorio'] ,
                                pattern:[ '^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$', '* la contraseña debe contener MAYS,MINS, digito y otro caracter'],
                                minlength:[ 8, '* la contraseña debe tener al menos 8 caracteres'],
                                compareto:['password', '* las contraseñas deben coincidir']
                                  }                                                            
                        },
                        { 
                            id:'nombre',
                            value: formData.nombre,
                            type:'text',
                            name:'nombre',
                            label:'Nombre',
                            placeholder:'tu nombre...',
                            validators:{
                                required: [true,'* Nombre es obligatorio'] ,
                                pattern:[ '^[a-zA-Z\\s]{3,}$', '* solo se admiten letras en el nombre'],
                                minlength:[ 3, '* el nombre debe contener al menos 3 caracteres'],
                                maxlength: [ 50, '* el nombre no puede superar los 50 caracteres']
                                  }                                                            
                        },
                        { 
                            id:'apellidos',
                            value: formData.apellidos,
                            type:'text',
                            name:'apellidos',
                            label:'Apellidos',
                            placeholder:'tus apellidos...',
                            validators:{
                                required: [true,'* Apellidos es obligatorio'] ,
                                pattern:[ '^[a-zA-Z\\s]{3,}$', '* solo se admiten letras en los apellidos'],
                                minlength:[ 3, '* los apellidos debe contener al menos 3 caracteres'],
                                maxlength: [ 100, '* los apellidos no puede superar los 100 caracteres']
                                  }                                                            
                        },
                        { 
                            id:'login',
                            value: formData.login,
                            type:'text',
                            name:'login',
                            label:'Usuario o nickname',
                            placeholder:'tu nick de cara a dar opinion...',
                            validators:{
                                pattern:[ '^(?=.*\\d)?(?=.*[\u0021-\u002b\u003c-\u0040])?(?=.*[A-Z])?(?=.*[a-z])\\S{3,}$', '* formato de login incorrecto, al menos 3 letras MINS'],
                                minlength:[ 3, '* el login debe contener al menos 3 caracteres']
                                  }                                                            
                        },
                        { 
                            id:'telefono',
                            value: formData.telefono,
                            type:'text',
                            name:'telefono',
                            label:'Telefono contacto',
                            placeholder:'tu telefono con formato XXX YY ZZ WW',
                            validators:{
                                required:[true, '* el telefono de contacto es obligatorio'],
                                pattern:[ '^\\d{3}\\s?(\\d{2}\\s?){2}\\d{2}$', '* formato de telefono incorrecto: 111 22 33 44']
                                  }                                                            
                        }
                    ].map( el => (
                                    <div className="col-md-6" key={el.name}>
                                        <FormField  id={el.id} label={el.label} name={el.name} placeholder={el.placeholder} type={el.type} value={el.value} validators={el.validators} onChangeInParent={HandlerChangeEvents}></FormField>
                                    </div>))
                 }   
                

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
                      <input className="form-check-input" type="checkbox" id="checkCondiciones" name="condUso" value="true" defaultChecked></input>
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

export default Registrov3;