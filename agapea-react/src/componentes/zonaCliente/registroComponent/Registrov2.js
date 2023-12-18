import { useState } from "react";

function Registrov2(){
    //establecer en el state del componente un objeto q tenga como propiedades el nombre de los campos
    //del formulario

    const[formData,setFormData]=useState(
        {
            email:{ 
                    value:'',
                    placeholder:'mio@mio.es',
                    touched: false,
                    valid: false,
                    validators: {
                                  required:[true,'* Email es obligatorio'] ,
                                  pattern:[ '^.*@.*\\.[a-z]{2,3}$', '* Formato de Email invalido']
                                },
                    validationMessage:''
                     },
            repemail:{ 
                    value:'',
                    placeholder:'mio@mio.es',
                    touched: false,
                    valid: false,
                    validators: {
                                  required:[true,'* Repetir tu email es obligatorio'] ,
                                  pattern:[ '^.*@.*\\.[a-z]{2,3}$', '* Formato de Email invalido'],
                                  compareto:['email', '* los emails deben coincidir']
                                },
                    validationMessage:''
                    },
            password:{ 
                    value:'',
                    placeholder:'tu contraseña',
                    touched: false,
                    valid: false,
                    validators: {
                                  required:[ true,'* Contraseña es obligatoria'] ,
                                  pattern:[ '^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$', '* la contraseña debe contener MAYS,MINS, digito y otro caracter'],
                                  minlength:[ 8, '* la contraseña debe tener al menos 8 caracteres']
                                },
                    validationMessage:''
                    },
            reppassword:{ 
                    value:'',
                    placeholder:'repetir contraseña',
                    touched: false,
                    valid: false,
                    validators: {
                                  required: [true,'* Repetir Contraseña es obligatorio'] ,
                                  pattern:[ '^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$', '* la contraseña debe contener MAYS,MINS, digito y otro caracter'],
                                  minlength:[ 8, '* la contraseña debe tener al menos 8 caracteres'],
                                  compareto:['password', '* las contraseñas deben coincidir']
                                },
                    validationMessage:''
                    },
            nombre:{ 
                  value:'',
                  placeholder:'mi nombre',
                  touched: false,
                  valid: false,
                  validators: {
                                required: [true,'* Nombre es obligatorio'] ,
                                pattern:[ '^[a-zA-Z\\s]{3,}$', '* solo se admiten letras en el nombre'],
                                minlength:[ 3, '* el nombre debe contener al menos 3 caracteres'],
                                maxlength: [ 50, '* el nombre no puede superar los 50 caracteres']
                              },
                  validationMessage:''
                  },
            apellidos:{ 
              value:'',
              placeholder:'mis apellidos',
              touched: false,
              valid: false,
              validators: {
                            required: [true,'* Apellidos es obligatorio'] ,
                            pattern:[ '^[a-zA-Z\\s]{3,}$', '* solo se admiten letras en los apellidos'],
                            minlength:[ 3, '* los apellidos debe contener al menos 3 caracteres'],
                            maxlength: [ 100, '* los apellidos no puede superar los 100 caracteres']
                          },
              validationMessage:''
              },
            login:{ 
              value:'',
              placeholder:'nickname de tu usuario',
              touched: false,
              valid: true,
              validators: {
                pattern:[ '^(?=.*\\d)?(?=.*[\u0021-\u002b\u003c-\u0040])?(?=.*[A-Z])?(?=.*[a-z])\\S{3,}$', '* formato de login incorrecto, al menos 3 letras MINS'],
                minlength:[ 3, '* el login debe contener al menos 3 caracteres'],                
               },
              validationMessage:''
              },
            telefono:{ 
              value:'',
              placeholder:'tu telefono con formato XXX YY ZZ WW',
              touched: false,
              valid: false,
              validators: {
                            pattern:[ '^\\d{3}\\s?(\\d{2}\\s?){2}\\d{2}$', '* formato de telefono incorrecto: 111 22 33 44']
                          },
              validationMessage:''
              }
        }
    );


    function HandlerOnBlurEvents(ev){

      const {value,name}=ev.target;
      if (name === 'login' && value.trim()==='') return;

      let _validField=true;
      let _errorMessage='';

      Object.keys(formData[name].validators).forEach(
        (validator)=>{
                      switch (validator) {
                        case 'required':
                              _validField=value.trim() !== '';
                          break;

                        case 'pattern':
                              _validField=new RegExp(formData[name].validators[validator][0]).test(value);
                          break;

                        case 'minlength':
                              _validField=value.length >= formData[name].validators[validator][0];
                          break;

                        case 'maxlength':
                              _validField=value.length < formData[name].validators[validator][0];
                          break;

                        case 'compareto':
                          let _campoacomparar=formData[name].validators[validator][0];
                          _validField=value === formData[_campoacomparar].value;
                          break;
                          
                        default:
                          break;
                      }
                      
                      if (! _validField) { 
                                            _errorMessage=formData[name].validators[validator][1]; 
                                            return;
                      } 
        }
      );
        
      let _copyInputFormData={ ...formData[name], value, touched:true, valid: _errorMessage ===''  , validationMessage: _errorMessage };
      
      console.log(`valor validacion input ${name}`, _copyInputFormData);
        
        setFormData(
            {
              ...formData,
              [name]:_copyInputFormData,
            }
          );


     }

     function HandlerChangeEvents(ev){
        //funcion unica q maneja todos los eventos onchange de toodos los input del formulario
        //¿como detecto la caja q se esta modificando? ev.target
        //ev.target tiene dos propiedades:
        //      .name <---- valor del atributo name=".." del <input... <=== lo usamos para saber q caja dispara el evento
        //      .value <--- el contenido de la caja <input...
        
        let _copyInputFormData={ ...formData[ev.target.name], value:ev.target.value, touched:true };
        setFormData( 
                {
                     ...formData,
                    [ev.target.name]: _copyInputFormData
                } 
            ); // tengo q establecer en el objeto del state formData el campo q se ha modificado, el resto sigue igual
      }

    function SubmitForm(ev){
        ev.preventDefault();

        if (formData['login'].value==='') { formData['login'].value= formData['email'].value ; } //<--- si el login esta vacio, lo ponemos como el email...
        
        console.log('valor del objeto del state formData....', formData);
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
                
                  <div className="col-md-6">
                    <label htmlFor="inputEmail4" className="form-label">Correo Electronico:</label>                
                    <input type="email" className="form-control" id="inputEmail4" name="email" placeholder={formData.email.placeholder} value={formData.email.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.email.valid && formData.email.touched) && ( <span className="text-danger">{formData.email.validationMessage}</span>) }
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputEmail5" className="form-label">Repetir Correo Electronico:</label>
                    <input type="email" className="form-control" id="inputEmail5" name="repemail" placeholder={formData.repemail.placeholder} value={formData.repemail.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.repemail.valid && formData.repemail.touched ) && ( <span className="text-danger">{formData.repemail.validationMessage || '* Emails no coinciden'}</span>) }
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputPassword4" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="inputPassword4" name="password" placeholder={formData.password.placeholder} value={formData.password.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.password.valid && formData.password.touched ) && ( <span className="text-danger">{formData.password.validationMessage}</span>) }
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputPassword5" className="form-label">Repetir Contraseña</label>
                    <input type="password" className="form-control" id="inputPassword5" name="reppassword" placeholder={formData.reppassword.placeholder} value={formData.reppassword.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.reppassword.valid && formData.reppassword.touched ) && ( <span className="text-danger">{formData.reppassword.validationMessage || '* Contraseñas no coinciden'}</span>) }
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputNombre" className="form-label">Nombre:</label>
                    <input type="text" className="form-control" id="inputNombre"  name="nombre" placeholder={formData.nombre.placeholder} value={formData.nombre.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.nombre.valid && formData.nombre.touched) && ( <span className="text-danger">{formData.nombre.validationMessage}</span>) }
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputApellidos" className="form-label">Apellidos:</label>
                    <input type="text" className="form-control" id="inputApellidos"  name="apellidos" placeholder={formData.apellidos.placeholder} value={formData.apellidos.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.apellidos.valid && formData.apellidos.touched) && ( <span className="text-danger">{formData.apellidos.validationMessage}</span>) }
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputLogin" className="form-label">Usuario:</label>
                    <input type="text" className="form-control" id="inputLogin"  name="login" placeholder={formData.login.placeholder} value={formData.login.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.login.valid && formData.login.touched) && ( <span className="text-danger">{formData.login.validationMessage}</span>) }
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputTelefono" className="form-label">Telefono:</label>
                    <input type="text" className="form-control" id="inputTelefono"  name="telefono" placeholder={formData.telefono.placeholder} value={formData.telefono.value} onChange={HandlerChangeEvents} onBlur={HandlerOnBlurEvents}></input>
                    { (! formData.telefono.valid && formData.telefono.touched) && ( <span className="text-danger">{formData.telefono.validationMessage}</span>) }

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


export default Registrov2;